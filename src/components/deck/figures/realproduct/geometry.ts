// Static geometry for Fig 04: a core drill on a cutaway sample case.
// World units ≈ 1 mm, x/y on the floor, z up, the sample surface at z = 0.
import * as k from '#/components/iso/iso-kit'
import * as G from '#/components/iso/lathe.mjs'
import type { Flat, Plan, Plane, Point3, SolidPaths } from '#/components/iso/iso-kit'
import { AT_BORE, BOUNDS, DEPTH, LIFTED, STRATA, boundary } from './model'

export const WIDTH = 600
export const HEIGHT = 500
const AZIMUTH = 45

/** Sample footprint: x ∈ [−W, W], y ∈ [−D, D]. The near quadrant (x > 0, y > 0) is cut away. */
export const W = 56
export const D = 46
const TRAY_H = 6
const FOOT_H = 5
const TRAY: Plan = { x: -W - 6, y: -D - 6, w: 2 * W + 56, d: 2 * D + 12, r: 5 }
const FLOOR = -DEPTH

/** Rig on the sample: skid, mast, carriage, motor head, rod. */
const SKID: Plan = { x: -54, y: -22, w: 42, d: 44, r: 3 }
const RUNNER_H = 2.4
const SKID_TOP = RUNNER_H + 3
const MAST: Plan = { x: -38, y: -5, w: 10, d: 10, r: 1 }
const MAST_FOOT = SKID_TOP + 3
const MAST_TOP = 126
export const ROD_L = 90 // chuck face to bit tip
const BIT_H = 5
const ROD_R = 2.2
const BIT_R = 3.4
/** The moving head is built with the bit tip at z = TIP0 (bit lifted). */
export const TIP0 = -LIFTED
const CHUCK_Z = TIP0 + ROD_L
const HOUSING_Z = CHUCK_Z + 6
const HOUSING_H = 18
const HOUSING_R = 9
const CARRIAGE: Plan = { x: -26.8, y: -8, w: 8, d: 16, r: 1.4 }
const CARRIAGE_Z = HOUSING_Z - 2
const CARRIAGE_H = 22
/** The carriage's index tab rides over the ruler. Built at TAB_Z; it sits at ZERO_Z when the bit tip is at the surface. */
const TAB_Z = CARRIAGE_Z + 1.5
const ZERO_Z = TAB_Z - TIP0
export const BORE_R = 4.4

const fitPoints: Point3[] = [
  ...k.boxCorners(TRAY, FLOOR - TRAY_H - FOOT_H, FLOOR),
  ...k.boxCorners({ x: -W, y: -D, w: 2 * W, d: 2 * D, r: 0 }, FLOOR, 2),
  [MAST.x, MAST.y, MAST_TOP + 4],
  [0, 0, HOUSING_Z + HOUSING_H + 4],
]
export const P = k.fitProjection(fitPoints, WIDTH, HEIGHT, { pad: 8, azimuth: AZIMUTH })
export const at = (p: Point3) => k.iso(p, P)

const byDepth = (pts: Plane[]) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))

// ---------- seeded random, so server and client draw the same grains ----------
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- the cutaway faces ----------
type Face = { a: Plane; b: Plane; n: Plane; key: string }
/** The four vertical faces you see: two outer faces behind glass, two cut faces in the notch. */
export const FACES: Face[] = [
  { key: 'outer-y', a: [-W, D], b: [0, D], n: [0, 1] },
  { key: 'cut-x', a: [0, D], b: [0, 0], n: [1, 0] },
  { key: 'cut-y', a: [0, 0], b: [W, 0], n: [0, 1] },
  { key: 'outer-x', a: [W, 0], b: [W, -D], n: [1, 0] },
]

const along = (f: Face, t: number): Plane => [f.a[0] + (f.b[0] - f.a[0]) * t, f.a[1] + (f.b[1] - f.a[1]) * t]
const SAMPLES = 28

/** Screen polygon of stratum i on a face, between its two (uneven) boundaries. */
function band(f: Face, i: number, from = 0, to = 1) {
  const top: Flat[] = []
  const bottom: Flat[] = []
  for (let s = 0; s <= SAMPLES; s++) {
    const t = from + ((to - from) * s) / SAMPLES
    const [x, y] = along(f, t)
    top.push(at([x, y, -boundary(i, x, y)]))
    bottom.push(at([x, y, -boundary(i + 1, x, y)]))
  }
  return k.pathOf([...top, ...bottom.reverse()], true)
}

