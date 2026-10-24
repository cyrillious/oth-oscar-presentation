// Static art for Fig 02, built once as SVG strings with the anatomy kit.
// A dial indicator on a surface plate: magnetic base, post, clamp and arm hold the dial;
// a carriage on two rails carries four wrung gauge blocks under the plunger.
import * as k from '#/components/iso/iso-kit'
import type { Plan, Plane, Point3 } from '#/components/iso/iso-kit'
import { BLOCKS, BLOCK_D, BLOCK_W, BOSS, DIAL, FIRST, PER_TURN, REACH, STOPS, TICKS, TIP_R, ZERO } from './model'

export const WIDTH = 600
export const HEIGHT = 500

const PLATE: Plan = { x: -86, y: -84, w: 172, d: 132, r: 9 }
const PLATE_H = 12
const FOOT_H = 5

const MAG: Plan = { x: -22, y: -76, w: 44, d: 34, r: 3 }
const MAG_H = 24
const POST: Plane = [0, -62]
const POST_TOP = 108
const CLAMP_Z = 84

const DIAL_R = 20
const DIAL_Z = 66
const DIAL_H = 10
export const DIAL_TOP = DIAL_Z + DIAL_H
const SLEEVE_FROM = 44

const RAIL_FROM = -68
const RAIL_TO = 68
const RAILS = [-21, 16]
const CARRIAGE: Plan = { x: -36, y: -24, w: 72, d: 48, r: 3 }
const CARRIAGE_Z = 3
export const CARRIAGE_TOP = 8
const STEM = 30
const AZIMUTH = 38

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [POST[0], POST[1], POST_TOP + 2],
    [DIAL[0] + DIAL_R + 8, 0, DIAL_TOP],
  ],
  WIDTH,
  HEIGHT,
  { pad: 34, azimuth: AZIMUTH },
)

