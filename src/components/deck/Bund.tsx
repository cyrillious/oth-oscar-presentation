import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

// The OSCAR key ring of the solution slide, built as a small physics toy.
// Every unit (a motel tag with an OSCAR object on a short chain) and the key are damped pendulums that
// hang from the ring. The cursor pushes whatever it sweeps across, neighbours push each other apart,
// and a unit can be grabbed and flung. Each unit swings the way its method behaves (see PHYS).

export type CharmKind = 'bubbles' | 'ticket' | 'bucket' | 'shield'
type Kind = CharmKind | 'ring' | 'key'

type Phys = {
  /** Natural frequency (rad/s): low = slow, heavy swing. */
  w0: number
  /** Damping ratio: low = keeps swinging, high = settles at once. */
  zeta: number
  /** How strongly the cursor pushes it. */
  kick: number
  /** Largest swing in rad. */
  limit: number
}

const PHYS: Record<Kind, Phys> = {
  // Weirding the Normal (sponge): floaty, hardly any weight, swings on and on.
  bubbles: { w0: 2.8, zeta: 0.1, kick: 1.1, limit: 1.1 },
  // Only Is Better Than Best (membership card): a tight, clean swing.
  ticket: { w0: 4, zeta: 0.16, kick: 1, limit: 1.2 },
  // The True Competitor (nozzle): heavy and slow, spills when pushed hard.
  bucket: { w0: 2.4, zeta: 0.07, kick: 0.8, limit: 1 },
  // The Real Product & Find the Fear (car): everything swings, the car stands still.
  shield: { w0: 5.5, zeta: 0.75, kick: 0.9, limit: 0.6 },
  ring: { w0: 1.8, zeta: 0.25, kick: 0.35, limit: 0.22 },
  // The key: light and quick, rattles against its neighbour.
  key: { w0: 3.4, zeta: 0.12, kick: 1.2, limit: 1.1 },
}

/** The cursor, shared by all bodies: one listener, velocity in px/s. */
const pointer = { x: -1e4, y: -1e4, vx: 0, t: 0 }
let bound = false
function bindPointer() {
  if (bound || typeof window === 'undefined') return
  bound = true
  let lx = 0
  let lt = 0
  window.addEventListener(
    'pointermove',
    (e) => {
      const now = performance.now()
      pointer.vx = ((e.clientX - lx) / Math.max(1, now - lt)) * 1000
      lx = e.clientX
      lt = now
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.t = now
    },
    { passive: true },
  )
}

/** A hanging body of the key ring as the others see it: where its tip is, and how to grab it. */
type Body = {
  order: number
  /** Pivot x and distance pivot → centre of mass, in px of the ring box (not the screen). */
  px: number
  L: number
  /** Minimum distance to the next body's tip before they push each other. */
  gap: number
  th: number
  /** Is the pixel under the cursor part of this body (alpha of its image)? */
  hit: (cx: number, cy: number) => boolean
  grab: (e: PointerEvent | React.PointerEvent) => void
}
const world = new Map<string, Body>()

type Swing = {
  spin?: number
  ambient?: number
  /** Where the body would hang at rest (rad), so neighbours fan out. */
  rest?: number
  onKick?: () => void
  /** Pivot inside the box (share of width / height). */
  pivot: { x: number; y: number }
  /** Takes part in the world: collisions, grabbing, hover. */
  body?: { id: string; order: number; px: number; L: number; gap: number; src: string }
}

/** Low-res copy of an image's alpha channel, to tell a click on the tag from a click next to it. */
const alphaCache = new Map<string, Promise<{ w: number; h: number; a: Uint8ClampedArray }>>()
function alphaOf(src: string) {
  let p = alphaCache.get(src)
  if (!p) {
    p = new Promise((res) => {
      const img = new Image()
      img.onload = () => {
        const w = 120
        const h = Math.round((w * img.naturalHeight) / img.naturalWidth)
        const c = document.createElement('canvas')
        c.width = w
        c.height = h
        const ctx = c.getContext('2d', { willReadFrequently: true })!
        ctx.drawImage(img, 0, 0, w, h)
        const d = ctx.getImageData(0, 0, w, h).data
        const a = new Uint8ClampedArray(w * h)
        for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]
        res({ w, h, a })
      }
      img.src = src
    })
    alphaCache.set(src, p)
  }
  return p
}

/**
 * Pendulum on a transform: rotates `ref` around its pivot (set `transform-origin` on the element).
 * `spin` is the angular velocity it starts with, `onKick` fires on a hard swing (at most every 0.8s).
 */
