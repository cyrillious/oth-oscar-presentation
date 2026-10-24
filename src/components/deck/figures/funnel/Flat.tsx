import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useInView, useLoop } from '#/components/iso/react/live'
import { DeckPlate } from '../DeckPlate'
import { BALL, BOFU_DWELL, DISH, DISH_FLOOR, DISH_TOP, ENTRY, NECK, READOUT, RIM, TIERS, TIP, TOP, WALL, innerAt, slopeOf } from './model'

// Fig 05 in 2D: the same retort stand as the isometric figure, drawn as a front elevation in section.
// Same model (24 / 8 / 3 leads), same motion: the red lead drops to the open stage and, at BOFU, into the dish.
// World units ≈ 1 mm: x across, z up, the base top at z = 0. Funnels and dish are cut open, so the leads show.

const WIDTH = 600
const HEIGHT = 500

const POST_X = -72
const POST_R = 3.2
const POST_TOP = TOP + 8
const BASE = { x0: -90, x1: 34, h: 9 }
const FOOT_H = 4
const BOSS = 6
const RING_H = 2
const RING_W = 2.8

// Fit the stand into the view box, by height.
const Z0 = -BASE.h - FOOT_H
const Z1 = POST_TOP + 2
const X0 = BASE.x0
const X1 = TIERS[0].R + 1
const PAD = 20
const S = (HEIGHT - PAD * 2) / (Z1 - Z0)
const sx = (x: number) => WIDTH / 2 + (x - (X0 + X1) / 2) * S
const sz = (z: number) => HEIGHT - PAD - (z - Z0) * S
const n = (v: number) => Math.round(v * 100) / 100

const ringZ = (i: number) => NECK[i] + TIERS[i].H * 0.3
const ringIn = (i: number) => innerAt(TIERS[i], TIERS[i].H * 0.3) + WALL

type P2 = [number, number]

/**
 * Leads packed into the funnel's section in rows, bottom up, each row filled centre out.
 * Returns the grey leads (count − 1) and the red lead's seat: the middle of the top row, on the pile.
 */
function pileOf(i: number): { grey: P2[]; red: P2 } {
  const t = TIERS[i]
  const lean = BALL * Math.sqrt(1 + slopeOf(t) ** 2)
  const step = BALL * 2.08
  const rows: P2[][] = []
  let left = t.count
  for (let h = BALL; left > 0; h += BALL * 2.05) {
    const d = Math.max(0, innerAt(t, h) - lean)
    const fit = Math.floor((2 * d) / step) + 1
    const row = Array.from({ length: fit }, (_, j) => (j - (fit - 1) / 2) * step)
    row.sort((a, b) => Math.abs(a) - Math.abs(b) || a - b)
    rows.push(row.slice(0, left).map((x): P2 => [x, NECK[i] + h]))
    left -= Math.min(fit, left)
  }
  const top = rows.pop() ?? []
  return { grey: [...rows.flat(), ...top.slice(1)], red: top[0] }
}

const PILES = TIERS.map((_, i) => pileOf(i))
const DISH_SEAT: P2 = [0, DISH_FLOOR + BALL]

// ——— The red lead's way, as one polyline measured by length ———

type Kind = 'entry' | 'sink' | 'stem' | 'fall'
type Piece = { a: P2; b: P2; kind: Kind; from: number; len: number }
const pieces: Piece[] = []
const STOPS: number[] = []
{
  let total = 0
  const add = (a: P2, b: P2, kind: Kind) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    pieces.push({ a, b, kind, from: total, len })
    total += len
  }
  const seats = [...PILES.map((p) => p.red), DISH_SEAT]
  add([seats[0][0], ENTRY], seats[0], 'entry')
  STOPS.push(total)
  for (let i = 0; i < 3; i++) {
    const neck: P2 = [0, NECK[i] + BALL * 0.6]
    add(seats[i], neck, 'sink')
    add(neck, [0, TIP[i]], 'stem')
    const next = seats[i + 1]
    const over: P2 = [0, next[1] + 5]
    add([0, TIP[i]], over, 'fall')
    add(over, next, 'fall')
    STOPS.push(total)
  }
}

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

