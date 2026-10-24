// Fig 01 · Weirding the Normal. Pure model of the conveyor, no DOM.
// A feed of identical model cars rides a belt past a feeler lever. A car turned a few degrees
// presses the feeler's roller, the lever swings, the gate drops and the belt stops for a beat.

export const BT = 46 // belt top (world units, z up)
export const SPACING = 66 // car pitch on the belt
export const COUNT = 4 // cars on the loop; car 0 is the turned one
export const LOOP = SPACING * COUNT
export const WRAP_FROM = -142 // deep in the wash tunnel: cars re-enter here, out of sight through the mouth

export const SPEED = 34 // belt speed, units per second
export const TWIST = 12 // the idle tour's twist, degrees
export const TWIST_MAX = 15

// Car body: rounded box, half length 18, half width 9, corner radius 3. Bumpers stick out 1.6 at each end.
export const HALF_L = 18
export const HALF_W = 9
export const BODY_R = 3
export const BUMPER = { u0: 18, u1: 19.6, half: 7 }

// Feeler: an L lever on a pivot in front of the near beam. Its roller touches the plane y = 10 at rest,
// one unit clear of a straight car's flank (y = 9). The turned car is turned clockwise (seen from above),
// so its rear near corner swings out toward the roller.
export const PIVOT: [number, number] = [-18, 33]
export const TIP: [number, number] = [-30, 11.6]
export const TIP_R = 1.6
export const PHI_MAX = 0.5 // lever stop, rad

/** Lever angle at which the gate drops (rad, about 3.4°). */
export const TRIP = 0.06
/** Seconds the belt stands before it lets go. */
export const HOLD = 1.5

export const GATE_X = 19
export const GATE_UP = BT + 24 // blade bottom when open: well clear of a cabin (BT + 13.2)
export const GATE_DOWN = BT + 0.5

const RAD = Math.PI / 180

export const carX = (index: number, travel: number) => WRAP_FROM + ((((travel + index * SPACING) % LOOP) + LOOP) % LOOP)