function useSwing(ref: RefObject<HTMLElement | null>, kind: Kind, opts: Swing) {
  const reduce = useReducedMotion()
  const kickRef = useRef(opts.onKick)
  kickRef.current = opts.onKick
  const { spin = 0, ambient = 0.04, rest = 0, pivot, body } = opts
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const box = el.parentElement as HTMLElement
    bindPointer()
    const p = PHYS[kind]
    const phase = Math.random() * 6.28
    let th = rest
    let w = spin
    let last = performance.now()
    let cool = 0
    let raf = 0
    let dragging = false
    let alpha: { w: number; h: number; a: Uint8ClampedArray } | null = null
    if (body) alphaOf(body.src).then((a) => (alpha = a))

    /** Screen point → position inside the (unrotated) box in share of its size, undoing the current swing. */
    const local = (cx: number, cy: number) => {
      const r = box.getBoundingClientRect()
      const vx = cx - (r.left + (r.width * pivot.x) / 100)
      const vy = cy - (r.top + (r.height * pivot.y) / 100)
      const c = Math.cos(th)
      const s = Math.sin(th)
      return { u: (vx * c + vy * s + (r.width * pivot.x) / 100) / r.width, v: (-vx * s + vy * c + (r.height * pivot.y) / 100) / r.height, r }
    }

    const self: Body | undefined = body && {
      order: body.order,
      px: body.px,
      L: body.L,
      gap: body.gap,
      th,
      hit: (cx, cy) => {
        if (!alpha) return false
        const { u, v } = local(cx, cy)
        if (u < 0 || u > 1 || v < 0 || v > 1) return false
        return alpha.a[Math.floor(v * alpha.h) * alpha.w + Math.floor(u * alpha.w)] > 40
      },
      grab: (e) => {
        dragging = true
        w = 0
        let lastTh = th
        let lastT = performance.now()
        const pr = box.getBoundingClientRect()
        const pivX = pr.left + (pr.width * pivot.x) / 100
        const pivY = pr.top + (pr.height * pivot.y) / 100
        const move = (ev: PointerEvent) => {
          // The body follows the cursor on its arc: hanging straight down = cursor below the pivot.
          const target = Math.max(-1.5, Math.min(1.5, Math.atan2(pivX - ev.clientX, Math.max(30, ev.clientY - pivY))))
          const now = performance.now()
          const next = th + (target - th) * 0.4
          w = (next - lastTh) / Math.max(0.008, (now - lastT) / 1000)
          lastTh = next
          lastT = now
          th = next
          el.style.transform = `rotate(${th}rad)`
        }
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
          window.removeEventListener('pointercancel', up)
          dragging = false
          w = Math.max(-9, Math.min(9, w))
          last = performance.now()
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
        window.addEventListener('pointercancel', up)
        move(e as PointerEvent)
      },
    }
    if (body && self) world.set(body.id, self)

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      if (!dragging) {
        const r = el.getBoundingClientRect()
        const fresh = now - pointer.t < 80
        if (fresh && pointer.x > r.left - 16 && pointer.x < r.right + 16 && pointer.y > r.top - 16 && pointer.y < r.bottom + 16) {
          // Hanging down, a push to the right swings the bottom to the right = negative CSS rotation.
          w -= Math.max(-3000, Math.min(3000, pointer.vx)) * p.kick * 0.0003 * Math.max(dt * 60, 0.5)
        }
        const steps = Math.max(1, Math.ceil(dt / 0.008))
        const h = dt / steps
        for (let i = 0; i < steps; i++) {
          const drive = ambient * p.w0 * p.w0 * Math.sin((now / 1000) * 1.1 + phase)
          let acc = -p.w0 * p.w0 * Math.sin(th - rest) - 2 * p.zeta * p.w0 * w + drive
          if (body && self) {
            // Soft contact with the bodies hanging either side: tips closer than `gap` push apart.
            const tip = body.px - body.L * Math.sin(th)
            for (const o of world.values()) {
              if (o === self || o.order !== body.order - 1 && o.order !== body.order + 1) continue
              const d = (body.order < o.order ? 1 : -1) * (o.px - o.L * Math.sin(o.th) - tip)
              const gap = Math.max(body.gap, o.gap)
              if (d < gap) acc += (body.order < o.order ? 1 : -1) * (9 * (gap - d)) / body.L
            }
          }
          w += acc * h
          th += w * h
          if (Math.abs(th) > p.limit) {
            th = Math.sign(th) * p.limit
            w *= -0.4
          }
        }
        el.style.transform = `rotate(${th}rad)`
        if (Math.abs(w) > 2.2 && now > cool) {
          cool = now + 800
          kickRef.current?.()
        }
      }
      if (self) self.th = th
      // Glare: where the cursor is on the body, for the highlight that follows it.
      if (fresh2(now)) {
        const { u, v } = local(pointer.x, pointer.y)
        el.style.setProperty('--gx', `${(u * 100).toFixed(1)}%`)
        el.style.setProperty('--gy', `${(v * 100).toFixed(1)}%`)
      }
      raf = requestAnimationFrame(tick)
    }
    const fresh2 = (now: number) => now - pointer.t < 1500
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (body) world.delete(body.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, kind, reduce, spin, ambient, rest, body?.id, body?.px, body?.L, body?.gap])
}

