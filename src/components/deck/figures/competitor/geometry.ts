// Fig 03 · The True Competitor: an equal-arm beam balance on a base plate.
// World units are about 1 px, x along the beam, y toward the front, z up.
// Static parts are built once as SVG strings; the beam and pointer are rebuilt per frame from the angle.

import * as k from '#/components/iso/iso-kit'
import * as G from '#/components/iso/lathe.mjs'
import * as T from '#/components/iso/tube.mjs'
import type { Flat, Plan, Plane, Point3, SolidPaths } from '#/components/iso/iso-kit'
import { STOP } from './model'

export const W = 600
export const H = 500
const AZIMUTH = 112

// Base
const PLATE: Plan = { x: -152, y: -46, w: 304, d: 92, r: 9 }
const PLATE_H = 12
const FOOT_H = 5

// Beam: pivot on the agate plate of the column head, knife edges at both ends.
export const PIVOT: Point3 = [0, 0, 163]
export const ARM = 108
const BEAM_END = ARM + 3
const BEAM_Y = 2.5
const topAt = (s: number) => 15 - 4.5 * Math.min(1, Math.abs(s) / BEAM_END)
const botAt = (s: number) => 1 + 4.5 * Math.min(1, Math.abs(s) / BEAM_END)
const KNIFE_BASE = topAt(ARM + 3)
const KNIFE_TIP = topAt(ARM) + 5.5

// Hanging parts at rest (beam level)
const TIP_Z = PIVOT[2] + KNIFE_TIP
const CROSS_Z = 158.5
const CROSS_H = 3.5
export const PAN_Z = 80
const PAN_R = 30
const PAN_T = 2.5
const BOSS_H = 3
const ROD_Y = PAN_R + 2
const BLOCK_H = 4

// Scale plate in front of the column, read by the pointer
const SCALE_Y = 7.6
const SCALE_T = 1.6
const SCALE_IN = 52
const SCALE_OUT = 66
const SCALE_SPAN = 16
const POINTER_Y = SCALE_Y + SCALE_T + 0.8
const POINTER_LEN = 64

/** Beam-local point (s along the beam, h up from the pivot) to world, at angle th (positive: right end down). */
export function onBeam(s: number, h: number, y: number, th: number): Point3 {
  const c = Math.cos(th)
  const n = Math.sin(th)
  return [PIVOT[0] + s * c + h * n, y, PIVOT[2] - s * n + h * c]
}

/** Where the stirrup of one side (−1 left, 1 right) moved to, relative to the level beam. */
export function stirrupShift(side: -1 | 1, th: number): Point3 {
  const now = onBeam(side * ARM, KNIFE_TIP, 0, th)
  const rest = onBeam(side * ARM, KNIFE_TIP, 0, 0)
  return [now[0] - rest[0], 0, now[2] - rest[2]]
}

// Pan rests: the heavy pan lands here when the beam reaches its stop.
const restOf = (side: -1 | 1): Point3 => {
  const shift = stirrupShift(side, side * STOP)
  return [side * ARM + shift[0], 0, PAN_Z - PAN_T - BOSS_H + shift[2]]
}

const HANDLE_TOP = PAN_Z + 27 + 25

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [-ARM - 6, -8, TIP_Z + BLOCK_H + 16],
    [ARM + 6, 8, TIP_Z + BLOCK_H + 16],
    [-ARM, 36, CROSS_Z - 16],
    [ARM, 36, CROSS_Z - 16],
    [-ARM - 26, 0, HANDLE_TOP],
  ],
  W,
  H,
  { pad: 40, azimuth: AZIMUTH },
)

