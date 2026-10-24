import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SLIDE_W } from './Slide'

// Image trail of the title slide: pictures appear along the cursor and fade away again,
// a click on the slide turns to the next theme (word of the slogan + set of pictures).
// Every set is a small curation of several looks (film, pop, gloss), each with the feeling of its word.
// Pictures show a scene or a feeling, never a logo or a brand.

export type TrailImage = { src: string; /** width / height */ ratio: number }

export type TrailTheme = {
  key: 'sexy' | 'premium' | 'playful' | 'feel'
  word: string
  images: TrailImage[]
}

const M = '/images/mood/'
const img = (file: string, w: number, h: number): TrailImage => ({ src: `${M}${file}`, ratio: w / h })

export const THEMES: TrailTheme[] = [
  {
    // Sun, wet skin, film: the pin-up wash of the 90s, seen today.
    key: 'sexy',
    word: 'Sexy',
    images: [
      img('gelbes-taxi.jpg', 1147, 1400),
      img('windschutzscheibe-schlauch.webp', 1000, 1250),
      img('rote-hose.jpg', 1121, 1400),
      img('nasse-haare-schlauch.jpg', 1000, 640),
      img('hydrant-weiss.webp', 1000, 1250),
      img('motorhaube-sonne.jpg', 860, 1000),
      img('sponge-rad-sonne.jpg', 873, 1000),
      img('sonnenbrille-schlauch.webp', 1000, 1250),
      img('autofenster-sonne.webp', 1000, 1250),
      img('tropfen-haut.webp', 1000, 1250),
      img('rote-bluse-sonnenbrille.webp', 1000, 1243),
      img('jaguar-felge-sw.webp', 1000, 1000),
    ],
  },
  {
    // Car porn, cinematic: red paint, foam, studio light, night.
    key: 'premium',
    word: 'Premium',
    images: [
      img('studio-schaum-rot.webp', 1000, 1249),
      img('folie-dunkel.webp', 1000, 625),
      img('studio-hochdruck-rot.webp', 1000, 1249),
      img('rad-dampf-nacht.webp', 1000, 1246),
      img('schaum-fliesen-rot.webp', 1000, 1249),
      img('folie-helm-glut.webp', 1000, 1246),
      img('fender-schaum-rot.jpg', 577, 1000),
      img('garage-dunkel.webp', 1000, 752),
      img('lack-schimmer.webp', 1000, 1778),
      img('haube-tropfen-film.jpg', 411, 1000),
      img('heckleuchte-tropfen.webp', 1000, 1216),
      img('orchidee-haube.webp', 1000, 1143),
    ],
  },
  {
    // Lemonade stand, toys, bubbles, a garden hose: the wash as a summer game.
    key: 'playful',
    word: 'Playful',
    images: [
      img('cozy-coupe.jpg', 1050, 1400),
      img('limo-stand-kinder.jpg', 586, 1000),
      img('seifenblasen-garten.webp', 1000, 667),
      img('lego-autos.webp', 1000, 1600),
      img('zitronen-hafen.webp', 1000, 1333),
      img('pickup-wasser.webp', 1000, 666),
      img('limo-stand-diy.webp', 1000, 1078),
      img('regenbogen-schaum.webp', 1000, 1500),
      img('kaefer-spritzer.webp', 1000, 1500),
      img('pastell-schaum.webp', 1000, 796),
      img('seifenblasen-kind.webp', 1000, 1246),
      img('seifenblasen-geschwister.webp', 1000, 1332),
      img('eimer-wiese.webp', 1000, 1249),
      img('gartenschlauch.webp', 1000, 669),
    ],
  },
  {
    // Touch: hands on glass, foam, light on water. What a wash feels like.
    key: 'feel',
    word: 'Feel',
    images: [
      img('schwamm-gelbe-haube.jpg', 1000, 490),
      img('staub-handabdruck.webp', 1000, 1262),
      img('hand-schaum-fenster.webp', 1000, 1327),
      img('hand-nebelglas.webp', 1000, 1500),
      img('hand-regenscheibe-sw.webp', 1000, 1000),
      img('hand-scheinwerfer.webp', 1000, 1329),
      img('wassertropfen-licht.webp', 1000, 1250),
      img('schwamm.jpg', 948, 1400),
      img('scheibe-paar.jpg', 927, 1000),
      img('hydrant-sonne.webp', 1000, 667),
      img('vater-kind-waschen.webp', 1000, 1250),
      img('wagenfenster-lachen.webp', 1000, 667),
      img('handstand-gegenlicht.webp', 1000, 667),
      img('palme-hochdruck.webp', 1000, 1250),
    ],
  },
]