function leadOf(u: number): { at: P2; alpha: number } {
  const p = pieces.find((q) => u <= q.from + q.len + 1e-9) ?? pieces[pieces.length - 1]
  const f = p.len ? Math.min(1, Math.max(0, (u - p.from) / p.len)) : 1
  const at: P2 = [p.a[0] + (p.b[0] - p.a[0]) * f, p.a[1] + (p.b[1] - p.a[1]) * f]
  if (p.kind === 'entry') return { at, alpha: smooth((u - p.from) / 22) }
  if (p.kind === 'sink') return { at, alpha: 1 - smooth((p.a[1] - at[1]) / 6) }
  if (p.kind === 'stem') return { at, alpha: 0 }
  return { at, alpha: 1 }
}

const stopBefore = (u: number) => STOPS.reduce((best, s, i) => (u >= s - 1e-6 ? i : best), -1)
const restOf = (stage: number) => STOPS[stage === 2 ? 3 : stage]
const readoutAt = (u: number) => READOUT[Math.max(0, stopBefore(u))]

/** Screen height (share of the view box) of each funnel's middle, for picking by pointer. */
const PICK = TIERS.map((t, i) => sz(NECK[i] + t.H * 0.5) / HEIGHT)

// ——— Static art ———

const INK = 'var(--color-ink)'
const PAPER = 'var(--color-paper)'
const GREY = 'color-mix(in srgb, var(--color-mute) 55%, var(--color-paper))'
const FAINT = 'color-mix(in srgb, var(--color-ink) 30%, var(--color-stone))'
const stroke = { stroke: INK, strokeWidth: 1.5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

/** Rounded rect in world units. */
const rect = (x0: number, z0: number, x1: number, z1: number, r = 0) => ({
  x: n(sx(Math.min(x0, x1))),
  y: n(sz(Math.max(z0, z1))),
  width: n(Math.abs(x1 - x0) * S),
  height: n(Math.abs(z1 - z0) * S),
  rx: n(r * S),
})

const poly = (points: P2[]) => points.map(([x, z], i) => `${i ? 'L' : 'M'}${n(sx(x))} ${n(sz(z))}`).join(' ') + ' Z'

/** Funnel in section: outer cone and stem as one shape. */
function funnelPath(i: number) {
  const t = TIERS[i]
  return poly([
    [-t.R, RIM[i]],
    [t.R, RIM[i]],
    [t.rs, NECK[i]],
    [t.rs, TIP[i]],
    [-t.rs, TIP[i]],
    [-t.rs, NECK[i]],
  ])
}

function Stand() {
  const feet = [BASE.x0 + 8, BASE.x1 - 8]
  const ticks: number[] = []
  for (let z = 25; z < POST_TOP - 6; z += 25) if (TIERS.every((_, i) => Math.abs(z - ringZ(i)) > BOSS + 3)) ticks.push(z)
  return (
    <g>
      {/* Feet and base, the label plate on its front. */}
      {feet.map((x) => (
        <rect key={x} {...rect(x - 6, -BASE.h - FOOT_H, x + 6, -BASE.h + 1, 1.2)} fill={PAPER} {...stroke} />
      ))}
      <rect {...rect(BASE.x0, -BASE.h, BASE.x1, 0, 2.4)} fill={PAPER} {...stroke} />
      <rect {...rect(-13, -BASE.h + 2.2, 13, -2.2, 1)} fill="none" stroke={FAINT} strokeWidth={1} />
      <text x={n(sx(0))} y={n(sz(-BASE.h / 2) + 4.5)} textAnchor="middle" fontSize="13" letterSpacing="1.5" fill={INK} fontFamily="inherit">
        ABO
      </text>

      {/* Post with its lock nut and graduation. */}
      <rect {...rect(POST_X - 7.5, 0, POST_X + 7.5, 3, 0.6)} fill={PAPER} {...stroke} />
      <rect {...rect(POST_X - POST_R, 3, POST_X + POST_R, POST_TOP, POST_R)} fill={PAPER} {...stroke} />
      {ticks.map((z) => (
        <line key={z} x1={n(sx(POST_X + POST_R - 2.4))} x2={n(sx(POST_X + POST_R))} y1={n(sz(z))} y2={n(sz(z))} stroke={FAINT} strokeWidth={1} />
      ))}

      {/* Boss heads, thumb screws and arms out to the support rings. */}
      {TIERS.map((t, i) => {
        const z = ringZ(i) - RING_H / 2
        const reach = -(ringIn(i) + RING_W)
        return (
          <g key={t.key}>
            <rect {...rect(POST_X + BOSS, z - 1.3, reach, z + 1.3)} fill={PAPER} {...stroke} />
            <rect {...rect(POST_X - BOSS - 5, z - 2.8, POST_X - BOSS, z + 2.8, 0.8)} fill={PAPER} {...stroke} />
            <rect {...rect(POST_X - BOSS, z - BOSS, POST_X + BOSS, z + BOSS, 1.4)} fill={PAPER} {...stroke} />
          </g>
        )
      })}
    </g>
  )
}

function Funnels() {
  return (
    <g>
      {TIERS.map((t, i) => (
        <g key={t.key}>
          <path d={funnelPath(i)} fill={PAPER} />
          {PILES[i].grey.map(([x, z], j) => (
            <circle key={j} cx={n(sx(x))} cy={n(sz(z))} r={n(BALL * S - 0.6)} fill={GREY} />
          ))}
          <path d={funnelPath(i)} fill="none" {...stroke} />
          {/* Rolled rim and the support ring the funnel sits in. */}
          <rect {...rect(-t.R - 1, RIM[i] - 1.4, t.R + 1, RIM[i] + 0.4, 0.7)} fill={PAPER} {...stroke} />
          {[-1, 1].map((side) => (
            <rect key={side} {...rect(side * ringIn(i), ringZ(i) - RING_H, side * (ringIn(i) + RING_W), ringZ(i), 0.6)} fill={PAPER} {...stroke} />
          ))}
        </g>
      ))}
    </g>
  )
}

const DISH_PATH = poly([
  [-DISH.r - 0.8, DISH_TOP + 0.4],
  [DISH.r + 0.8, DISH_TOP + 0.4],
  [12, DISH.foot],
  [-12, DISH.foot],
])

function DishBack() {
  return <path d={DISH_PATH} fill={PAPER} />
}

function DishFront() {
  return (
    <g>
      <path d={DISH_PATH} fill="none" {...stroke} />
      <rect {...rect(-11, 0, 11, DISH.foot)} fill={PAPER} {...stroke} />
    </g>
  )
}

/**
 * Fig 05 · Tofu, Mofu, Bofu, flat: three funnels on a retort stand in front view, cut open.
 * `stage` comes from the slide's list; clicking a funnel or the arrow keys pick a stage and report it back.
 */
export function FigFunnelFlat({ stage = 0, onStage }: { stage?: number; onStage?: (stage: number) => void }) {
  const [current, setCurrent] = useState(stage)
  useEffect(() => setCurrent(stage), [stage])

  const stageRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<SVGCircleElement>(null)
  const start = restOf(stage)
  const state = useRef({ u: start, v: 0, target: start, want: stage, dwell: 0 })
  const inView = useInView(stageRef)

  const draw = useCallback(() => {
    const s = state.current
    const lead = leadOf(s.u)
    const node = leadRef.current
    if (node) {
      node.setAttribute('cx', String(n(sx(lead.at[0]))))
      node.setAttribute('cy', String(n(sz(lead.at[1]))))
      node.style.opacity = lead.alpha < 0.999 ? String(Math.max(0, lead.alpha)) : ''
    }
    const text = readoutAt(s.u)
    const slot = stageRef.current?.closest('.iso-plate')?.querySelector('[data-readout]')
    if (slot && slot.textContent !== text) slot.textContent = text
    stageRef.current?.setAttribute('aria-valuetext', text)
  }, [])

  const kick = useLoop((dt, calm) => {
    const s = state.current
    if (calm) {
      s.u = restOf(s.want)
      s.target = s.u
      s.v = 0
      draw()
      return false
    }
    // At BOFU the lead rests a moment in the last funnel, then drops into the dish.
    if (s.want === 2 && s.u >= STOPS[2] - 1e-6 && s.target === STOPS[2]) {
      s.dwell += dt
      if (s.dwell >= BOFU_DWELL) s.target = STOPS[3]
    }
    const left = s.target - s.u
    if (left > 0) {
      s.v = Math.min(s.v + 520 * dt, 240, Math.sqrt(2 * 640 * left) + 12)
      s.u = Math.min(s.target, s.u + s.v * dt)
    }
    if (s.u >= s.target) s.v = 0
    draw()
    return s.u < s.target || (s.want === 2 && s.target === STOPS[2])
  }, inView)

  // A new stage: forward runs on down the stand; backward drops a fresh lead in from the top.
  useEffect(() => {
    const s = state.current
    s.want = current
    s.dwell = 0
    const target = STOPS[current]
    if (target < s.u - 1e-6) {
      s.u = 0
      s.v = 0
    }
    s.target = target
    stageRef.current?.setAttribute('aria-valuenow', String(current + 1))
    kick()
  }, [current, kick])

  const pick = (next: number) => {
    const clamped = Math.min(2, Math.max(0, next))
    setCurrent(clamped)
    onStage?.(clamped)
  }

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const svg = event.currentTarget.querySelector('svg')
    if (!svg) return
    const box = svg.getBoundingClientRect()
    const share = (event.clientY - box.top) / box.height
    pick(PICK.reduce((best, y, i) => (Math.abs(y - share) < Math.abs(PICK[best] - share) ? i : best), 0))
  }

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    let to: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') to = current + 1
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') to = current - 1
    if (event.key === 'Home') to = 0
    if (event.key === 'End') to = 2
    // Only keep the key when it moves the stage: at either end it goes on to the presenter (next slide).
    if (to === null || to < 0 || to > 2 || to === current) return
    event.preventDefault()
    event.stopPropagation()
    pick(to)
  }

  const first = leadOf(start)
  const resting = readoutAt(start)

  return (
    <DeckPlate fig="Fig 05" title="Drei Trichter" hint="Trichter anklicken" readout={resting}>
      <div
        ref={stageRef}
        className="iso-stage ff"
        tabIndex={0}
        role="slider"
        aria-label="Drei Trichter an einem Stativ: Pfeiltasten wählen die Stufe"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={stage + 1}
        aria-valuetext={resting}
        onClick={onClick}
        onKeyDown={onKey}
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Ein Stativ mit drei Trichtern übereinander, jeder kleiner als der darüber. Im obersten liegen ${TIERS[0].count} Kugeln, im mittleren ${TIERS[1].count}, im untersten ${TIERS[2].count}. Eine rote Kugel fällt von Trichter zu Trichter und landet zuletzt in der Schale auf dem Fuss, beschriftet mit Abo.`}
          focusable="false"
        >
          <Stand />
          <DishBack />
          <Funnels />
          <circle
            ref={leadRef}
            cx={n(sx(first.at[0]))}
            cy={n(sz(first.at[1]))}
            r={n(BALL * S - 0.6)}
            fill="var(--color-signal)"
            style={first.alpha < 0.999 ? { opacity: first.alpha } : undefined}
          />
          <DishFront />
        </svg>
      </div>
    </DeckPlate>
  )
}
