// The Real Product & Find the Fear: a core drill going down through a sample case.
// One model: the strata, where their boundaries run, and what the bit is in at any depth.
// Depths are in mm of sample (1 world unit = 1 mm), measured down from the surface.

export type Stratum = { name: string; reading: string; kind: 'surface' | 'real' | 'fear' }

export const STRATA: Stratum[] = [
  { name: 'Wäsche', reading: 'Wäsche', kind: 'surface' },
  { name: 'Stolz aufs Auto', reading: 'Stolz aufs Auto', kind: 'real' },
  { name: 'Zeit am Samstag', reading: 'Zeit am Samstag', kind: 'real' },
  { name: 'Ruhe dank Fixpreis', reading: 'Ruhe dank Fixpreis', kind: 'real' },
  { name: 'Kratzer', reading: 'Angst: Kratzer', kind: 'fear' },
  { name: 'Zu viel zahlen', reading: 'Angst: zu viel zahlen', kind: 'fear' },
  { name: 'Warten', reading: 'Angst: warten', kind: 'fear' },
]

/** Nominal boundary depths: surface, then the foot of each stratum. */
export const BOUNDS = [0, 5, 21, 35, 48, 60, 72, 84]
export const DEPTH = BOUNDS[BOUNDS.length - 1]!

/** Bit travel: a little above the surface to the floor of the bore. */
export const LIFTED = -4
export const DEEPEST = 82

/** Where boundary i really runs at floor point (x, y): layers settle unevenly. */
export function boundary(i: number, x: number, y: number) {
  if (i <= 0) return 0
  if (i >= BOUNDS.length - 1) return DEPTH
  const amp = i === 1 ? 0.7 : 1.5
  return BOUNDS[i]! + amp * Math.sin(0.085 * x + i * 1.7) + amp * 0.8 * Math.sin(0.11 * y + i * 2.3)
}

/** The bore sits on the inner corner of the cut, at (0, 0). */
export const AT_BORE = BOUNDS.map((_, i) => boundary(i, 0, 0))

export function stratumAt(depth: number) {
  for (let i = 0; i < STRATA.length; i++) if (depth < AT_BORE[i + 1]!) return i
  return STRATA.length - 1
}

/** Middle of each stratum at the bore, where the tour and the arrow keys stop. */
export const STOPS = STRATA.map((_, i) => (AT_BORE[i]! + AT_BORE[i + 1]!) / 2)

export function readoutOf(depth: number) {
  if (depth <= 0.5) return 'Bohrer oben · Oberfläche'
  return `Tiefe ${Math.round(depth)} mm · ${STRATA[stratumAt(depth)]!.reading}`
}

export function spokenOf(depth: number) {
  if (depth <= 0.5) return 'Bohrer über der Probe'
  const s = STRATA[stratumAt(depth)]!
  const layer = s.kind === 'fear' ? `eine Angst: ${s.name}` : s.kind === 'real' ? `das echte Produkt: ${s.name}` : 'die Wäsche'
  return `${Math.round(depth)} Millimeter tief, in ${layer}`
}

/** Resting pose, also the reduced-motion still: the bit in «Stolz aufs Auto». */
export const REST = STOPS[1]!