/** Loads every picture once, so none of them pops in while the trail runs. */
export function preloadTrail() {
  for (const t of THEMES) for (const i of t.images) new Image().src = i.src
}

const EASE = [0.14, 0.71, 0.16, 0.99] as const
/** Pictures on the stage at once. */
const MAX_ALIVE = 7

/** Depth of field: most pictures sit in focus, some drift soft in front of or behind them. Resting blur in px. */
const FOCUS = [0, 0, 0, 0, 4, 9] as const

type Shot = { id: number; src: string; x: number; y: number; w: number; h: number; rot: number; blur: number }

type TrailLayerProps = {
  images: TrailImage[]
  /** A click anywhere on the slide. Without it the click drops one more picture under the cursor. */
  onNext?: () => void
  /** Height of a picture in stage px (1600 × 900). */
  size?: number
  /** Distance the cursor travels before the next picture lands, in stage px. */
  gap?: number
  /** How long a picture stays, in ms. */
  life?: number
}

/**
 * Full-bleed layer behind the slide content. It listens on the scaled stage (.slide-inner), so the
 * cursor works over the text too, and it turns screen px into stage px.
 */
export function TrailLayer({ images, onNext, size = 300, gap = 150, life = 1600 }: TrailLayerProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [shots, setShots] = useState<Shot[]>([])
  const count = useRef(0)
  const serial = useRef(0)
  const last = useRef<{ x: number; y: number } | null>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const timers = useRef(new Set<number>())
  const live = useRef({ images, size, gap, life, onNext })
  live.current = { images, size, gap, life, onNext }

  const drop = (x: number, y: number) => {
    const { images: list, size: s, life: ms } = live.current
    if (!list.length) return
    const img = list[count.current++ % list.length]
    const blur = FOCUS[Math.floor(Math.random() * FOCUS.length)]
    // A soft picture reads as nearer to the lens, so it is cut a little larger.
    const w = Math.min(s * (0.85 + Math.random() * 0.35) * img.ratio * (blur ? 1.2 : 1), s * 1.8)
    const id = ++serial.current
    setShots((p) => [...p.slice(-(MAX_ALIVE - 1)), { id, src: img.src, x, y, w, h: w / img.ratio, rot: (Math.random() - 0.5) * 8, blur }])
    const t = window.setTimeout(() => {
      timers.current.delete(t)
      setShots((p) => p.filter((o) => o.id !== id))
    }, ms)
    timers.current.add(t)
    last.current = { x, y }
  }

  useEffect(() => {
    const stage = root.current?.closest<HTMLElement>('.slide-inner')
    if (!stage) return
    const local = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect()
      const k = r.width / SLIDE_W
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }
    }
    const move = (e: PointerEvent) => {
      const p = local(e)
      pointer.current = p
      const l = last.current
      if (!l) last.current = p
      else if (Math.hypot(p.x - l.x, p.y - l.y) >= live.current.gap) drop(p.x, p.y)
    }
    const click = (e: MouseEvent) => {
      const p = local(e)
      pointer.current = p
      if (live.current.onNext) live.current.onNext()
      else drop(p.x, p.y)
    }
    stage.addEventListener('pointermove', move, { passive: true })
    stage.addEventListener('click', click)
    const pending = timers.current
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('click', click)
      pending.forEach((t) => window.clearTimeout(t))
      pending.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A new theme starts with a clean stage; the click that turned it lands as its first picture.
  useEffect(() => {
    count.current = 0
    setShots([])
    const p = pointer.current
    if (p) drop(p.x, p.y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {shots.map((s) => (
          <motion.img
            key={s.id}
            src={s.src}
            alt=""
            draggable={false}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[6px] object-cover shadow-[0_24px_60px_rgba(17,17,17,0.14)]"
            style={{ left: s.x, top: s.y, width: s.w, height: s.h, rotate: s.rot }}
            initial={reduce ? { opacity: 0, filter: `blur(${s.blur}px)` } : { opacity: 0, scale: 0.8, y: 20, filter: 'blur(24px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: `blur(${s.blur}px)`, transition: { duration: 0.7, ease: EASE } }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -14, filter: 'blur(24px)', transition: { duration: 0.45, ease: EASE } }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