const at = (p: Point3) => k.iso(p, P)
const S = (paths: SolidPaths, style: Parameters<typeof k.solidSvg>[1] = {}) => k.solidSvg(paths, style)
const Ln = (d: string, style: Parameters<typeof k.lineSvg>[1] = {}) => k.lineSvg(d, style)
const D = (points: Array<Flat | [number, number, number]>, style: Parameters<typeof k.dotsSvg>[1] = {}) => k.dotsSvg(points, style)
const byDepth = <T extends Plane>(points: T[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))
const up = (o: Point3) => G.frameAlong(o, [0, 0, 1])
const path = (points: Point3[], closed = false) => k.pathOf(points.map(at), closed)

// ——— Base, column, rests, tray ———

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`]
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7.5, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }))
    out.push(S(k.cylinder(x, y, 5.6, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }))
    out.push(Ln(k.knurl(x, y, 5.6, -PLATE_H - FOOT_H + 1.6, -PLATE_H, 26, P), { tone: 'lo' }))
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: Ln(k.sideSeam(PLATE, -PLATE_H + 4, P, 8), { tone: 'faint' }) }))
  out.push(Ln(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }))
  const screws = k.corners(PLATE, 11)
  out.push(Ln(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }))
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }))

  // Label plate, front left
  const label: Plan = { x: -140, y: 25, w: 44, d: 13, r: 1.5 }
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }))
  out.push(Ln(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: 'faint' }))
  out.push(
    ...[
      [label.x + 6, label.x + 34, label.y + 4.4],
      [label.x + 6, label.x + 26, label.y + 6.8],
      [label.x + 6, label.x + 30, label.y + 9.2],
    ].map(([a, b, y]) => Ln(k.lineOnTop([a!, y!], [b!, y!], 0.8, P), { tone: 'lo', free: true })),
  )
  out.push(D([at([label.x + 3, label.y + 6.5, 0.8]), at([label.x + label.w - 3, label.y + 6.5, 0.8])], { size: 0.45 }))

  // Bull's-eye level, front right
  const [lx, ly] = [128, 29]
  out.push(S(k.cylinder(lx, ly, 6.2, 0, 2.8, P, 40, 0.4), { tone: 'mid' }))
  out.push(Ln(k.ring(lx, ly, 4.6, 2.8, P, 40), { tone: 'lo' }))
  out.push(Ln(k.ring(lx, ly, 2.1, 2.8, P, 24), { tone: 'faint' }))
  out.push(Ln(k.ring(lx + 0.4, ly - 0.3, 1.3, 2.8, P, 20), { tone: 'hi' }))
  return out.join('')
}

function rest(side: -1 | 1) {
  const [x, y, top] = restOf(side)
  const out = []
  out.push(S(k.cylinder(x, y, 9, 0, 2, P, 32, 0.4), { tone: 'lo' }))
  out.push(S(k.cylinder(x, y, 3.4, 2, top - 4.5, P, 20), { tone: 'mid', crease: 'none', inner: Ln(k.sideArc(x, y, 3.4, top * 0.5, P, 12), { tone: 'faint' }) }))
  out.push(S(k.cylinder(x, y, 5, top - 2.5 - 2, 2, P, 24), { tone: 'mid' }))
  out.push(S(k.cylinder(x, y, 7, top - 2.5, 2.5, P, 32, 0.3), { tone: 'lo', crease: 'lo' }))
  return out.join('')
}

function column() {
  const out = []
  out.push(S(k.cylinder(0, 0, 15, 0, 3, P, 48, 0.5), { tone: 'lo' }))
  out.push(D(Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + 0.3).filter((a) => Math.cos(a - (AZIMUTH * Math.PI) / 180) > -0.2).map((a) => at([12.4 * Math.cos(a), 12.4 * Math.sin(a), 3])), { size: 0.45 }))
  out.push(S(k.cylinder(0, 0, 9.5, 3, 6, P, 40, 0.4), { tone: 'mid' }))
  out.push(S(k.cylinder(0, 0, 5.6, 9, 150 - 9, P, 32), { tone: 'mid', crease: 'none', inner: Ln([40, 146].map((z) => k.sideArc(0, 0, 5.6, z, P, 16)).join(''), { tone: 'faint' }) }))
  // Clamp ring that holds the scale plate (behind the plate)
  out.push(S(k.cylinder(0, 0, SCALE_Y, 99, 8, P, 32), { tone: 'mid' }))
  // Column head and agate bearing
  const head: Plan = { x: -11, y: -7, w: 22, d: 14, r: 2 }
  out.push(S(k.slabOf(head, 150, 9.5, P, 4, 0.5), { tone: 'mid' }))
  out.push(D([at([-7.5, 4, 159.5]), at([7.5, 4, 159.5]), at([-7.5, -4, 159.5]), at([7.5, -4, 159.5])], { size: 0.45 }))
  out.push(S(k.slabOf({ x: -6, y: -5, w: 12, d: 10, r: 1 }, 159.5, 2, P, 3, 0.3), { tone: 'mid' }))
  return out.join('')
}

function scale() {
  const out = []
  const F = G.frameOf([0, SCALE_Y, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1])
  const rad = (deg: number) => (deg * Math.PI) / 180
  const xz = (R: number, deg: number): [number, number] => [R * Math.sin(rad(deg)), PIVOT[2] - R * Math.cos(rad(deg))]
  const poly: Array<[number, number]> = [xz(SCALE_IN, -SCALE_SPAN), xz(SCALE_IN, SCALE_SPAN)]
  for (let d = SCALE_SPAN; d >= -SCALE_SPAN; d -= 2) poly.push(xz(SCALE_OUT, d))
  out.push(S(G.prismOf(F, poly, 0, SCALE_T, P), { tone: 'mid' }))
  const face = SCALE_Y + SCALE_T
  const tick = (deg: number, len: number) => {
    const [x0, z0] = xz(SCALE_OUT, deg)
    const [x1, z1] = xz(SCALE_OUT - len, deg)
    return k.segment([x0, face, z0], [x1, face, z1], P)
  }
  const minor: string[] = []
  const major: string[] = []
  for (let i = -6; i <= 6; i++) (i % 5 === 0 ? major : minor).push(tick(i * 2, i % 5 === 0 ? 7 : 4.2))
  out.push(Ln(minor.join(''), { tone: 'lo' }), Ln(major.join(''), { tone: 'mid' }))
  out.push(Ln(tick(0, SCALE_OUT - SCALE_IN * Math.cos(rad(SCALE_SPAN))), { tone: 'hi' }))
  out.push(D([xz(55, -12), xz(55, 12)].map(([x, z]) => at([x, face, z])), { size: 0.5 }))
  return out.join('')
}

function tray() {
  const out = []
  const plan: Plan = { x: -38, y: 17, w: 76, d: 22, r: 3 }
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 2), 0, 0.1, P)}" style="filter:blur(4px)"/>`)
  out.push(S(k.slabOf(plan, 0, 5.5, P, 4, 0.6), { tone: 'mid' }))
  const weights: Array<[number, number, number]> = [
    [-27, 5, 9],
    [-14, 4.3, 7.8],
    [-2, 3.7, 6.8],
    [9, 3.1, 5.8],
    [19, 2.6, 5],
  ]
  const wy = 28
  out.push(Ln(weights.map(([x, r]) => k.ring(x, wy, r + 1, 5.5, P, 28)).join(''), { tone: 'lo' }))
  out.push(Ln(k.ring(29.5, wy, 2.6, 5.5, P, 20), { tone: 'lo' }))
  out.push(D([at([plan.x + 4, plan.y + 4, 5.5]), at([plan.x + plan.w - 4, plan.y + plan.d - 4, 5.5])], { size: 0.45 }))
  for (const [x, r, h] of [...weights].sort((a, b) => k.depthOf([a[0], wy, 0], P) - k.depthOf([b[0], wy, 0], P))) {
    out.push(S(k.cylinder(x, wy, r, 5.5, h, P, 28, 0.3), { tone: 'hi', crease: 'lo' }))
    out.push(S(k.cylinder(x, wy, r * 0.28, 5.5 + h, 1.4, P, 12), { tone: 'mid' }))
    out.push(S(G.sphereOf([x, wy, 5.5 + h + 1.4 + r * 0.38], r * 0.4, P), { tone: 'hi' }))
  }
  return out.join('')
}

