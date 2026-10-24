// Fig 05 · Tofu, Mofu, Bofu. The one model the drawing, the motion and the readout read from.
// Three funnels hang on one retort stand, each smaller than the one above. Every funnel holds the
// leads that are still in it (24, then 8, then 3); the red lead drops from stage to stage and ends
// in the dish on the base: the subscription.

export type Tier = {
  key: 'TOFU' | 'MOFU' | 'BOFU'
  /** Rim radius, cone height, stem radius and stem length in world units (≈ mm). */
  R: number
  H: number
  rs: number
  L: number
  /** Leads still in this stage, the red one included. */
  count: number
}

export const TIERS: Tier[] = [
  { key: 'TOFU', R: 46, H: 54, rs: 4, L: 12, count: 24 },
  { key: 'MOFU', R: 31, H: 36, rs: 3.6, L: 10, count: 8 },
  { key: 'BOFU', R: 20, H: 23, rs: 3.2, L: 8, count: 3 },
]

/** Lead radius, funnel wall, gap from a stem tip to the rim below. */
export const BALL = 4
export const WALL = 1.1
const GAP = 3

/** The dish on the base that catches the last lead. */
export const DISH = { r: 17, h: 6, foot: 1.2 }
export const DISH_TOP = DISH.foot + DISH.h
export const DISH_FLOOR = DISH.foot + 1.4

/** Stem tip (frame origin) and rim of each funnel, bottom up. */
const tipOf: number[] = []
{
  let below = DISH_TOP
  for (let i = TIERS.length - 1; i >= 0; i--) {
    // Over the dish the stem clears a lead lying on its floor.
    tipOf[i] = below + (i === TIERS.length - 1 ? GAP + 3 : GAP)
    below = tipOf[i] + TIERS[i].L + TIERS[i].H
  }
}
export const TIP = tipOf
export const NECK = TIERS.map((t, i) => TIP[i] + t.L)
export const RIM = TIERS.map((t, i) => NECK[i] + t.H)
export const TOP = RIM[0]

/** Inner wall: radius at height h above the neck, and its slope. */
export const innerAt = (t: Tier, h: number) => t.rs - WALL * 0.6 + ((t.R - WALL - (t.rs - WALL * 0.6)) * h) / t.H
export const slopeOf = (t: Tier) => (t.R - t.rs) / t.H

type P3 = [number, number, number]

/**
 * Leads packed into a cone in rings, bottom up: one on the axis, then rings as wide as the wall allows.
 * Returns the grey leads (count − 1) and the red lead's seat one ring higher, at the back wall.
 */
export function pileOf(index: number, back: number): { grey: P3[]; red: P3 } {
  const t = TIERS[index]
  const m = slopeOf(t)
  const lean = BALL * Math.sqrt(1 + m * m)
  const r0 = t.rs - WALL * 0.6
  const h0 = Math.max(BALL, (lean - r0) / m)
  const grey: P3[] = []
  let left = t.count - 1
  let level = 0
  let h = h0
  while (left > 0) {
    const d = Math.max(0, innerAt(t, h) - lean)
    const fit = d < BALL * 1.05 ? 1 : Math.floor((2 * Math.PI * d) / (BALL * 2.08))
    const take = Math.min(fit, left)
    const phase = level * 0.55 + back
    for (let j = 0; j < take; j++) {
      const a = phase + (2 * Math.PI * Math.round((j * fit) / take)) / fit
      grey.push([d * Math.cos(a), d * Math.sin(a), NECK[index] + h])
    }
    left -= take
    level += 1
    h += BALL * 1.55
  }
  // The red lead sits on the next ring, at the back wall, where the opening shows it.
  const hr = level === 0 ? h0 : h
  const dr = Math.max(0, innerAt(t, hr) - lean)
  return { grey, red: [dr * Math.cos(back), dr * Math.sin(back), NECK[index] + hr] }
}

/** Where the red lead stops: one per stage, then the dish. */
export const STAGES = ['TOFU', 'MOFU', 'BOFU', 'Abo'] as const
export const READOUT = TIERS.map((t) => `${t.key} · ${t.count} von ${TIERS[0].count}`).concat(`Abo · 1 von ${TIERS[0].count}`)
export const RESTING = READOUT[0]
/** Seconds the lead rests in the BOFU funnel before it drops into the dish. */
export const BOFU_DWELL = 1.1
/** Height the red lead falls in from, above the top funnel. */
export const ENTRY = TOP + 46