const at = (point: Point3) => k.iso(point, P)
/** Dial angle that points straight up on screen, so zero sits at 12 o'clock. */
const UP = ((AZIMUTH - 90) * Math.PI) / 180
const toward = (angle: number, r: number, [cx, cy]: Plane): Plane => [cx + Math.sin(angle) * r, cy - Math.cos(angle) * r]
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style)
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style)
const D = (points: Array<[number, number]>, style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style)
const byDepth = <T extends Plane>(points: T[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`]
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }))
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }))
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: 'faint' }) }))
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }))
  const screws = k.corners(PLATE, 10)
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }))
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }))

  // Ruler strip in front of the rails; the carriage's index rides over it.
  const strip: Plan = { x: RAIL_FROM + 4, y: 27, w: RAIL_TO - RAIL_FROM - 8, d: 6, r: 1 }
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'faint' }))
  const ticks = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 2, 5, strip.y + 0.1, 0.6, [2, strip.d - 0.2], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([strip.x + 1.6, strip.y + 3, 0.6]), at([strip.x + strip.w - 1.6, strip.y + 3, 0.6])], { size: 0.4 }))

  // Label plate, front left: three rule lines stand for the printed spec.
  const label: Plan = { x: -70, y: -73, w: 40, d: 18, r: 1.6 }
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }))
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: 'faint' }))
  ;[
    [5, 24],
    [9, 17],
    [13, 21],
  ].forEach(([dy, len]) => out.push(L(k.lineOnTop([label.x + 8, label.y + dy], [label.x + 8 + len, label.y + dy], 0.8, P), { tone: 'lo', free: true })))
  out.push(D([at([label.x + 4, label.y + 9, 0.8]), at([label.x + label.w - 4, label.y + 9, 0.8])], { size: 0.45 }))
  return out.join('')
}

function rails() {
  const out: string[] = []
  for (const y of RAILS) {
    const rail: Plan = { x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }
    out.push(S(k.slabOf(rail, 0, 3, P, 3, 0.4), { tone: 'mid' }))
    out.push(D([RAIL_FROM + 5, (RAIL_FROM + RAIL_TO) / 2, RAIL_TO - 5].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }))
  }
  for (const x of byDepth([[RAIL_FROM - 5, 0] as Plane, [RAIL_TO, 0] as Plane])) {
    // Rubber bumper on the inner face: in front of the far stop, hidden behind the near one.
    const far = x[0] < 0
    const bumper = S(k.slabOf({ x: far ? x[0] + 5 : x[0] - 1.6, y: -4, w: 1.6, d: 8, r: 0.6 }, 2, 4, P, 2), { tone: 'lo', crease: 'none' })
    if (!far) out.push(bumper)
    out.push(S(k.slabOf({ x: x[0], y: -24, w: 5, d: 48, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: 'mid' }))
    out.push(D([at([x[0] + 2.5, -19, 8]), at([x[0] + 2.5, 19, 8])], { size: 0.45 }))
    if (far) out.push(bumper)
  }
  return out.join('')
}

function fixture() {
  const out: string[] = []
  // Magnetic base with its on/off knob.
  out.push(S(k.slabOf(MAG, 0, 11, P, 6, 0.8), { tone: 'mid' }))
  out.push(S(k.slabOf(k.insetPlan(MAG, 0.8), 11, MAG_H - 11, P, 6, 0.8), { tone: 'mid', inner: L(k.sideSeam(k.insetPlan(MAG, 0.8), 17, P, 6), { tone: 'faint' }) }))
  out.push(L(k.planOutline(k.insetPlan(MAG, 3), MAG_H, P), { tone: 'faint' }))
  out.push(D([at([MAG.x + 5, MAG.y + 5, MAG_H]), at([MAG.x + 5, MAG.y + MAG.d - 5, MAG_H]), at([MAG.x + MAG.w - 5, MAG.y + 5, MAG_H])], { size: 0.45 }))
  const knob: Plane = [MAG.x + 34, MAG.y + 24]
  out.push(S(k.cylinder(knob[0], knob[1], 5, MAG_H, 4, P, 32), { tone: 'mid' }))
  out.push(L(k.knurl(knob[0], knob[1], 5, MAG_H, MAG_H + 4, 32, P), { tone: 'lo' }))
  out.push(L(k.lineOnTop([knob[0], knob[1]], [knob[0] + 5, knob[1]], MAG_H + 4, P), { tone: 'hi' }))
  out.push(D([at([knob[0], knob[1], MAG_H + 4])], { size: 0.5, tone: 'hi' }))

  // Post with collar, clamp block, thumb screw and cap.
  out.push(S(k.cylinder(POST[0], POST[1], 5, MAG_H, 4, P, 28), { tone: 'mid' }))
  out.push(S(k.cylinder(POST[0], POST[1], 3.2, MAG_H + 4, CLAMP_Z - 4 - MAG_H - 4, P, 28), { tone: 'mid', crease: 'none', inner: L([56, 80].map((z) => k.sideArc(POST[0], POST[1], 3.2, z, P, 16)).join(''), { tone: 'faint' }) }))
  const clamp: Plan = { x: POST[0] - 7, y: POST[1] - 7, w: 14, d: 14, r: 2.5 }
  out.push(S(k.slabOf(clamp, CLAMP_Z - 4, 12, P, 4, 0.6), { tone: 'mid' }))
  out.push(D([at([clamp.x + 3, clamp.y + 3, CLAMP_Z + 8]), at([clamp.x + clamp.w - 3, clamp.y + 3, CLAMP_Z + 8])], { size: 0.4 }))
  out.push(S(k.cylinder(POST[0], POST[1], 3.2, CLAMP_Z + 8, POST_TOP - CLAMP_Z - 8, P, 28), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(POST[0], POST[1], 3.8, POST_TOP, 2, P, 28), { tone: 'mid' }))
  out.push(L(k.ring(POST[0], POST[1], 1.4, POST_TOP + 2, P, 12), { tone: 'lo' }))

  // Arm from the clamp to the dial lug.
  const arm: Plan = { x: -3, y: POST[1] + 7, w: 6, d: DIAL[1] - DIAL_R - 4 - POST[1] - 7, r: 2 }
  out.push(S(k.slabOf(arm, CLAMP_Z, 4, P, 4, 0.5), { tone: 'mid', inner: L(k.sideSeam(arm, CLAMP_Z + 2, P, 4), { tone: 'faint' }) }))
  out.push(D([at([0, arm.y + 4, CLAMP_Z + 4]), at([0, arm.y + arm.d - 5, CLAMP_Z + 4])], { size: 0.45 }))

  const thumb: Plane = [clamp.x + clamp.w + 4.4, clamp.y + 7]
  out.push(S(k.slabOf({ x: clamp.x + clamp.w, y: thumb[1] - 1.4, w: 3, d: 2.8, r: 0.8 }, CLAMP_Z + 1, 4, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(thumb[0], thumb[1], 2.6, CLAMP_Z, 6, P, 20), { tone: 'mid' }))
  out.push(L(k.knurl(thumb[0], thumb[1], 2.6, CLAMP_Z, CLAMP_Z + 6, 18, P), { tone: 'lo' }))
  return out.join('')
}

/** The carriage and its blocks, built at carriage offset 0 and moved with translateAlong. */
function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), CARRIAGE_Z, 0.1, P)}" style="filter:blur(4px)"/>`]
  out.push(S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 5, 0.6), { tone: 'mid', inner: L(k.sideSeam(CARRIAGE, CARRIAGE_Z + 2.4, P, 5), { tone: 'faint' }) }))
  // Gibs over the rails at both ends.
  const gibs: Plan[] = []
  for (const x of [CARRIAGE.x + 1.5, CARRIAGE.x + CARRIAGE.w - 7.5]) for (const y of RAILS) gibs.push({ x, y: y - 1, w: 6, d: 7, r: 1 })
  for (const gib of gibs.sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P))) {
    out.push(S(k.slabOf(gib, CARRIAGE_TOP, 1.6, P, 2, 0.3), { tone: 'mid' }))
    out.push(D([at([gib.x + 3, gib.y + 3.5, CARRIAGE_TOP + 1.6])], { size: 0.4 }))
  }
  out.push(D([-24, -12, 0, 12, 24].map((x) => at([x, CARRIAGE.y + CARRIAGE.d - 2.4, CARRIAGE_TOP])), { size: 0.4, tone: 'lo' }))
  // Seat outline the blocks are wrung onto.
  const seat: Plan = { x: FIRST - 2, y: -BLOCK_D / 2 - 2, w: BLOCK_W * BLOCKS.length + 4, d: BLOCK_D + 4, r: 1.2 }
  out.push(L(k.planOutline(seat, CARRIAGE_TOP, P, 3), { tone: 'faint' }))

  // Index pointer over the ruler strip.
  out.push(S(k.slabOf({ x: -1.2, y: CARRIAGE.y + CARRIAGE.d, w: 2.4, d: 4, r: 0.5 }, CARRIAGE_Z + 0.4, 1.2, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(L(k.lineOnTop([0, CARRIAGE.y + CARRIAGE.d + 0.4], [0, CARRIAGE.y + CARRIAGE.d + 3.6], CARRIAGE_Z + 1.6, P), { tone: 'hi' }))

  // Gauge blocks, far to near. Each has an inset lapped face and a rule line engraved on its front.
  const order = BLOCKS.map((block, index) => ({ block, index })).sort(
    (a, b) => k.depthOf([FIRST + BLOCK_W * a.index, 0, 0], P) - k.depthOf([FIRST + BLOCK_W * b.index, 0, 0], P),
  )
  for (const { block, index } of order) {
    const plan: Plan = { x: FIRST + BLOCK_W * index, y: -BLOCK_D / 2, w: BLOCK_W, d: BLOCK_D, r: 0.8 }
    const top = CARRIAGE_TOP + block.height
    out.push(`<g data-block="${index}">`)
    out.push(S(k.slabOf(plan, CARRIAGE_TOP, block.height, P, 3, 0.5), { tone: 'hi', crease: 'lo' }))
    out.push(L(k.planOutline(k.insetPlan(plan, 2), top, P, 3), { tone: 'faint' }))
    // Engraved size on the front face (stands for text).
    const fy = plan.y + plan.d
    out.push(L(k.segment([plan.x + 3, fy, CARRIAGE_TOP + 4], [plan.x + 3 + (index === 3 ? 9 : 6), fy, CARRIAGE_TOP + 4], P), { tone: 'lo', free: true }))
    out.push('</g>')
  }

  // Handle: neck and knurled knob on the front face.
  const handle: Plane = [CARRIAGE.x + CARRIAGE.w - 9, CARRIAGE.y + CARRIAGE.d + 3]
  out.push(S(k.slabOf({ x: handle[0] - 2, y: CARRIAGE.y + CARRIAGE.d - 1, w: 4, d: 4, r: 1 }, CARRIAGE_Z + 1, 3, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(handle[0], handle[1] + 1, 3, CARRIAGE_Z, 5, P, 20), { tone: 'mid' }))
  out.push(L(k.knurl(handle[0], handle[1] + 1, 3, CARRIAGE_Z, CARRIAGE_Z + 5, 18, P), { tone: 'lo' }))
  return out.join('')
}

/** OSCAR's boss, drawn in its own slot so it can sit before or after the plunger. */
function boss() {
  const index = BLOCKS.findIndex((block) => block.boss)
  const block = BLOCKS[index]
  const top = CARRIAGE_TOP + block.height
  const plan: Plan = { x: FIRST + BLOCK_W * index + BOSS.inset, y: -BOSS.d / 2, w: BLOCK_W - BOSS.inset * 2, d: BOSS.d, r: 1.4 }
  return (
    S(k.slabOf(plan, top, block.boss, P, 4, 0.5), { tone: 'hi', crease: 'lo', lit: true }) +
    L(k.planOutline(k.insetPlan(plan, 1.6), top + block.boss, P, 4), { tone: 'faint' })
  )
}

/** Plunger built with its tip at z = 0; moved up to the surface under it. */
function plunger() {
  const [x, y] = DIAL
  return [
    S(k.cylinder(x, y, TIP_R, 0, 2.4, P, 20), { tone: 'hi', lit: true }),
    S(k.cylinder(x, y, 1.4, 2.4, STEM, P, 16), { tone: 'hi', crease: 'none', lit: true }),
  ].join('')
}

function dial() {
  const out: string[] = []
  const [x, y] = DIAL
  // Stem sleeve with a lifting lever and a seal collar.
  out.push(S(k.cylinder(x, y, 3.6, SLEEVE_FROM - 2, 2, P, 20), { tone: 'mid' }))
  out.push(S(k.cylinder(x, y, 2.9, SLEEVE_FROM, DIAL_Z - SLEEVE_FROM, P, 20), { tone: 'mid', inner: L(k.sideArc(x, y, 2.9, 54, P, 12), { tone: 'faint' }) }))
  out.push(S(k.slabOf({ x: x + 2.4, y: -1.2, w: 7, d: 2.4, r: 0.8 }, 50, 2.4, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(x + 9.6, 0, 1.6, 49.4, 3.6, P, 14), { tone: 'mid' }))
  // Lug joining the arm.
  out.push(S(k.slabOf({ x: x - 4, y: y - DIAL_R - 5, w: 8, d: 7, r: 1.5 }, DIAL_Z + 2, CLAMP_Z - DIAL_Z - 2, P, 3, 0.4), { tone: 'mid' }))
  // Puck, knurled bezel, rings and ticks.
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: 'faint' }) }))
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: 'lo' }))
  out.push(L(k.ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 64), { tone: 'lo' }))
  const ticks = k.radialTicks(x, y, DIAL_R - 3, TICKS, 5, DIAL_TOP, [1.3, 2.8], P, UP)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(L(k.lineOnTop(toward(UP, DIAL_R - 3, DIAL), toward(UP, DIAL_R - 6.6, DIAL), DIAL_TOP, P), { tone: 'hi' }))
  // Turn counter: a small sub-dial on the face.
  const sub: Plane = [x + 7, y + 6]
  out.push(L(k.ring(sub[0], sub[1], 3.6, DIAL_TOP, P, 28), { tone: 'lo' }))
  const subTicks = k.radialTicks(sub[0], sub[1], 3.6, 10, 5, DIAL_TOP, [0.8, 1.4], P, UP)
  out.push(L(subTicks.minor, { tone: 'faint' }), L(subTicks.major, { tone: 'lo' }))
  // Crown and stop on the +x side.
  out.push(S(k.slabOf({ x: x + DIAL_R - 1, y: -2.4, w: 5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 5, P, 3), { tone: 'mid' }))
  out.push(S(k.slabOf({ x: x + DIAL_R + 3.6, y: -3.2, w: 2.6, d: 6.4, r: 1.2 }, DIAL_Z + 1.2, 6.6, P, 3), { tone: 'mid' }))
  out.push(L(k.ring(x, y, 1.6, DIAL_TOP, P, 16), { tone: 'mid' }))
  out.push(k.faceTextSvg(k.topMatrix([x - 9, y + 3], DIAL_TOP, P, 'x'), '0.2', { size: 2.4, tone: 'lo', anchor: 'middle' }))
  return out.join('')
}

