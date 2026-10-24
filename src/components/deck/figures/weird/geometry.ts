// Fig 01 · geometry. Static art is built once as SVG strings; the parts that move or turn
// (cars, lever, needle, gate rod, belt slats) have builders the live loop calls.
import * as k from '#/components/iso/iso-kit'
import * as G from '#/components/iso/lathe.mjs'
import type { Flat, Plan, Point3, SolidPaths } from '#/components/iso/iso-kit'
import { BT, BUMPER, BODY_R, GATE_DOWN, GATE_UP, GATE_X, HALF_L, HALF_W, PIVOT, TIP, TIP_R, TRIP, turn } from './model'

export const WIDTH = 600
export const HEIGHT = 500

// ── World layout ─────────────────────────────────────────────
const BASE: Plan = { x: -166, y: -50, w: 332, d: 120, r: 8 }
const BASE_H = 10
const FOOT_H = 5
const WASH: Plan = { x: -156, y: -36, w: 56, d: 72, r: 2.5 } // the wash cabinet: cars come out of it
const END: Plan = { x: 100, y: -36, w: 56, d: 72, r: 2.5 } // the end cabinet: cars go in
const CAB_H = 68
const BEAM_FAR: Plan = { x: -100, y: -28, w: 200, d: 6, r: 1 }
const BEAM_NEAR: Plan = { x: -100, y: 22, w: 200, d: 6, r: 1 }
const BEAM_Z = 32
const BEAM_TOP = BT + 2
const BELT: Plan = { x: -100, y: -22, w: 200, d: 44, r: 0 }
const LEGS_X = [-62, 62]
const OPEN = { y: 21, z0: BT, z1: BT + 21 } // the wash cabinet's exit, on its +x face
const POST_Y = 36
const BAR_Z = 92
const BAR_H = 6
const BRACKET: Plan = { x: -36, y: 28, w: 40, d: 27, r: 1.5 }
const BRACKET_Z = 36
const MOTOR: Plan = { x: 48, y: 28, w: 44, d: 24, r: 2 }
const MOTOR_H = 22

export const P = k.fitProjection(
  [...k.boxCorners(BASE, -BASE_H - FOOT_H, 0), ...k.boxCorners(WASH, 0, CAB_H), ...k.boxCorners(END, 0, CAB_H), [GATE_X, 0, BAR_Z + BAR_H + 13]],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 46 },
)

export const at = (point: Point3) => k.iso(point, P)
const S = (paths: SolidPaths, style: k.SolidStyle = {}) => k.solidSvg(paths, style)
const L = (d: string, style: k.LineStyle = {}) => k.lineSvg(d, style)
const D = (points: Point3[], style: { size?: number; tone?: k.Tone } = {}) => k.dotsSvg(k.pointsAt(points, P), { size: 0.5, ...style })
const byDepth = <T extends number[]>(points: T[]) => [...points].sort((a, b) => k.depthOf([a[0]!, a[1]!, 0], P) - k.depthOf([b[0]!, b[1]!, 0], P))

/** A closed rounded rectangle drawn in a vertical face plane (no ends: panel joints, slots, doors). */
function faceRect(axis: 'x' | 'y', at: number, a0: number, a1: number, z0: number, z1: number, r = 1.2) {
  const ring = k.roundedPlan({ x: a0, y: z0, w: a1 - a0, d: z1 - z0, r }, 4)
  return k.pathOf(
    ring.map(([a, z]) => at3(axis, at, a, z)),
    true,
  )
}
const at3 = (axis: 'x' | 'y', at: number, a: number, z: number): Flat => (axis === 'y' ? k.iso([a, at, z], P) : k.iso([at, a, z], P))