// ——— Hanging parts (built at the level pose, moved as a group) ———

function pan(side: -1 | 1) {
  const x = side * ARM
  const F = up([x, 0, PAN_Z - PAN_T])
  const out = []
  out.push(S(G.disc(-BOSS_H, 0, 8.6, F, P), { tone: 'mid' }))
  out.push(S(G.solidOf([[0, 23], [1.4, 27.6, 1], [PAN_T, PAN_R]], F, P), { tone: 'mid', inner: Ln(G.circleOf(F, PAN_T, PAN_R - 3.2, P), { tone: 'faint' }) }))
  for (const y of [-ROD_Y, ROD_Y]) {
    const lug: Plan = { x: x - 2.6, y: y - 3, w: 5.2, d: 6, r: 1.2 }
    out.push(S(k.slabOf(lug, PAN_Z - PAN_T, PAN_T, P, 3, 0.3), { tone: 'mid' }))
  }
  return out.join('')
}

function rod(side: -1 | 1, y: number) {
  const x = side * ARM
  return S(k.cylinder(x, y, 1.15, PAN_Z, CROSS_Z - PAN_Z, P, 16), { tone: 'mid', crease: 'none' })
}

function crossbar(side: -1 | 1) {
  const x = side * ARM
  const out = []
  const bar: Plan = { x: x - 3, y: -ROD_Y - 4, w: 6, d: ROD_Y * 2 + 8, r: 1.5 }
  out.push(S(k.slabOf(bar, CROSS_Z, CROSS_H, P, 3, 0.4), { tone: 'mid' }))
  out.push(D([at([x, -ROD_Y, CROSS_Z + CROSS_H]), at([x, ROD_Y, CROSS_Z + CROSS_H])], { size: 0.45 }))
  return out.join('')
}

