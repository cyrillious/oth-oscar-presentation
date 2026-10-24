// The True Competitor as a beam balance.
// Left pan: what OSCAR is weighed against. Right pan: one OSCAR token, 5 minutes.
// Weight is time spent. The beam tips toward the heavier side until that pan lands on its rest.

export type Rival = 'bucket' | 'token'

/** Minutes each load stands for. Saturday at home with bucket and sponge vs one pass through a wash. */
export const MINUTES: Record<Rival, number> = { bucket: 180, token: 5 }
export const OSCAR_MINUTES = 5

export const NAME: Record<Rival, string> = { bucket: 'Selbst waschen', token: 'Andere Anlage' }

/** Beam travel to the pan rest, degrees. */
export const STOP_DEG = 11
/** Degrees per minute of difference while the beam swings free. */
export const SENSITIVITY = 0.6

/** Beam angle in radians. Positive tips the right end down. */
export function angleFor(left: number, right: number) {
  const deg = Math.max(-STOP_DEG, Math.min(STOP_DEG, SENSITIVITY * (right - left)))
  return (deg * Math.PI) / 180
}

export const STOP = (STOP_DEG * Math.PI) / 180

/** Beam spring: a balance beam with its pointer as a pendulum, lightly damped. */
export const STIFFNESS = 16
export const DAMPING = 4.4

export function readoutOf(seated: Rival | null) {
  const oscar = `OSCAR ${OSCAR_MINUTES} min`
  if (!seated) return `Schale leer · ${oscar}`
  return `${NAME[seated]} ${MINUTES[seated]} min · ${oscar}`
}

export const REST_RIVAL: Rival = 'bucket'
export const REST_ANGLE = angleFor(MINUTES[REST_RIVAL], OSCAR_MINUTES)