function boundaryLine(f: Face, i: number) {
  const pts: Flat[] = []
  for (let s = 0; s <= SAMPLES; s++) {
    const [x, y] = along(f, s / SAMPLES)
    pts.push(at([x, y, -boundary(i, x, y)]))
  }
  return k.pathOf(pts)
}

const faceRect = (f: Face, z0: number, z1: number) =>
  k.pathOf([at([f.a[0], f.a[1], z1]), at([f.b[0], f.b[1], z1]), at([f.b[0], f.b[1], z0]), at([f.a[0], f.a[1], z0])], true)

/** How dark a face turns, from the kit's own light (extrude's rule). */
function shadeOf(n: Plane) {
  const { sinA, cosA } = k.cameraOf(P)
  const lit = (n[0] * -sinA + n[1] * cosA + 1) / 2
  return Math.round((1 - lit) * 0.1 * 1000) / 1000
}

/** A small closed pebble in the face plane: centre at (t, depth), radii in mm. */
function pebble(f: Face, t: number, depth: number, a: number, b: number, tilt: number) {
  const len = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const ux = (f.b[0] - f.a[0]) / len
  const uy = (f.b[1] - f.a[1]) / len
  const [cx, cy] = along(f, t)
  const pts: Flat[] = []
  for (let s = 0; s < 14; s++) {
    const q = (s / 14) * Math.PI * 2
    const h = a * Math.cos(q) * Math.cos(tilt) - b * Math.sin(q) * Math.sin(tilt)
    const v = a * Math.cos(q) * Math.sin(tilt) + b * Math.sin(q) * Math.cos(tilt)
    pts.push(at([cx + ux * h, cy + uy * h, -depth + v]))
  }
  return k.pathOf(pts, true)
}

export type FaceArt = {
  key: string
  bands: { i: number; d: string }[]
  shade: { d: string; alpha: number }
  lines: { i: number; d: string }[]
  sand: Flat[]
  bubbles: string[]
  pebbles: { i: number; d: string }[]
  edge: string
}

/** The bore: a half-round channel down the inner corner of the cut, drawn as a recess on both cut faces. */
const BORE_FLOOR = 82

export const FACE_ART: FaceArt[] = FACES.map((f, fi) => {
  const r = rng(17 + fi * 101)
  const len = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
  const bands = STRATA.map((_, i) => ({ i, d: band(f, i) }))
  const lines = BOUNDS.slice(1, -1).map((_, j) => ({ i: j + 1, d: boundaryLine(f, j + 1) }))
  const sand: Flat[] = []
  const bubbles: string[] = []
  const pebbles: { i: number; d: string }[] = []
  const placed: { h: number; v: number; a: number }[] = []
  // keep texture off the bore channel on the cut faces
  const clearOf = (t: number) => {
    const [x, y] = along(f, t)
    return Math.hypot(x, y) > BORE_R + 3
  }
  STRATA.forEach((s, i) => {
    const area = len * (BOUNDS[i + 1]! - BOUNDS[i]!)
    if (s.kind === 'surface') {
      const n = Math.round(len / 7)
      for (let q = 0; q < n; q++) {
        const t = (q + 0.2 + r() * 0.6) / n
        if (!clearOf(t)) continue
        const [x, y] = along(f, t)
        const top = boundary(0, x, y)
        const bot = boundary(1, x, y)
        const rad = 0.8 + r() * 0.6
        bubbles.push(pebble(f, t, top + rad + 0.6 + r() * Math.max(0, bot - top - 2 * rad - 1.2), rad, rad, 0))
      }
    } else if (s.kind === 'real') {
      const n = Math.round(area / (i === 1 ? 26 : i === 2 ? 20 : 16))
      for (let q = 0; q < n; q++) {
        const t = 0.03 + r() * 0.94
        if (!clearOf(t)) continue
        const [x, y] = along(f, t)
        const top = boundary(i, x, y) + 1
        const bot = boundary(i + 1, x, y) - 1
        sand.push(at([x, y, -(top + r() * (bot - top))]))
      }
    } else {
      const n = Math.round(area / (i === 4 ? 50 : i === 5 ? 40 : 32))
      for (let q = 0; q < n; q++) {
        const a = 1.1 + r() * (i === 6 ? 2.1 : 1.5)
        const b = a * (0.55 + r() * 0.3)
        const margin = (a + 0.8) / len
        const t = margin + r() * (1 - 2 * margin)
        if (!clearOf(t)) continue
        const [x, y] = along(f, t)
        const top = boundary(i, x, y) + b + 1
        const bot = boundary(i + 1, x, y) - b - 1
        if (bot <= top) continue
        const v = top + r() * (bot - top)
        const h = t * len
        if (placed.some((q) => Math.hypot(q.h - h, q.v - v) < q.a + a + 0.9)) continue
        placed.push({ h, v, a })
        pebbles.push({ i, d: pebble(f, t, v, a, b, (r() - 0.5) * 0.9) })
      }
    }
  })
  return {
    key: f.key,
    bands,
    shade: { d: faceRect(f, FLOOR, 0), alpha: shadeOf(f.n) },
    lines,
    sand,
    bubbles,
    pebbles,
    edge: faceRect(f, FLOOR, 0),
  }
})