/** Where the split ring clasps the key ring in a unit image (share of width / height): the swing pivots around it. */
const PIVOT_X = 37
const PIVOT_Y = 13
/** Unit image: 677 × 903. */
const CHARM_ASPECT = '677 / 903'
const UNIT_PIVOT = { x: PIVOT_X, y: PIVOT_Y }

/** Highlight that follows the cursor over the metal and the glossy tags, cut to the shape of the image. */
function Glare({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        backgroundImage: 'radial-gradient(circle at var(--gx, -50%) var(--gy, -50%), rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 38%)',
      }}
    />
  )
}

type CharmProps = {
  kind: CharmKind
  src: string
  alt: string
  /** The pointer is over the card this charm hangs on. */
  hovered?: boolean
  /** Size comes from the parent: the charm fills its height. */
  className?: string
  /** The un-rotated box, for measuring where the charm is. */
  boxRef?: RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void)
  spin?: number
  rest?: number
  /** Takes part in the key ring's world (collisions, grabbing). */
  body?: Swing['body']
}

/** One charm: swings on its own, and answers a hover with the behaviour of its method. */
export function Charm({ kind, src, alt, hovered = false, className = '', boxRef, spin, rest, body }: CharmProps) {
  const swing = useRef<HTMLDivElement>(null)
  const [drops, setDrops] = useState<number[]>([])
  const [hoverCount, setHoverCount] = useState(0)
  const wasHovered = useRef(false)
  useEffect(() => {
    if (hovered && !wasHovered.current) setHoverCount((c) => c + 1)
    wasHovered.current = hovered
  }, [hovered])

  useSwing(swing, kind, {
    spin,
    rest,
    body,
    pivot: UNIT_PIVOT,
    onKick:
      kind === 'bucket'
        ? () => {
            const id = performance.now()
            setDrops((d) => [...d, id, id + 1, id + 2])
            window.setTimeout(() => setDrops((d) => d.filter((x) => x < id || x > id + 2)), 1100)
          }
        : undefined,
  })

  return (
    <div ref={boxRef as RefObject<HTMLDivElement>} className={`relative ${className}`} style={{ aspectRatio: CHARM_ASPECT }}>
      <div ref={swing} className="size-full" style={{ transformOrigin: `${PIVOT_X}% ${PIVOT_Y}%` }}>
        <motion.div
          className="relative size-full"
          style={{ perspective: 800 }}
          animate={kind === 'shield' ? { scale: hoverCount ? [1, 1.08, 1] : 1 } : kind === 'bubbles' ? { scale: hovered ? [1, 1.04, 1] : 1 } : undefined}
          transition={kind === 'bubbles' ? { duration: 1.6, repeat: hovered ? Infinity : 0, ease: 'easeInOut' } : { duration: 0.5 }}
          key={kind === 'shield' ? hoverCount : undefined}
        >
          <motion.img
            src={src}
            alt={alt}
            className="size-full"
            draggable={false}
            // The ticket turns once on every hover: a one-off, seen from both sides.
            animate={kind === 'ticket' ? { rotateY: hoverCount * 360 } : undefined}
            transition={{ duration: 1.1, ease: [0.14, 0.71, 0.16, 0.99] }}
          />
          <Glare src={src} />
          {kind === 'ticket' && (
            // Gloss that runs over the ticket on hover, cut to the shape of the image.
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                backgroundImage: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.7) 50%, transparent 62%)',
                backgroundSize: '300% 100%',
              }}
              initial={{ backgroundPositionX: '120%' }}
              animate={{ backgroundPositionX: hoverCount ? ['120%', '-20%'] : '120%' }}
              transition={{ duration: 0.9, ease: [0.14, 0.71, 0.16, 0.99] }}
              key={hoverCount}
            />
          )}
        </motion.div>
      </div>

      {/* Weirding (sponge): a few bubbles lift off and pop. */}
      {kind === 'bubbles' &&
        hoverCount > 0 &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={`${hoverCount}-${i}`}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-ink/15 bg-paper/70"
            style={{ left: `${52 + i * 6}%`, top: '42%', width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6 }}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -50 - i * 12, scale: [0.6, 1, 1.3] }}
            transition={{ duration: 1.3, delay: i * 0.1, ease: 'easeOut' }}
          />
        ))}

      {/* Competitor: swung hard, the nozzle drips. */}
      {drops.map((id, i) => (
        <motion.span
          key={id}
          aria-hidden="true"
          className="pointer-events-none absolute h-[10px] w-[7px] rounded-full bg-ink/25"
          style={{ left: `${60 + (i % 3) * 5}%`, top: '82%' }}
          initial={{ opacity: 0.9, y: 0 }}
          animate={{ opacity: 0, y: 120 }}
          transition={{ duration: 0.9, ease: 'easeIn', delay: (i % 3) * 0.08 }}
        />
      ))}
    </div>
  )
}

