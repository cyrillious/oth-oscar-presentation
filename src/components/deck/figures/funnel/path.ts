// The red lead's way through the stand, as one polyline measured by arc length.
// Falls in from above, rests on the TOFU pile, sinks through it into the stem, drops into the next
// funnel, and so on down to the dish. Each piece knows which slot draws it and how opaque it is.
import type { Point3 } from '#/components/iso/iso-kit'
import { BALL, DISH_TOP, ENTRY, NECK, RIM, TIP } from './model'
import { DISH_SEAT, PILES } from './geometry'

type Kind = 'entry' | 'sink' | 'stem' | 'fall' | 'settle'
type Piece = { a: Point3; b: Point3; kind: Kind; into: number; from: number; len: number }

const RIM_OF = [...RIM, DISH_TOP]
const pieces: Piece[] = []
let total = 0
const add = (a: Point3, b: Point3, kind: Kind, into: number) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  pieces.push({ a, b, kind, into, from: total, len })
  total += len
}

const seats: Point3[] = [...PILES.map((p) => p.red), DISH_SEAT]
/** Arc length of each stop: the three seats, then the dish. */
export const STOPS: number[] = []

add([seats[0][0], seats[0][1], ENTRY], seats[0], 'entry', 0)
STOPS.push(total)
for (let i = 0; i < 3; i++) {
  const neck: Point3 = [0, 0, NECK[i] + BALL * 0.6]
  add(seats[i], neck, 'sink', i)
  add(neck, [0, 0, TIP[i]], 'stem', i)
  const next = seats[i + 1]
  if (i < 2) {
    const over: Point3 = [0, 0, next[2] + 5]
    add([0, 0, TIP[i]], over, 'fall', i + 1)
    add(over, next, 'settle', i + 1)
  } else add([0, 0, TIP[i]], next, 'fall', 3)
  STOPS.push(total)
}
export const LENGTH = total

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

/** Position, slot (0..3 inside, 4 air, −1 hidden) and opacity at arc length u. */
export function leadOf(u: number): { at: Point3; slot: number; alpha: number } {
  const piece = pieces.find((p) => u <= p.from + p.len + 1e-9) ?? pieces[pieces.length - 1]
  const f = piece.len ? Math.min(1, Math.max(0, (u - piece.from) / piece.len)) : 1
  const at: Point3 = [0, 1, 2].map((j) => piece.a[j] + (piece.b[j] - piece.a[j]) * f) as Point3
  switch (piece.kind) {
    case 'entry':
      return { at, slot: at[2] >= RIM_OF[0] ? 4 : 0, alpha: smooth((u - piece.from) / 22) }
    case 'sink':
      return { at, slot: piece.into, alpha: 1 - smooth((piece.a[2] - at[2]) / 6) }
    case 'stem':
      return { at, slot: -1, alpha: 0 }
    case 'fall':
      return { at, slot: at[2] >= RIM_OF[piece.into] ? 4 : piece.into, alpha: 1 }
    default:
      return { at, slot: piece.into, alpha: 1 }
  }
}

/** Index of the last stop at or before u (−1 before the first seat). */
export const stopBefore = (u: number) => STOPS.reduce((best, s, i) => (u >= s - 1e-6 ? i : best), -1)