/** Recess of the bore on the two cut faces, and its far wall. */
export const BORE = {
  x: k.pathOf([at([0, 0, 0]), at([0, BORE_R, 0]), at([0, BORE_R, -BORE_FLOOR]), at([0, 0, -BORE_FLOOR])], true),
  y: k.pathOf([at([0, 0, 0]), at([BORE_R, 0, 0]), at([BORE_R, 0, -BORE_FLOOR]), at([0, 0, -BORE_FLOOR])], true),
  /** The channel's back wall: the quarter round at the bottom of the recess, seen as one edge. */
  floor: k.pathOf([at([0, BORE_R, -BORE_FLOOR]), at([0, 0, -BORE_FLOOR]), at([BORE_R, 0, -BORE_FLOOR])]),
  lips: k.pathOf([at([0, BORE_R, 0]), at([0, BORE_R, -BORE_FLOOR])]) + k.pathOf([at([BORE_R, 0, 0]), at([BORE_R, 0, -BORE_FLOOR])]),
}

/** Top of the sample: an L (the near quadrant is cut away). */
const TOP_RING: Plane[] = [
  [-W, -D],
  [W, -D],
  [W, 0],
  [0, 0],
  [0, D],
  [-W, D],
]
export const TOP = {
  fill: k.onTop(TOP_RING, 0, P, true),
  /** Foam on the surface: the wash is all anyone sees. */
  foam: (() => {
    const r = rng(5)
    const out: string[] = []
    const spots: Plane[] = [
      [-46, 34],
      [-30, 38],
      [-12, 30],
      [-48, -36],
      [20, -34],
      [40, -26],
      [46, -10],
      [-6, -38],
      [30, -12],
    ]
    for (const [x, y] of spots) {
      const n = 2 + Math.floor(r() * 3)
      for (let q = 0; q < n; q++) {
        const rad = 0.9 + r() * 1.5
        out.push(k.ring(x + (r() - 0.5) * 7, y + (r() - 0.5) * 6, rad, 0, P, 14))
      }
    }
    return out.join('')
  })(),
}

/** Outline of the sample block: the silhouette and every visible corner. */
export const BLOCK_EDGE = [
  k.onTop(TOP_RING, 0, P, true),
  k.rise([-W, D], FLOOR, 0, P),
  k.rise([0, D], FLOOR, 0, P),
  k.rise([0, 0], FLOOR, 0, P),
  k.rise([W, 0], FLOOR, 0, P),
  k.rise([W, -D], FLOOR, 0, P),
  k.pathOf([at([-W, D, FLOOR]), at([0, D, FLOOR]), at([0, 0, FLOOR]), at([W, 0, FLOOR]), at([W, -D, FLOOR])]),
].join('')