/** The key: its own pendulum, hanging from the left of the ring. 364 × 1200, clasped at the top of its small ring. */
const KEY_PIVOT = { x: 50, y: 5 }
function KeyBody({ ringW }: { ringW: number }) {
  const swing = useRef<HTMLDivElement>(null)
  const w = ringW * 0.42
  const h = (w * 1200) / 364
  useSwing(swing, 'key', {
    spin: -1.2,
    rest: 0.08,
    pivot: KEY_PIVOT,
    body: { id: 'key', order: 0, px: ringW * 0.15, L: h * 0.5, gap: 70, src: '/images/schluesselbund/key.webp' },
  })
  return (
    <div className="absolute" style={{ left: '15%', top: '79%', width: w, transform: `translate(-${KEY_PIVOT.x}%, -${KEY_PIVOT.y}%)` }}>
      <div style={{ aspectRatio: '364 / 1200' }} className="relative">
        <div ref={swing} className="size-full" style={{ transformOrigin: `${KEY_PIVOT.x}% ${KEY_PIVOT.y}%` }}>
          <img src="/images/schluesselbund/key.webp" alt="" className="size-full" draggable={false} />
          <Glare src="/images/schluesselbund/key.webp" />
        </div>
      </div>
    </div>
  )
}

/** Ring diameter on the stage, px. */
const RING_W = 362
/** Where each unit's split ring clasps the key ring (share of the ring's width / height), its resting angle and size. */
const HANG: { x: number; y: number; rest: number; w: number }[] = [
  { x: 35.9, y: 93.3, rest: -0.16, w: 0.8 },
  { x: 56.3, y: 95.1, rest: 0.09, w: 0.86 },
  { x: 74.1, y: 88.6, rest: -0.07, w: 0.78 },
  { x: 87.3, y: 76.1, rest: 0.17, w: 0.8 },
]

export type BundProps = {
  charms: { kind: CharmKind; src: string; alt: string; name: string }[]
  /** Boxes of the four units in the key ring, so the slide can fly them to their cards. */
  boxes: MutableRefObject<(HTMLDivElement | null)[]>
  /** A click on the stage, not on a unit: take the key ring apart. */
  onRelease: () => void
}

/** Steel rod across the stage that the key ring hangs from. It lifts away when the ring is released. */
function Rod() {
  return (
    <motion.div
      aria-hidden="true"
      exit={{ y: -28, opacity: 0, transition: { duration: 0.5, ease: [0.14, 0.71, 0.16, 0.99] } }}
      className="absolute inset-x-0 top-[30px] h-[14px]"
      style={{
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #b9b9b9 38%, #4a4a4a 62%, #9c9c9c 100%)',
        boxShadow: '0 10px 18px rgba(0,0,0,0.28)',
      }}
    />
  )
}