/** Needle for a reading in mm (zeroed on block 1). */
export function needleAt(reading: number) {
  const angle = UP + ((reading - ZERO) / PER_TURN) * Math.PI * 2
  const [x, y] = DIAL
  return k.lineOnTop(
    [x - Math.sin(angle) * 3.4, y + Math.cos(angle) * 3.4],
    [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)],
    DIAL_TOP + 0.2,
    P,
  )
}

/** Turn counter hand: one division per full needle turn. */
export function counterAt(reading: number) {
  const angle = UP + ((reading - ZERO) / PER_TURN / 10) * Math.PI * 2
  const [cx, cy] = [DIAL[0] + 7, DIAL[1] + 6]
  return k.lineOnTop([cx, cy], [cx + Math.sin(angle) * 2.8, cy - Math.cos(angle) * 2.8], DIAL_TOP + 0.2, P)
}

export const carriageAt = (x: number) => k.translateAlong(P, [x, 0, 0])
export const plungerAt = (height: number) => k.translateAlong(P, [0, 0, CARRIAGE_TOP + height])

/** +1 when moving the carriage along +x moves it right on screen. */
export const RIGHTWARD = k.axisVector(P, [1, 0, 0])[0] >= 0 ? 1 : -1

export const ART = {
  back: [plate(), fixture(), rails()].join(''),
  carriage: carriage(),
  boss: boss(),
  plunger: plunger(),
  dial: dial(),
}

export { REACH, STOPS }