// ---------- case: tray, posts, rims, glass ----------
export type Part = { paths: SolidPaths; tone?: 'hi' | 'mid' | 'lo' | 'faint'; crease?: 'hi' | 'mid' | 'lo' | 'faint' | 'none'; lit?: boolean }
const S = (paths: SolidPaths, tone: Part['tone'] = 'mid', crease: Part['crease'] = 'faint'): Part => ({ paths, tone, crease })

export const TRAY_ART = {
  halo: k.haloOf(TRAY, FLOOR - TRAY_H - FOOT_H, TRAY_H, P),
  feet: byDepth(k.corners(TRAY, 14)).flatMap(([x, y]) => [
    S(k.cylinder(x, y, 5.6, FLOOR - TRAY_H - FOOT_H, 1.4, P, 24), 'lo'),
    S(k.cylinder(x, y, 4.2, FLOOR - TRAY_H - FOOT_H + 1.4, FOOT_H - 1.4, P, 24), 'mid'),
  ]),
  tray: S(k.slabOf(TRAY, FLOOR - TRAY_H, TRAY_H, P, 8, 1.2), 'mid'),
  groove: k.planOutline(k.insetPlan(TRAY, 3), FLOOR, P),
  screws: k.corners(TRAY, 7).map(([x, y]) => at([x, y, FLOOR])),
  screwRings: k.corners(TRAY, 7)
    .map(([x, y]) => k.ring(x, y, 1.6, FLOOR, P, 14))
    .join(''),
  /** Label plate on the floor of the cut, with three rule lines that stand for print. */
  label: (() => {
    const plan: Plan = { x: 22, y: 24, w: 22, d: 12, r: 1 }
    const z = FLOOR
    return {
      plate: S(k.slabOf(plan, z, 0.8, P, 3), 'lo', 'none'),
      inset: k.planOutline(k.insetPlan(plan, 1.4), z + 0.8, P, 3),
      rules: [
        k.lineOnTop([plan.x + 3.5, plan.y + 4], [plan.x + 17, plan.y + 4], z + 0.8, P),
        k.lineOnTop([plan.x + 3.5, plan.y + 6.5], [plan.x + 13, plan.y + 6.5], z + 0.8, P),
        k.lineOnTop([plan.x + 3.5, plan.y + 9], [plan.x + 15, plan.y + 9], z + 0.8, P),
      ],
      screws: [at([plan.x + 1.8, plan.y + 1.8, z + 0.8]), at([plan.x + plan.w - 1.8, plan.y + plan.d - 1.8, z + 0.8])],
    }
  })(),
}

const POST = 3.6
const postAt = ([x, y]: Plane, top = 2.4) => S(k.slabOf({ x: x - POST / 2, y: y - POST / 2, w: POST, d: POST, r: 0.6 }, FLOOR, -FLOOR + top, P, 2, 0.3), 'mid')

/** Rim bars on the top edges; the far ones are drawn before the rig, the near ones with the posts. */
const RIM_H = 2.4
const rim = (plan: Plan) => S(k.slabOf(plan, 0, RIM_H, P, 2, 0.3), 'mid')
export const FAR_RIMS = [
  rim({ x: -W - POST / 2, y: -D - POST / 2, w: 2 * W + POST, d: POST, r: 0.6 }),
  rim({ x: -W - POST / 2, y: -D - POST / 2, w: POST, d: 2 * D + POST, r: 0.6 }),
]
export const FAR_RIM_SCREWS = [
  ...[-40, -20, 0, 20, 40].map((x) => at([x, -D, RIM_H])),
  ...[-30, -10, 10, 30].map((y) => at([-W, y, RIM_H])),
]
export const NEAR = [
  rim({ x: -W - POST / 2, y: D - POST / 2, w: W + POST, d: POST, r: 0.6 }),
  rim({ x: W - POST / 2, y: -D - POST / 2, w: POST, d: D + POST, r: 0.6 }),
  postAt([-W, D]),
  postAt([W, -D]),
  postAt([0, D]),
  postAt([W, 0]),
]
export const NEAR_SCREWS = [
  ...[-40, -20].map((x) => at([x, D, RIM_H])),
  ...[-30, -12].map((y) => at([W, y, RIM_H])),
  ...([[-W, D], [W, -D], [0, D], [W, 0]] as Plane[]).map(([x, y]) => at([x, y, RIM_H])),
]