/** The whole key ring: ring on a rod, the key and the four units hang from it as pendulums you can push and grab. */
export function Bund({ charms, boxes, onRelease }: BundProps) {
  const group = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [name, setName] = useState<{ text: string; x: number; y: number } | null>(null)
  const [grabbed, setGrabbed] = useState(false)
  useSwing(group, 'ring', { spin: reduce ? 0 : 0.6, pivot: { x: 50, y: 2 } })

  // The whole ring leans a few degrees towards the cursor, for depth.
  useEffect(() => {
    const el = tilt.current
    if (!el || reduce) return
    let rx = 0
    let ry = 0
    let raf = 0
    const tick = () => {
      const r = el.getBoundingClientRect()
      const fresh = performance.now() - pointer.t < 2500
      const tx = fresh ? Math.max(-1, Math.min(1, (pointer.x - (r.left + r.width / 2)) / 600)) : 0
      const ty = fresh ? Math.max(-1, Math.min(1, (pointer.y - (r.top + r.height / 3)) / 500)) : 0
      ry += (tx * 9 - ry) * 0.06
      rx += (-ty * 5 - rx) * 0.06
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }
    bindPointer()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  /** The unit (or key) under the cursor, topmost first. */
  const under = (cx: number, cy: number) => {
    const list = [...world.entries()].sort((a, b) => b[1].order - a[1].order)
    return list.find(([, b]) => b.hit(cx, cy)) ?? null
  }
  const downAt = useRef<{ x: number; y: number; onBody: boolean } | null>(null)

  return (
    <div
      ref={root}
      className="absolute inset-0"
      style={{ cursor: grabbed ? 'grabbing' : name ? 'grab' : 'pointer' }}
      onPointerMove={(e) => {
        if (grabbed) return
        const hit = under(e.clientX, e.clientY)
        const rect = root.current!.getBoundingClientRect()
        const s = rect.width / 1600
        const idx = hit ? Number(hit[0].replace('unit-', '')) : NaN
        setName(hit && !Number.isNaN(idx) ? { text: charms[idx].name, x: (e.clientX - rect.left) / s, y: (e.clientY - rect.top) / s } : null)
      }}
      onPointerLeave={() => setName(null)}
      onPointerDown={(e) => {
        const hit = under(e.clientX, e.clientY)
        downAt.current = { x: e.clientX, y: e.clientY, onBody: !!hit }
        if (!hit || reduce) return
        hit[1].grab(e)
        setGrabbed(true)
        setName(null)
        const done = () => {
          setGrabbed(false)
          window.removeEventListener('pointerup', done)
        }
        window.addEventListener('pointerup', done)
      }}
      onClick={(e) => {
        const d = downAt.current
        // A click on the bare stage lets go of the ring; a grab or a tap on a unit never does.
        if (d && !d.onBody && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) onRelease()
      }}
    >
      <Rod />
      <motion.div
        initial={reduce ? false : { y: -260, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 11 }}
        // Released: the ring falls with gravity (slow start, fast end) and tilts away.
        exit={{ y: 1100, rotate: 12, transition: { duration: 1, ease: [0.5, 0, 0.9, 0.4] } }}
        className="absolute top-[24px] -translate-x-1/2"
        style={{ left: '60%', width: RING_W, perspective: 1400 }}
      >
        {/* Soft shadow on the red: fixed light from above, so it stays put while the units swing. */}
        <div ref={tilt} style={{ filter: 'drop-shadow(0 26px 22px rgba(70,0,0,0.38))', transformStyle: 'preserve-3d' }}>
          <div ref={group} className="relative" style={{ aspectRatio: '1 / 1', transformOrigin: '50% 2%' }}>
            <img src="/images/schluesselbund/ring-only.webp" alt="" className="size-full" draggable={false} />
            <Glare src="/images/schluesselbund/ring-only.webp" />
            <KeyBody ringW={RING_W} />
            {charms.map((c, i) => (
              <div
                key={c.kind}
                className="absolute"
                style={{
                  left: `${HANG[i].x}%`,
                  top: `${HANG[i].y}%`,
                  width: `${HANG[i].w * 100}%`,
                  transform: `translate(-${PIVOT_X}%, -${PIVOT_Y}%)`,
                }}
              >
                <Charm
                  kind={c.kind}
                  src={c.src}
                  alt={c.alt}
                  className="w-full"
                  rest={HANG[i].rest}
                  spin={reduce ? 0 : (i % 2 ? -1 : 1) * (2.4 - i * 0.3)}
                  body={{ id: `unit-${i}`, order: i + 1, px: (HANG[i].x / 100) * RING_W, L: ((HANG[i].w * RING_W) / (677 / 903)) * 0.45, gap: 120, src: c.src }}
                  boxRef={(el) => {
                    boxes.current[i] = el
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* What a unit stands for, next to the cursor. */}
      <AnimatePresence>
        {name && (
          <motion.p
            key="name"
            className="pointer-events-none absolute whitespace-nowrap rounded-full bg-paper px-[16px] py-[6px] text-body text-ink"
            style={{ left: name.x + 18, top: name.y + 14 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {name.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