// ── Base plate ───────────────────────────────────────────────
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`]
  for (const [x, y] of byDepth(k.corners(BASE, 20))) {
    out.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }))
    out.push(S(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }))
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(BASE, -4, P, 8), { tone: 'faint' }) }))
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }))
  const screws = k.corners(BASE, 10)
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }))
  out.push(D(screws.map(([x, y]) => [x, y, 0])))
  // ruler strip along the front edge
  const strip: Plan = { x: -60, y: 61, w: 100, d: 6, r: 1 }
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.6, 0.6, [1.8, 3.4], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([[strip.x + 2, strip.y + 3, 0.6], [strip.x + strip.w - 2, strip.y + 3, 0.6]], { size: 0.45 }))
  // label plate
  const label: Plan = { x: -150, y: 50, w: 46, d: 12, r: 1.2 }
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }))
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: 'faint' }))
  const rules: Array<[number, number]> = [[4, 30], [6.2, 22], [8.4, 26]]
  out.push(rules.map(([dy, w]) => L(k.lineOnTop([label.x + 4, label.y + dy], [label.x + 4 + w, label.y + dy], 0.8, P), { tone: 'lo', free: true })).join(''))
  out.push(D([[label.x + label.w - 3.5, label.y + 3, 0.8], [label.x + label.w - 3.5, label.y + label.d - 3, 0.8]], { size: 0.45 }))
  return out.join('')
}

// ── Cabinets ─────────────────────────────────────────────────
function cabinet(plan: Plan, exit: boolean) {
  const out: string[] = []
  const seam = k.sideSeam(plan, 7, P, 4)
  out.push(S(k.slabOf(plan, 0, CAB_H, P, 4, 1), { tone: 'mid', inner: L(seam, { tone: 'faint' }) }))
  // top: inset lid with screws, a vent grille
  const lid = k.insetPlan(plan, 4)
  out.push(L(k.planOutline(lid, CAB_H, P, 4), { tone: 'lo' }))
  out.push(D(k.corners(lid, 3).map(([x, y]) => [x, y, CAB_H] as Point3), { size: 0.45 }))
  const grille = k.dotGrid(plan.x + 15.5, plan.y + 21, 6, 7, 5, CAB_H, P)
  out.push(k.dotsSvg(grille, { size: 0.55, tone: 'lo' }))
  // near face: a service door with hinges and a pull
  const fy = plan.y + plan.d
  const x0 = plan.x + 9
  const x1 = plan.x + plan.w - 9
  out.push(L(faceRect('y', fy, x0, x1, 13, CAB_H - 10, 1.6), { tone: 'lo' }))
  out.push(L(faceRect('y', fy, x0 + 3, x1 - 3, 16, CAB_H - 13, 1.2), { tone: 'faint' }))
  out.push(D([[x0 + 2, fy, 22], [x0 + 2, fy, CAB_H - 19]], { size: 0.6, tone: 'mid' }))
  const pull: Plan = { x: x1 - 8, y: fy, w: 3, d: 2.4, r: 0.8 }
  out.push(S(k.slabOf(pull, 32, 11, P, 2), { tone: 'mid' }))
  // vent slots low on the door
  for (let i = 0; i < 3; i++) out.push(L(faceRect('y', fy, x0 + 7 + i * 10, x0 + 13 + i * 10, 18.5, 20, 0.7), { tone: 'lo' }))
  // end face (+x): bolted access panel, or the exit with the belt coming out
  const fx = plan.x + plan.w
  if (!exit) {
    out.push(L(faceRect('x', fx, plan.y + 10, plan.y + plan.d - 10, 14, CAB_H - 12, 1.6), { tone: 'lo' }))
    out.push(D([[fx, plan.y + 13, 17], [fx, plan.y + plan.d - 13, 17], [fx, plan.y + 13, CAB_H - 15], [fx, plan.y + plan.d - 13, CAB_H - 15]], { size: 0.5 }))
  }
  return out.join('')
}

/** The wash cabinet's exit: dark mouth, two brushes inside, a strip curtain. Clipped to the opening. */
function washMouth(clipId: string) {
  const fx = WASH.x + WASH.w
  const mouth = faceRect('x', fx, -OPEN.y, OPEN.y, OPEN.z0, OPEN.z1, 2)
  const out: string[] = []
  out.push(`<clipPath id="${clipId}-mouth"><path d="${mouth}"/></clipPath>`)
  out.push(`<path class="fw-cavity" d="${mouth}"/>`)
  out.push(`<g clip-path="url(#${clipId}-mouth)">`)
  // the far side wall of the tunnel, seen through the opening
  const back = fx - 40
  const wall = (pts: Point3[]) => `<path class="fw-wall" d="${k.pathOf(pts.map(at), true)}"/>`
  out.push(wall([[fx, -OPEN.y, OPEN.z1], [back, -OPEN.y, OPEN.z1], [back, -OPEN.y, OPEN.z0], [fx, -OPEN.y, OPEN.z0]]))
  // the far side brush; the cars pass in front of it
  const brush = k.cylinder(fx - 12, -15, 5, OPEN.z0 - 2, OPEN.z1 - OPEN.z0 + 6, P, 28)
  out.push(S(brush, { tone: 'lo', crease: 'none' }))
  out.push(L(k.knurl(fx - 12, -15, 5, OPEN.z0, OPEN.z1 + 4, 18, P), { tone: 'lo' }))
  out.push('</g>')
  out.push(L(mouth, { tone: 'mid' }))
  // lintel bar
  out.push(S(k.slabOf({ x: fx, y: -OPEN.y - 2, w: 1.6, d: OPEN.y * 2 + 4, r: 0.4 }, OPEN.z1, 2.4, P, 2), { tone: 'mid' }))
  return out.join('')
}

// ── Frame: legs, beams, belt ─────────────────────────────────
function legs(side: 'far' | 'near') {
  const out: string[] = []
  const y0 = side === 'far' ? -28 : 22
  for (const x of LEGS_X) {
    out.push(S(k.cylinder(x, y0 + 3, 4.6, 0, 2, P, 24), { tone: 'lo' }))
    out.push(S(k.slabOf({ x: x - 3, y: y0, w: 6, d: 6, r: 1 }, 2, BEAM_Z - 2, P, 3, 0.4), { tone: 'mid' }))
    if (side === 'far') {
      // cross brace between the legs, under the belt
      out.push(S(k.slabOf({ x: x - 2, y: -22, w: 4, d: 44, r: 0.6 }, 13, 4, P, 2, 0.3), { tone: 'mid' }))
    }
    out.push(D([[x, y0 + 3, 2]], { size: 0.45 }))
  }
  return out.join('')
}

function beam(plan: Plan, near: boolean) {
  const out: string[] = []
  const lip = k.sideSeam(plan, BEAM_TOP - 3, P, 3)
  out.push(S(k.slabOf(plan, BEAM_Z, BEAM_TOP - BEAM_Z, P, 3, 0.5), { tone: 'mid', inner: L(lip, { tone: 'faint' }) }))
  const face = plan.y + plan.d
  const bolts: Point3[] = []
  for (const x of [...LEGS_X, -94, 94]) bolts.push([x, face, BEAM_Z + 5])
  if (near) out.push(D(bolts, { size: 0.5 }))
  // bearing caps where the end rollers' axles come through
  if (near) for (const x of [-95, 95]) out.push(L(k.sideRing([x, face, BT - 5], 2.4, 'y', P, 20), { tone: 'lo' }))
  if (near) {
    // pitch ruler on the near beam's top
    const strip: Plan = { x: -96, y: 22.6, w: 192, d: 4.6, r: 0.6 }
    out.push(S(k.slabOf(strip, BEAM_TOP, 0.4, P, 2), { tone: 'lo', crease: 'none' }))
    const ticks = k.topTicks(-94, 94, 4, 5, 22.9, BEAM_TOP + 0.4, [1.4, 3], P)
    out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  }
  return out.join('')
}

function belt() {
  return S(k.slabOf(BELT, BT - 3, 3, P, 2), { tone: 'lo', crease: 'faint' })
}

/** Belt slats: cross lines on the belt top, phased by the belt's travel. They run edge to edge. */
export function slatsAt(travel: number) {
  const gap = 10
  const lines: string[] = []
  const phase = ((travel % gap) + gap) % gap
  for (let x = BELT.x + phase; x < BELT.x + BELT.w; x += gap) lines.push(k.lineOnTop([x, BELT.y], [x, BELT.y + BELT.d], BT, P))
  return lines.join('')
}

// ── Gantry and gate ──────────────────────────────────────────
function post(y: number) {
  const out: string[] = []
  out.push(S(k.cylinder(GATE_X, y, 5, 0, 2, P, 24), { tone: 'lo' }))
  out.push(S(k.cylinder(GATE_X, y, 2.6, 2, BAR_Z - 2, P, 20), { tone: 'mid', crease: 'none', inner: L(k.sideArc(GATE_X, y, 2.6, BT + 22, P, 12), { tone: 'faint' }) }))
  out.push(D([[GATE_X + 3.6, y, 2], [GATE_X - 3.6, y, 2]], { size: 0.4 }))
  return out.join('')
}

function crossbar() {
  const out: string[] = []
  // a cantilever: one post behind the belt, the arm reaches over it, nothing stands in front of the cars
  const bar: Plan = { x: GATE_X - 4, y: -POST_Y - 4, w: 8, d: POST_Y + 12, r: 1.4 }
  out.push(S(k.slabOf(bar, BAR_Z, BAR_H, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([[GATE_X, -POST_Y, BAR_Z + BAR_H], [GATE_X - 2, -POST_Y + 8, BAR_Z + BAR_H], [GATE_X + 2, -POST_Y + 8, BAR_Z + BAR_H]], { size: 0.5 }))
  // gusset under the arm, against the post
  out.push(S(k.slabOf({ x: GATE_X - 1.2, y: -POST_Y + 2.6, w: 2.4, d: 9, r: 0.4 }, BAR_Z - 9, 9, P, 2), { tone: 'mid' }))
  // pneumatic cylinder that lowers the gate
  const top = BAR_Z + BAR_H
  out.push(S(k.cylinder(GATE_X, 0, 5.2, top, 1.6, P, 28), { tone: 'mid' }))
  out.push(S(k.cylinder(GATE_X, 0, 4.2, top + 1.6, 9, P, 28), { tone: 'mid', inner: L(k.sideArc(GATE_X, 0, 4.2, top + 6, P, 16), { tone: 'faint' }) }))
  out.push(S(k.cylinder(GATE_X, 0, 4.8, top + 10.6, 1.6, P, 28), { tone: 'mid' }))
  out.push(L(k.ring(GATE_X, 0, 2.2, top + 12.2, P, 16), { tone: 'lo' }))
  out.push(D([[GATE_X, 0, top + 12.2]], { size: 0.5, tone: 'mid' }))
  // air fitting on the cylinder's side
  out.push(S(k.slabOf({ x: GATE_X + 3.4, y: -1.2, w: 3, d: 2.4, r: 0.6 }, top + 5, 2.4, P, 2), { tone: 'mid' }))
  return out.join('')
}

/** The gate blade at its rest (open) height; the live code moves it down by `GATE_UP − bottom`. */
export function blade() {
  const out: string[] = []
  const plate: Plan = { x: GATE_X - 1.6, y: -20.5, w: 3.2, d: 41, r: 0.6 }
  out.push(S(k.slabOf(plate, GATE_UP + 1.6, 11, P, 2, 0.3), { tone: 'hi', crease: 'lo' }))
  out.push(S(k.slabOf({ x: GATE_X - 2, y: -21, w: 4, d: 42, r: 0.8 }, GATE_UP, 1.6, P, 2), { tone: 'lo' }))
  out.push(D([[GATE_X + 1.6, -15, GATE_UP + 8], [GATE_X + 1.6, 15, GATE_UP + 8]], { size: 0.45 }))
  out.push(S(k.slabOf({ x: GATE_X - 2.4, y: -2.4, w: 4.8, d: 4.8, r: 1 }, GATE_UP + 12.6, 2, P, 2), { tone: 'mid' }))
  return out.join('')
}

/** The piston rod from the crossbar down to the blade's clevis. */
export function rodAt(bottom: number) {
  const from = bottom + 14.6
  return S(k.cylinder(GATE_X, 0, 1.2, from, BAR_Z - from, P, 14), { tone: 'mid', crease: 'none' })
}
export const GATE_TRAVEL = GATE_UP - GATE_DOWN

// ── Feeler ───────────────────────────────────────────────────
const ARM_Z = BT + 4.5
const ARM_H = 3
const SCALE_Z = BRACKET_Z + 12 + 1.2 // top of the scale plate on the bracket
export const SCALE_R = 18

function bracket() {
  const out: string[] = []
  // a post from the base plate carries the bracket's outer end
  const leg: [number, number] = [BRACKET.x + BRACKET.w / 2, BRACKET.y + BRACKET.d - 6]
  out.push(S(k.cylinder(leg[0], leg[1], 5, 0, 2, P, 24), { tone: 'lo' }))
  out.push(S(k.cylinder(leg[0], leg[1], 2.6, 2, BRACKET_Z - 2, P, 20), { tone: 'mid', crease: 'none' }))
  out.push(D([[leg[0] + 3.8, leg[1], 2], [leg[0] - 3.8, leg[1], 2]], { size: 0.4 }))
  out.push(S(k.slabOf(BRACKET, BRACKET_Z, 12, P, 3, 0.5), { tone: 'mid' }))
  out.push(D(k.corners(BRACKET, 2.6).map(([x, y]) => [x, y, BRACKET_Z + 12] as Point3), { size: 0.45 }))
  // the scale plate the needle sweeps
  const plate: Plan = { x: PIVOT[0] - 13, y: PIVOT[1] + 4, w: 26, d: 17.5, r: 1.8 }
  out.push(S(k.slabOf(plate, BRACKET_Z + 12, 1.2, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.radialTicks(PIVOT[0], PIVOT[1], SCALE_R, 8, 4, SCALE_Z, [1.8, 3.6], P, Math.PI - 0.48, 0.48)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  const arc: [number, number][] = []
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI - 0.48 + (i / 24) * 0.48
    arc.push([PIVOT[0] + Math.sin(a) * SCALE_R, PIVOT[1] - Math.cos(a) * SCALE_R])
  }
  out.push(L(k.onTop(arc, SCALE_Z, P), { tone: 'lo' }))
  // trip mark: where the gate drops
  const trip = needleDir(TRIP)
  out.push(L(k.lineOnTop([PIVOT[0] + trip[0] * (SCALE_R - 4.6), PIVOT[1] + trip[1] * (SCALE_R - 4.6)], [PIVOT[0] + trip[0] * SCALE_R, PIVOT[1] + trip[1] * SCALE_R], SCALE_Z, P), { tone: 'hi' }))
  return out.join('')
}

export const SPRING_POST: [number, number] = [PIVOT[0] + 14, PIVOT[1] - 4]
/** The needle points away from the belt (+y) and turns with the lever. */
const needleDir = (phi: number): [number, number] => [Math.sin(phi), Math.cos(phi)]
export function springPost() {
  return [
    S(k.cylinder(SPRING_POST[0], SPRING_POST[1], 2.4, BRACKET_Z + 12, 1, P, 18), { tone: 'lo' }),
    S(k.cylinder(SPRING_POST[0], SPRING_POST[1], 1.5, BRACKET_Z + 13, ARM_Z + ARM_H + 1 - BRACKET_Z - 13, P, 16), { tone: 'mid' }),
  ].join('')
}

const rot = turn

/** A bar of width `w` between two floor points, turned about the pivot by `phi`. */
function bar(a: [number, number], b: [number, number], w: number, phi: number) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / len
  const uy = (b[1] - a[1]) / len
  const nx = -uy * (w / 2)
  const ny = ux * (w / 2)
  const ring: [number, number][] = [
    [a[0] + nx, a[1] + ny],
    [b[0] + nx, b[1] + ny],
    [b[0] - nx, b[1] - ny],
    [a[0] - nx, a[1] - ny],
  ]
  return ring.map((p) => rot(p, phi))
}

const ELBOW: [number, number] = [PIVOT[0], 16]

/** The whole lever turned by `phi`: arm, finger, roller, hub, return spring. Back to front. */
export function leverAt(phi: number) {
  const out: string[] = []
  // pivot post (under the hub), drawn after the needle so it covers the needle's root
  out.push(S(k.cylinder(PIVOT[0], PIVOT[1], 2.4, SCALE_Z, ARM_Z - SCALE_Z, P, 18), { tone: 'mid', crease: 'none' }))
  const attach = rot([PIVOT[0] + 2, SPRING_POST[1]], phi)
  const coil = k.coil(attach[0] - 0.5, SPRING_POST[0] - 1.5, [SPRING_POST[1], ARM_Z + 1.5], 1.5, 5, 'x', P, 14)
  out.push(L(coil.back, { tone: 'lo' }))
  out.push(S(k.extrude(bar([PIVOT[0], PIVOT[1]], ELBOW, 4, phi), ARM_Z, ARM_H, P), { tone: 'hi', crease: 'lo' }))
  out.push(S(k.extrude(bar(ELBOW, TIP, 3, phi), ARM_Z, ARM_H, P), { tone: 'hi', crease: 'lo' }))
  const elbow = rot(ELBOW, phi)
  out.push(D([[elbow[0], elbow[1], ARM_Z + ARM_H]], { size: 0.45 }))
  const tip = rot(TIP, phi)
  out.push(S(k.cylinder(tip[0], tip[1], TIP_R, BT + 2.8, ARM_Z + ARM_H + 1.2 - BT - 2.8, P, 18), { tone: 'hi', lit: true }))
  out.push(D([[tip[0], tip[1], ARM_Z + ARM_H + 1.2]], { size: 0.4, tone: 'mid' }))
  out.push(S(k.cylinder(PIVOT[0], PIVOT[1], 4, ARM_Z - 0.6, ARM_H + 2.4, P, 28, 0.4), { tone: 'mid' }))
  out.push(L(k.ring(PIVOT[0], PIVOT[1], 1.8, ARM_Z + ARM_H + 1.8, P, 16), { tone: 'lo' }))
  out.push(D([[PIVOT[0], PIVOT[1], ARM_Z + ARM_H + 1.8]], { size: 0.5, tone: 'mid' }))
  out.push(L(coil.front, { tone: 'mid' }))
  return out.join('')
}

/** The needle on the scale plate, turned with the lever. Its root sits under the hub. */
export function needleAt(phi: number) {
  const [dx, dy] = needleDir(phi)
  const from: [number, number] = [PIVOT[0] + dx * 2.6, PIVOT[1] + dy * 2.6]
  const to: [number, number] = [PIVOT[0] + dx * (SCALE_R - 1), PIVOT[1] + dy * (SCALE_R - 1)]
  return k.lineOnTop(from, to, SCALE_Z + 0.1, P)
}

// ── Cars ─────────────────────────────────────────────────────
const RAD = Math.PI / 180

/** A model car centred on the floor origin, turned by `deg`. The live code moves it along x. */
export function carSvg(deg: number, lit: boolean) {
  const t = deg * RAD
  const c = Math.cos(t)
  const s = Math.sin(t)
  const w = ([u, v]: [number, number]): [number, number] => [u * c - v * s, u * s + v * c]
  const ring = (plan: Plan, steps = 4) => k.roundedPlan(plan, steps).map((p) => w(p as [number, number]))
  const out: string[] = []
  const WHEEL_R = 3.4
  const wheel = (u: number, side: number) => {
    const [x, y] = w([u, side * (HALF_W - 1.2)])
    const F = G.frameAlong([x, y, BT + WHEEL_R], [-s * side, c * side, 0])
    const parts = [S(G.disc(-1.3, 1.3, WHEEL_R, F, P), { tone: 'mid' })]
    if (side > 0) parts.push(L(G.circleOf(F, 1.3, 1.5, P, 16), { tone: 'lo' }))
    return parts.join('')
  }
  const style = { tone: 'hi' as const, crease: 'lo' as const, lit }
  const wheels = [-11, 11].flatMap((u) => [-1, 1].map((side) => ({ u, side, depth: k.depthOf([...w([u, side * HALF_W]), 0] as Point3, P) })))
  wheels.sort((a, b) => a.depth - b.depth)
  // far wheels first, then the body over them, then the near wheels
  for (const it of wheels.filter((it) => it.side < 0)) out.push(wheel(it.u, it.side))
  out.push(`<path class="iso-halo fw-car-halo" d="${k.extrude(ring({ x: -HALF_L, y: -HALF_W, w: HALF_L * 2, d: HALF_W * 2, r: BODY_R }), BT, 0.1, P).fill}"/>`)
  for (const end of [-1, 1]) {
    const u0 = end > 0 ? BUMPER.u0 - 1 : -BUMPER.u1
    out.push(S(k.extrude(ring({ x: u0, y: -BUMPER.half, w: BUMPER.u1 - BUMPER.u0 + 1, d: BUMPER.half * 2, r: 0.6 }, 2), BT + 2.6, 2.4, P), { tone: 'mid', lit }))
  }
  const body = ring({ x: -HALF_L, y: -HALF_W, w: HALF_L * 2, d: HALF_W * 2, r: BODY_R })
  out.push(S(k.extrude(body, BT + 3, 5.4, P, { bevel: 0.6 }), { ...style, inner: L(k.ringSeam(body, BT + 5.6, P), { tone: 'faint' }) }))
  // cabin: a greenhouse with a raked windscreen and rear window, as a prism across the car
  const F = G.frameOf([0, 0, BT + 8.4], [-s, c, 0], [c, s, 0], [0, 0, 1])
  const glass: [number, number][] = [[-11, 0], [7, 0], [3, 4.8], [-8.4, 4.8]]
  out.push(S(G.prismOf(F, glass, -7.4, 7.4, P), style))
  // window outlines on the faces that look at the viewer: the near side and the windscreen
  const world = (u: number, v: number, z: number): Point3 => [u * c - v * s, u * s + v * c, BT + 8.4 + z]
  const outline = (pts: Point3[]) => k.pathOf(pts.map(at), true)
  const sideV = k.depthOf([-s, c, 0], P) > 0 ? 7.4 : -7.4
  out.push(L(outline([world(-9.6, sideV, 0.9), world(-1.6, sideV, 0.9), world(-1.6, sideV, 4), world(-8.2, sideV, 4)]), { tone: 'mid' }))
  out.push(L(outline([world(-0.4, sideV, 0.9), world(5.4, sideV, 0.9), world(2.8, sideV, 4), world(-0.4, sideV, 4)]), { tone: 'mid' }))
  const rake = Math.hypot(4, 4.8)
  if (k.depthOf([(c * 4.8) / rake, (s * 4.8) / rake, 4 / rake], P) > 0) {
    const along = (f: number, v: number) => world(7 - 4 * f, v, 4.8 * f)
    out.push(L(outline([along(0.18, -5.6), along(0.18, 5.6), along(0.86, 5.2), along(0.86, -5.2)]), { tone: 'mid' }))
  }
  // headlights on the front face
  const lamps = [-5.5, 5.5].map((v) => [...w([HALF_L + 0.05, v]), BT + 6] as Point3)
  out.push(D(lamps, { size: 0.7, tone: 'mid' }))
  for (const it of wheels.filter((it) => it.side > 0)) out.push(wheel(it.u, it.side))
  return out.join('')
}

// ── Motor ────────────────────────────────────────────────────
function motor() {
  const out: string[] = []
  out.push(`<path class="iso-halo" d="${k.haloOf(MOTOR, 0, 0.1, P)}" style="filter:blur(4px)"/>`)
  out.push(S(k.slabOf(MOTOR, 0, MOTOR_H, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(MOTOR, 4, P, 3), { tone: 'faint' }) }))
  const fy = MOTOR.y + MOTOR.d
  for (let i = 0; i < 5; i++) out.push(L(faceRect('y', fy, MOTOR.x + 6 + i * 6.4, MOTOR.x + 9.6 + i * 6.4, 8, 17, 0.8), { tone: 'lo' }))
  out.push(L(faceRect('x', MOTOR.x + MOTOR.w, MOTOR.y + 5, MOTOR.y + MOTOR.d - 5, 7, 18, 1.2), { tone: 'faint' }))
  out.push(D(k.corners(MOTOR, 2.6).map(([x, y]) => [x, y, MOTOR_H] as Point3), { size: 0.45 }))
  // belt guard up to the near beam
  const guard: Plan = { x: MOTOR.x + 10, y: 28, w: 12, d: 5, r: 1.2 }
  out.push(S(k.slabOf(guard, MOTOR_H, BEAM_TOP - 4 - MOTOR_H, P, 3, 0.4), { tone: 'mid' }))
  out.push(D([[guard.x + 6, guard.y + guard.d, BEAM_TOP - 9], [guard.x + 6, guard.y + guard.d, MOTOR_H + 5]], { size: 0.45 }))
  // speed knob with a pointer
  const knob: [number, number] = [MOTOR.x + 33, MOTOR.y + 12]
  out.push(S(k.cylinder(knob[0], knob[1], 6.6, MOTOR_H, 1.2, P, 28), { tone: 'lo' }))
  out.push(S(k.cylinder(knob[0], knob[1], 4.6, MOTOR_H + 1.2, 4, P, 28), { tone: 'mid' }))
  out.push(L(k.knurl(knob[0], knob[1], 4.6, MOTOR_H + 1.2, MOTOR_H + 5.2, 30, P), { tone: 'lo' }))
  out.push(L(k.lineOnTop([knob[0], knob[1]], [knob[0] + 3.2, knob[1] - 3.2], MOTOR_H + 5.2, P), { tone: 'hi', free: 'end' }))
  const dial = k.radialTicks(knob[0], knob[1], 6.4, 8, 4, MOTOR_H + 1.2, [0.8, 1.6], P, -2.2, 4.4)
  out.push(L(dial.minor, { tone: 'lo' }), L(dial.major, { tone: 'mid' }))
  return out.join('')
}

// ── Layers in painter's order ────────────────────────────────
export function staticArt(clipId: string) {
  return {
    back: [base(), cabinet(WASH, true), washMouth(clipId), legs('far'), legs('near'), post(-POST_Y), beam(BEAM_FAR, false), belt()].join(''),
    beam: [beam(BEAM_NEAR, true), bracket()].join(''),
    springPost: springPost(),
    front: [crossbar(), cabinet(END, false), motor()].join(''),
  }
}

const hullOf = (pts: Flat[]) => {
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (list: Flat[]) => {
    const out: Flat[] = []
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2]!, out[out.length - 1]!, p) <= 0) out.pop()
      out.push(p)
    }
    return out.slice(0, -1)
  }
  return [...half(sorted), ...half([...sorted].reverse())]
}

/**
 * Clip for the cars. A car shows where it is out of the wash cabinet (the box the cars occupy, x > −100),
 * and inside the tunnel only through the mouth. Every ray that leaves the box through x = −100 passes the mouth,
 * so the two together are exact for anything in the cars' box.
 */
export const carClip = (() => {
  const fx = WASH.x + WASH.w
  const pts: Flat[] = []
  for (const x of [fx, 400]) for (const y of [-14, 14]) for (const z of [BT - 1, BT + 14]) pts.push(at([x, y, z]))
  return k.pathOf(hullOf(pts), true) + faceRect('x', fx, -OPEN.y, OPEN.y, OPEN.z0, OPEN.z1, 2)
})()

export const depthOfCar = (x: number) => k.depthOf([x, 0, BT + 6], P)
export const shiftX = (x: number) => k.translateAlong(P, [x, 0, 0])
export const shiftZ = (z: number) => k.translateAlong(P, [0, 0, z])