/** Glass panes on the two outer faces, standing 1.4 off the sample, between the posts. */
function pane(a: Plane, b: Plane, n: Plane) {
  const off = 1.4
  const A: Plane = [a[0] + n[0] * off, a[1] + n[1] * off]
  const B: Plane = [b[0] + n[0] * off, b[1] + n[1] * off]
  const p = (t: number, z: number) => at([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z])
  return {
    outline: k.pathOf([p(0.04, 0), p(0.96, 0), p(0.96, FLOOR), p(0.04, FLOOR)], true),
    glare: [k.pathOf([p(0.14, FLOOR), p(0.3, 0)]), k.pathOf([p(0.19, FLOOR), p(0.35, 0)])],
  }
}
export const PANES = [pane([-W, D], [0, D], [0, 1]), pane([W, 0], [W, -D], [1, 0])]

// ---------- the rig ----------
const runner = (y: number) => S(k.slabOf({ x: SKID.x - 2, y, w: SKID.w + 4, d: 5, r: 1.6 }, 0, RUNNER_H, P, 3, 0.3), 'mid')
export const RIG = {
  halo: k.haloOf(k.insetPlan(SKID, 2), 0, 0.1, P),
  runners: [runner(SKID.y + 2), runner(SKID.y + SKID.d - 7)],
  skid: S(k.slabOf(SKID, RUNNER_H, 3, P, 4, 0.6), 'mid'),
  skidGroove: k.planOutline(k.insetPlan(SKID, 3), SKID_TOP, P, 4),
  skidScrews: k.corners(SKID, 5).map(([x, y]) => at([x, y, SKID_TOP])),
  /** Mast foot flange, four bolts, two gussets. */
  flange: S(k.slabOf({ x: MAST.x - 5, y: MAST.y - 5, w: MAST.w + 10, d: MAST.d + 10, r: 2 }, SKID_TOP, 3, P, 4, 0.5), 'mid'),
  flangeBolts: k.corners({ x: MAST.x - 5, y: MAST.y - 5, w: MAST.w + 10, d: MAST.d + 10, r: 2 }, 2.4).map(([x, y]) => at([x, y, MAST_FOOT])),
  /** Gussets on the two back sides, clear of the carriage's travel. */
  gussets: [
    S(k.slabOf({ x: MAST.x - 4.4, y: -1, w: 4.4, d: 2, r: 0.3 }, MAST_FOOT, 9, P, 2), 'mid'),
    S(k.slabOf({ x: MAST.x + 4, y: MAST.y - 4.4, w: 2, d: 4.4, r: 0.3 }, MAST_FOOT, 9, P, 2), 'mid'),
  ],
  mast: S(k.slabOf(MAST, MAST_FOOT, MAST_TOP - MAST_FOOT, P, 3, 0.6), 'mid'),
  mastSeams: k.sideSeam(MAST, 40, P, 3) + k.sideSeam(MAST, 84, P, 3),
  cap: S(k.slabOf(k.insetPlan(MAST, -1.4), MAST_TOP, 3, P, 3, 0.5), 'mid'),
  capScrews: k.corners(k.insetPlan(MAST, -1.4), 2).map(([x, y]) => at([x, y, MAST_TOP + 3])),
  /** Rack on the mast's front face: teeth wrap the strip and end on its silhouette. */
  rack: S(k.slabOf({ x: MAST.x + MAST.w, y: -2.5, w: 1.2, d: 5, r: 0.3 }, MAST_FOOT + 3, MAST_TOP - MAST_FOOT - 6, P, 2), 'mid', 'faint'),
  rackTeeth: (() => {
    const out: string[] = []
    for (let z = MAST_FOOT + 5; z < MAST_TOP - 4; z += 2.6) out.push(k.sideSeam({ x: MAST.x + MAST.w, y: -2.5, w: 1.2, d: 5, r: 0.3 }, z, P, 2))
    return out.join('')
  })(),
  /** Depth ruler on the mast's side face, read by the carriage's index tab. */
  ruler: S(k.slabOf({ x: MAST.x + 1.5, y: MAST.y + MAST.d, w: 7, d: 0.8, r: 0.2 }, ZERO_Z - 86, 86 + 6, P, 2), 'lo', 'none'),
  ticks: (() => {
    const y = MAST.y + MAST.d + 0.8
    const x0 = MAST.x + 1.5
    const minor: string[] = []
    const major: string[] = []
    let zero = ''
    for (let d = 0; d <= 84; d += 4) {
      const z = ZERO_Z - d
      const big = d % 20 === 0
      const seg = k.segment([x0, y, z], [x0 + (big ? 3.8 : 2.2), y, z], P)
      if (d === 0) zero = seg
      else (big ? major : minor).push(seg)
    }
    return { minor: minor.join(''), major: major.join(''), zero }
  })(),
}