function plate(side: -1 | 1, front: boolean) {
  const x = side * ARM
  const y = front ? 5 : -6.5
  return S(k.slabOf({ x: x - 4.5, y, w: 9, d: 1.5, r: 0.4 }, CROSS_Z + CROSS_H, TIP_Z - CROSS_Z - CROSS_H, P, 2), { tone: 'mid' })
}

function bearing(side: -1 | 1) {
  const x = side * ARM
  const out = []
  out.push(S(k.slabOf({ x: x - 5, y: -6.5, w: 10, d: 13, r: 1.5 }, TIP_Z, BLOCK_H, P, 3, 0.4), { tone: 'mid' }))
  out.push(Ln(k.lineOnTop([x, -6.5], [x, 6.5], TIP_Z + BLOCK_H, P), { tone: 'faint' }))
  out.push(D([at([x - 2.6, -3.4, TIP_Z + BLOCK_H]), at([x + 2.6, 3.4, TIP_Z + BLOCK_H])], { size: 0.45 }))
  return out.join('')
}

/** Back of a side: pan, lugs, back rod. Front of a side: front rod, crossbar, back stirrup plate. */
export function sideBack(side: -1 | 1) {
  return pan(side) + rod(side, -ROD_Y)
}
export function sideFront(side: -1 | 1) {
  return rod(side, ROD_Y) + crossbar(side) + plate(side, false)
}
export function stirrupFront(side: -1 | 1) {
  return plate(side, true) + bearing(side)
}

// ——— Loads ———