/** Signed distance from (px, py) to a rounded box centred at the origin. */
function box(px: number, py: number, hx: number, hy: number, r: number) {
  const qx = Math.abs(px) - (hx - r)
  const qy = Math.abs(py) - (hy - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

/** Distance from a floor point to a car (body or bumpers) centred at (cx, 0), turned clockwise by `deg`. */
export function carDistance(x: number, y: number, cx: number, deg: number) {
  const t = -deg * RAD
  const dx = x - cx
  const u = dx * Math.cos(t) + y * Math.sin(t)
  const v = -dx * Math.sin(t) + y * Math.cos(t)
  const body = box(u, v, HALF_L, HALF_W, BODY_R)
  const bu = (BUMPER.u0 + BUMPER.u1) / 2
  const bumper = box(Math.abs(u) - bu, v, (BUMPER.u1 - BUMPER.u0) / 2, BUMPER.half, 0.6)
  return Math.min(body, bumper)
}

/** Turn a floor point about the pivot, clockwise from above by `phi`: the way the roller is pushed. */
export function turn([x, y]: [number, number], phi: number): [number, number] {
  const dx = x - PIVOT[0]
  const dy = y - PIVOT[1]
  const c = Math.cos(-phi)
  const s = Math.sin(-phi)
  return [PIVOT[0] + dx * c - dy * s, PIVOT[1] + dx * s + dy * c]
}

/** Where the roller's centre is when the lever is turned by `phi`. */
export const tipAt = (phi: number) => turn(TIP, phi)

/** The smallest lever angle at which the roller clears the car: the car pushes the lever this far. */
export function leverFor(cx: number, deg: number) {
  if (Math.abs(cx - TIP[0]) > 40) return 0
  const clear = (phi: number) => {
    const [x, y] = tipAt(phi)
    return carDistance(x, y, cx, deg) >= TIP_R
  }
  if (clear(0)) return 0
  if (!clear(PHI_MAX)) return PHI_MAX
  let lo = 0
  let hi = PHI_MAX
  for (let step = 0; step < 22; step++) {
    const mid = (lo + hi) / 2
    if (clear(mid)) hi = mid
    else lo = mid
  }
  return hi
}

/** The lever angle from every car on the belt. */
export function leverAt(travel: number, twist: number) {
  let phi = 0
  for (let index = 0; index < COUNT; index++) phi = Math.max(phi, leverFor(carX(index, travel), index === 0 ? twist : 0))
  return phi
}

/** Car 0's centre where its corner first trips the feeler, for a given twist (null if it never does). */
export function tripCentre(twist: number) {
  for (let cx = TIP[0] - 30; cx < TIP[0] + 40; cx += 0.05) if (leverFor(cx, twist) > TRIP) return cx
  return null
}

const REST_CENTRE = (tripCentre(TWIST) ?? TIP[0]) + 2.2
/** Belt travel that puts the turned car on the feeler, the gate down: the resting picture. */
export const REST_TRAVEL = REST_CENTRE - WRAP_FROM

export type Phase = 'run' | 'brake' | 'hold' | 'open'

export interface Belt {
  travel: number
  speed: number
  gate: number // 0 open, 1 down
  phase: Phase
  held: number // seconds standing
  latched: boolean
  phi: number
}

export const restBelt = (): Belt => ({ travel: REST_TRAVEL, speed: 0, gate: 1, phase: 'hold', held: 0, latched: true, phi: leverAt(REST_TRAVEL, TWIST) })

const ease = (current: number, target: number, dt: number, seconds: number) => {
  const next = current + (target - current) * (1 - Math.exp(-dt / seconds))
  return Math.abs(target - next) < 1e-3 ? target : next
}

/** One step of the belt. `calm`: no travel, the gate just follows the feeler. */
export function step(belt: Belt, twist: number, dt: number, calm: boolean) {
  if (calm) {
    belt.travel = REST_TRAVEL
    belt.speed = 0
    belt.phi = leverAt(belt.travel, twist)
    belt.latched = belt.phi > TRIP
    belt.gate = belt.latched ? 1 : 0
    belt.phase = belt.latched ? 'hold' : 'run'
    return
  }
  belt.travel += belt.speed * dt
  if (belt.travel > LOOP * 64) belt.travel -= LOOP * 32
  belt.phi = leverAt(belt.travel, twist)
  if (!belt.latched && belt.phi > TRIP && belt.phase === 'run') {
    belt.latched = true
    belt.phase = 'brake'
  }
  if (belt.latched && belt.phi < 0.005 && belt.phase === 'run') belt.latched = false
  switch (belt.phase) {
    case 'run':
      belt.speed = ease(belt.speed, SPEED, dt, 0.35)
      belt.gate = ease(belt.gate, 0, dt, 0.22)
      break
    case 'brake':
      belt.speed = ease(belt.speed, 0, dt, 0.09)
      belt.gate = ease(belt.gate, 1, dt, 0.1)
      if (belt.speed < 0.05) {
        belt.speed = 0
        belt.phase = 'hold'
        belt.held = 0
      }
      break
    case 'hold':
      belt.speed = 0
      belt.gate = ease(belt.gate, 1, dt, 0.1)
      belt.held += dt
      if (belt.held > HOLD) belt.phase = 'open'
      break
    case 'open':
      belt.gate = ease(belt.gate, 0, dt, 0.18)
      if (belt.gate < 0.08) belt.phase = 'run'
      break
  }
}

export const stopped = (belt: Belt) => belt.phase === 'brake' || belt.phase === 'hold'

export function readoutOf(twist: number, belt: Belt) {
  return `Abweichung ${Math.round(twist)}° · ${stopped(belt) ? 'Daumen stoppt' : 'läuft'}`
}