/** The moving head, built with the bit at TIP0 and moved straight down by the live code. */
export const HEAD = {
  carriage: S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_H, P, 3, 0.5), 'mid'),
  carriageSeam: k.sideSeam(CARRIAGE, CARRIAGE_Z + CARRIAGE_H / 2, P, 3),
  carriageScrews: [
    at([CARRIAGE.x + CARRIAGE.w, -5, CARRIAGE_Z + 4]),
    at([CARRIAGE.x + CARRIAGE.w, 5, CARRIAGE_Z + 4]),
    at([CARRIAGE.x + CARRIAGE.w, -5, CARRIAGE_Z + CARRIAGE_H - 4]),
    at([CARRIAGE.x + CARRIAGE.w, 5, CARRIAGE_Z + CARRIAGE_H - 4]),
  ],
  /** Lock knob on the carriage's side. */
  lockNeck: S(k.slabOf({ x: CARRIAGE.x + 2.6, y: CARRIAGE.y + CARRIAGE.d, w: 2.8, d: 2.4, r: 0.6 }, CARRIAGE_Z + 14.6, 2.8, P, 2), 'mid', 'none'),
  index: S(k.slabOf({ x: MAST.x + 1, y: MAST.y + MAST.d + 0.8, w: CARRIAGE.x - MAST.x - 1, d: 1.6, r: 0.3 }, TAB_Z - 1.2, 2.4, P, 2), 'mid'),
  indexMark: k.segment([MAST.x + 1, MAST.y + MAST.d + 2.4, TAB_Z], [CARRIAGE.x, MAST.y + MAST.d + 2.4, TAB_Z], P),
  arm: S(k.slabOf({ x: CARRIAGE.x + CARRIAGE.w, y: -3.2, w: -HOUSING_R + 1 - (CARRIAGE.x + CARRIAGE.w), d: 6.4, r: 1 }, HOUSING_Z + 4, 9, P, 3, 0.4), 'mid'),
  armScrews: [at([CARRIAGE.x + CARRIAGE.w + 2.4, 0, HOUSING_Z + 13]), at([-HOUSING_R - 1.4, 0, HOUSING_Z + 13])],
  housing: S(k.cylinder(0, 0, HOUSING_R, HOUSING_Z, HOUSING_H, P, 48, 0.6), 'hi', 'lo'),
  housingSeams: k.sideArc(0, 0, HOUSING_R, HOUSING_Z + 4, P, 32) + k.sideArc(0, 0, HOUSING_R, HOUSING_Z + HOUSING_H - 5, P, 32),
  fins: k.knurl(0, 0, HOUSING_R, HOUSING_Z + 4, HOUSING_Z + HOUSING_H - 5, 22, P, 0.6),
  capRing: k.ring(0, 0, HOUSING_R - 2, HOUSING_Z + HOUSING_H, P, 40),
  knob: S(k.cylinder(0, 0, 3.4, HOUSING_Z + HOUSING_H, 3.4, P, 28, 0.3), 'mid'),
  knobKnurl: k.knurl(0, 0, 3.4, HOUSING_Z + HOUSING_H, HOUSING_Z + HOUSING_H + 3.4, 24, P, 0.3),
  knobMark: k.lineOnTop([0, 0], [2.6, 0], HOUSING_Z + HOUSING_H + 3.4, P),
  chuck: S(k.cylinder(0, 0, 4.6, CHUCK_Z, 6, P, 32, 0.4), 'mid'),
  chuckJaws: k.knurl(0, 0, 4.6, CHUCK_Z, CHUCK_Z + 6, 12, P, 0.5),
  chuckKey: [at([0, 4.6, CHUCK_Z + 3])],
  rod: { paths: k.cylinder(0, 0, ROD_R, TIP0 + BIT_H, ROD_L - BIT_H, P, 20), tone: 'hi', crease: 'none', lit: true } as Part,
  rodJoints: [TIP0 + BIT_H + 28, TIP0 + BIT_H + 58].map((z) => k.sideArc(0, 0, ROD_R, z, P, 12)).join(''),
  bit: { paths: k.cylinder(0, 0, BIT_R, TIP0, BIT_H, P, 28, 0.3), tone: 'hi', crease: 'lo', lit: true } as Part,
  bitTeeth: k.knurl(0, 0, BIT_R, TIP0, TIP0 + 2.2, 10, P, 0.4),
  bitSeam: k.sideArc(0, 0, BIT_R, TIP0 + 2.2, P, 20),
}