/** The real competitor: a bucket of soapy water with a sponge, on the left pan. */
export function bucket(id: string) {
  const cx = -ARM
  const F = up([cx, 0, PAN_Z])
  const r0 = 19.3
  const r1 = 23
  const top = 33
  const rAt = (s: number) => r0 + ((r1 - r0) * (s - 1)) / 29
  const slope = (r1 - r0) / 29
  const out = []
  const seams = [7, 24].map((s) => G.arcOf(F, s, rAt(s), P, { slope, trim: 0 })).join('')
  out.push(
    S(G.solidOf([[0, 18.5], [1, r0], [30, r1]], F, P), {
      tone: 'hi',
      crease: 'lo',
      inner: Ln(seams, { tone: 'faint' }),
    }),
  )
  // Rolled rim bead
  out.push(S(G.disc(29.4, top, 24.4, F, P), { tone: 'hi', crease: 'lo' }))
  // Open top: dark inside, soapy water a little lower, a sponge floating in it.
  const inner = 23.1
  const voidPath = G.circleOf(F, top, inner, P)
  out.push(`<path d="${voidPath}" style="fill:var(--anatomy-shade-0)"/>`)
  out.push(`<clipPath id="${id}-void"><path d="${voidPath}"/></clipPath>`)
  const water = PAN_Z + 23
  const wr = rAt(23) - 0.8
  out.push(
    `<g clip-path="url(#${id}-void)"><path d="${G.circleOf(up([cx, 0, water]), 0, wr, P)}" style="fill:var(--anatomy-shade-3)"/>` +
      Ln(G.circleOf(up([cx, 0, water]), 0, wr, P), { tone: 'faint' }) +
      `</g>`,
  )
  // Foam on the water
  const foam: Array<[number, number, number]> = [
    [cx + 13, -6, 1.6],
    [cx + 15.5, -2.4, 1.1],
    [cx - 15, 3, 1.4],
    [cx - 12.5, 7, 1],
    [cx + 9, 9.5, 1.2],
  ]
  out.push(`<g clip-path="url(#${id}-void)">${Ln(foam.map(([x, y, r]) => k.ring(x, y, r, water, P, 14)).join(''), { tone: 'lo' })}</g>`)
  // Sponge, turned a little, clipped to what shows above the front rim.
  const rim = Array.from({ length: 96 }, (_, i) => at(G.pointOf(G.frameAlong([cx, 0, PAN_Z + top], [0, 0, 1]), 0, inner, (i / 96) * Math.PI * 2)))
  const left = rim.reduce((a, p) => (p[0] < a[0] ? p : a))
  const right = rim.reduce((a, p) => (p[0] > a[0] ? p : a))
  const chord = (x: number) => left[1] + ((right[1] - left[1]) * (x - left[0])) / (right[0] - left[0])
  const front = rim.filter((p) => p[1] > chord(p[0])).sort((a, b) => a[0] - b[0])
  const clip = k.pathOf([[left[0], -1000], left, ...front, right, [right[0], -1000]], true)
  out.push(`<clipPath id="${id}-rim"><path d="${clip}"/></clipPath>`)
  const turn = (24 * Math.PI) / 180
  const sponge = k.ringOf({ x: -10, y: -6.5, w: 20, d: 13, r: 3.5 }, 4).map(([x, y]): Plane => [cx + 1.5 + x * Math.cos(turn) - y * Math.sin(turn), -1 + x * Math.sin(turn) + y * Math.cos(turn)])
  const sz = water
  const sh = 15.5
  const pores = Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j): Point3 => {
    const x = -7 + i * 3.5 + (j % 2) * 1.6
    const y = -3.6 + j * 3.6
    return [cx + 1.5 + x * Math.cos(turn) - y * Math.sin(turn), -1 + x * Math.sin(turn) + y * Math.cos(turn), sz + sh]
  })).flat()
  out.push(
    `<g clip-path="url(#${id}-rim)">` +
      S(k.extrude(sponge, sz, sh, P, { bevel: 0.6 }), { tone: 'mid' }) +
      D(pores.map(at), { size: 0.75, tone: 'lo' }) +
      `</g>`,
  )
  // Bail handle: ears on the two limbs, the bail in the plane facing the viewer.
  const a = (AZIMUTH * Math.PI) / 180
  const across: Point3 = [-Math.sin(a), Math.cos(a), 0]
  const hz = PAN_Z + 27
  const rEar = rAt(27)
  for (const side of [-1, 1]) {
    const dir: Point3 = [across[0] * side, across[1] * side, 0]
    const o: Point3 = [cx + dir[0] * rEar, dir[1] * rEar, hz]
    out.push(S(G.disc(-0.6, 1.6, 2.6, G.frameAlong(o, dir), P), { tone: 'mid' }))
  }
  const R = rEar + 1.6
  const bail: Point3[] = Array.from({ length: 41 }, (_, i) => {
    const t = (i / 40) * Math.PI
    return [cx + across[0] * R * Math.cos(t), across[1] * R * Math.cos(t), hz + R * Math.sin(t) * 0.92]
  })
  const pieces = T.tubePieces(bail, 0.85, P, { caps: false })
  out.push(pieces.map((piece: unknown) => T.tubeSvg(piece, { tone: 'mid' })).join(''))
  // Grip on the bail
  const gripF = G.frameAlong([cx, 0, hz + R * 0.92], across)
  out.push(S(G.solidOf([[-7, 1.4], [-5.5, 2, 1], [5.5, 2, 1], [7, 1.4]], gripF, P), { tone: 'mid' }))
  return out.join('')
}