/** Screen y of the bore mouth and floor, to map pointer height onto depth. */
export const BORE_SCREEN = { top: at([0, 0, 0])[1], floor: at([0, 0, -BOUNDS[BOUNDS.length - 1]!])[1] }

// ---------- core box beside the case: the core the drill brought up, in its strata ----------
const BOX: Plan = { x: W + 12, y: -30, w: 30, d: 60, r: 1.4 }
const BOX_FLOOR_H = 1.4
const WALL = 2
const WALL_H = 6.4
const CORE_R = 3.4
const ROW_X = [BOX.x + 9, BOX.x + 21]
const ROW_START = BOX.y + WALL + 1.6
const BZ = FLOOR
const wall = (plan: Plan) => S(k.slabOf(plan, BZ + BOX_FLOOR_H, WALL_H - BOX_FLOOR_H, P, 2, 0.3), 'mid')

/** Row 1 holds the surface down to the first fear, row 2 the fears. Lengths are the true thicknesses at the bore. */
const ROWS = [
  [0, 1, 2, 3],
  [4, 5, 6],
]
export const CORE = {
  halo: k.haloOf(BOX, BZ, 0.1, P),
  floor: S(k.slabOf(BOX, BZ, BOX_FLOOR_H, P, 3, 0.4), 'mid'),
  back: [wall({ x: BOX.x, y: BOX.y, w: BOX.w, d: WALL, r: 0.5 }), wall({ x: BOX.x, y: BOX.y, w: WALL, d: BOX.d, r: 0.5 })],
  /** Saddles under each core row (small blocks), so the core rests on something. */
  rows: ROWS.map((row, ri) => {
    const x = ROW_X[ri]!
    const zc = BZ + BOX_FLOOR_H + CORE_R + 0.6
    let y = ROW_START
    const segs = row.map((i) => {
      const len = AT_BORE[i + 1]! - AT_BORE[i]!
      const F = G.frameAlong([x, y, zc], [0, 1, 0])
      const seg = { i, paths: G.disc(0, len - 0.3, CORE_R, F, P) as SolidPaths }
      y += len
      return seg
    })
    const saddles = [ROW_START + 6, y - 6].map((yy) => S(k.slabOf({ x: x - 2.8, y: yy - 1.2, w: 5.6, d: 2.4, r: 0.4 }, BZ + BOX_FLOOR_H, 1.6, P, 2), 'lo', 'none'))
    return { segs, saddles }
  }),
  divider: wall({ x: BOX.x + 15 - 0.7, y: BOX.y + WALL, w: 1.4, d: BOX.d - 2 * WALL, r: 0.3 }),
  front: [wall({ x: BOX.x, y: BOX.y + BOX.d - WALL, w: BOX.w, d: WALL, r: 0.5 }), wall({ x: BOX.x + BOX.w - WALL, y: BOX.y, w: WALL, d: BOX.d, r: 0.5 })],
  screws: [at([BOX.x + BOX.w - 1, BOX.y + 4, BZ + WALL_H]), at([BOX.x + BOX.w - 1, BOX.y + BOX.d - 4, BZ + WALL_H]), at([BOX.x + 4, BOX.y + BOX.d - 1, BZ + WALL_H]), at([BOX.x + BOX.w - 4, BOX.y + BOX.d - 1, BZ + WALL_H])],
}