/** A wash token: the grey one is another car wash, the lit one is OSCAR. */
export function token(side: -1 | 1, lit: boolean) {
  const x = side * ARM
  const out = []
  const r = 11
  const h = 3.6
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - r, y: -r, w: r * 2, d: r * 2, r }, PAN_Z, 0.1, P)}" style="filter:blur(3px)"/>`)
  out.push(S(k.cylinder(x, 0, r, PAN_Z, h, P, 64, 0.5), { tone: 'hi', crease: 'lo', lit }))
  out.push(Ln(k.knurl(x, 0, r, PAN_Z + 0.5, PAN_Z + h - 0.5, 72, P, 0.3), { tone: lit ? 'faint' : 'lo' }))
  out.push(Ln(k.ring(x, 0, r - 2.4, PAN_Z + h, P, 48), { tone: lit ? 'lit' : 'lo' }))
  out.push(Ln(k.ring(x, 0, 2.8, PAN_Z + h, P, 24), { tone: lit ? 'lit' : 'lo' }))
  return out.join('')
}

// ——— The beam (rebuilt per frame) ———

export function beam(th: number) {
  const c = Math.cos(th)
  const n = Math.sin(th)
  const F = G.frameOf(PIVOT, [0, 1, 0], [c, 0, -n], [n, 0, c])
  const out = []
  const face = (pts: Array<[number, number]>, y: number, closed = false) => path(pts.map(([s, h]) => onBeam(s, h, y, th)), closed)

  // Centre knife edge on the agate
  out.push(S(G.prismOf(F, [[-4.5, 1], [4.5, 1], [0, -1.5]], -4, 4, P), { tone: 'mid' }))
  // Beam: deepest at the centre, tapering to the ends
  const hex: Array<[number, number]> = [[-BEAM_END, botAt(BEAM_END)], [0, 1], [BEAM_END, botAt(BEAM_END)], [BEAM_END, topAt(BEAM_END)], [0, 15], [-BEAM_END, topAt(BEAM_END)]]
  const slots = [32, 58, 84]
    .flatMap((s) => [-s, s])
    .map((s) => {
      const mid = (topAt(s) + botAt(s)) / 2
      const r = (topAt(s) - botAt(s)) * 0.2
      const half = 7
      const pts: Array<[number, number]> = []
      for (let i = 0; i <= 12; i++) {
        const t = -Math.PI / 2 + (i / 12) * Math.PI
        pts.push([s + half + r * Math.cos(t), mid + r * Math.sin(t)])
      }
      for (let i = 0; i <= 12; i++) {
        const t = Math.PI / 2 + (i / 12) * Math.PI
        pts.push([s - half + r * Math.cos(t), mid + r * Math.sin(t)])
      }
      return face(pts, BEAM_Y, true)
    })
    .join('')
  const notch: string[] = []
  const notchMajor: string[] = []
  for (let i = 0; i <= 12; i++) {
    for (const sign of [-1, 1]) {
      const s = sign * (14 + i * 7)
      const len = i % 4 === 0 ? 2.6 : 1.5
      ;(i % 4 === 0 ? notchMajor : notch).push(face([[s, topAt(s)], [s, topAt(s) - len]], BEAM_Y))
    }
  }
  out.push(
    S(G.prismOf(F, hex, -BEAM_Y, BEAM_Y, P), {
      tone: 'mid',
      inner: Ln(slots, { tone: 'lo' }) + Ln(notch.join(''), { tone: 'lo' }) + Ln(notchMajor.join(''), { tone: 'mid' }),
    }),
  )
  // End knife edges, pointing up into the stirrups
  for (const side of [-1, 1]) {
    const s = side * ARM
    out.push(S(G.prismOf(F, [[s - 3, KNIFE_BASE], [s + 3, KNIFE_BASE], [s, KNIFE_TIP]], -BEAM_Y, BEAM_Y, P), { tone: 'mid' }))
  }
  // Centre block
  out.push(S(G.prismOf(F, [[-7, 0.6], [7, 0.6], [7, 16.5], [-7, 16.5]], -4, 4, P), { tone: 'mid' }))
  out.push(D([onBeam(-4.5, 13.5, 4, th), onBeam(4.5, 13.5, 4, th), onBeam(-4.5, 3.4, 4, th), onBeam(4.5, 3.4, 4, th)].map(at), { size: 0.45 }))
  // Pointer hub and pointer
  const hub = onBeam(0, 9, 0, th)
  const HF = G.frameAlong(hub, [0, 1, 0])
  out.push(S(G.disc(4, POINTER_Y, 4.6, HF, P), { tone: 'mid' }))
  out.push(
    S(G.prismOf(F, [[-1.1, 12.5], [1.1, 12.5], [0.9, -POINTER_LEN + 8], [0, -POINTER_LEN], [-0.9, -POINTER_LEN + 8]], POINTER_Y, POINTER_Y + 1.2, P), {
      tone: 'hi',
      crease: 'lo',
    }),
  )
  out.push(Ln(G.circleOf(HF, POINTER_Y + 1.2, 1.6, P), { tone: 'mid' }))
  out.push(D([at(onBeam(0, 9, POINTER_Y + 1.2, th))], { size: 0.5 }))
  return out.join('')
}

export const LABEL =
  'Eine Balkenwaage auf einer Grundplatte. Rechts liegt eine OSCAR-Waschmarke, 5 Minuten. Links liegt, womit OSCAR wirklich verglichen wird: ein Eimer mit Schwamm, ein Samstag mit 180 Minuten. Der Balken kippt nach links, bis die Schale auf der Stütze liegt. Liegt links die Marke einer anderen Waschanlage, steht der Balken im Gleichgewicht.'

export const LIFT = 26

export const STATIC = {
  back: base() + rest(-1) + rest(1) + column() + tray(),
  scale: scale(),
  leftBack: sideBack(-1),
  leftFront: sideFront(-1),
  rightBack: sideBack(1),
  rightFront: sideFront(1),
  stirrupLeft: stirrupFront(-1),
  stirrupRight: stirrupFront(1),
  tokenLeft: token(-1, false),
  tokenOscar: token(1, true),
}
