// Static art for Fig 05, built once as SVG strings with the anatomy kit.
// A retort stand: heavy base on feet, a graduated post, three boss heads with arms and support rings,
// three funnels stacked so each stem drips into the next, and a dish on the base under the last stem.
// World units ≈ 1 mm, x/y on the floor, z up, the base top at z = 0.
import * as k from '#/components/iso/iso-kit'
import * as G from '#/components/iso/lathe.mjs'
import type { Plan, Plane, Point3 } from '#/components/iso/iso-kit'
import { BALL, DISH, DISH_FLOOR, DISH_TOP, ENTRY, NECK, RIM, TIERS, TIP, TOP, WALL, innerAt, pileOf, slopeOf } from './model'

export const WIDTH = 600
export const HEIGHT = 500
const AZIMUTH = 45
const ELEVATION = 42

const POST: Plane = [-72, 14]
const POST_R = 3.2
const POST_TOP = TOP + 8
const BASE: Plan = { x: -90, y: -28, w: 124, d: 64, r: 6 }
const BASE_H = 9
const FOOT_H = 4
const BOSS = 6

export const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
    [POST[0], POST[1], POST_TOP + 2],
    ...Array.from({ length: 16 }, (_, i): Point3 => [TIERS[0].R * Math.cos((i / 16) * Math.PI * 2), TIERS[0].R * Math.sin((i / 16) * Math.PI * 2), TOP]),
  ],
  WIDTH,
  HEIGHT,
  { pad: 16, azimuth: AZIMUTH, elevation: ELEVATION },
)

const at = (point: Point3) => k.iso(point, P)
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style)
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style)
const D = (points: Array<[number, number]>, style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style)
const up = (o: Point3) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0])
const depth = (p: Point3) => k.depthOf(p, P)
const byDepth = <T extends Plane>(points: T[]) => [...points].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]))

/** Plan angle that faces away from the viewer, turned to the right so the stems above don't cover it. */
const [vx, vy] = k.towardViewer(P)
const BACK = Math.atan2(-vy, -vx) + 0.62
/** Plan angle that faces the viewer, for marks on round parts. */
const FACING = Math.atan2(vy, vx)

export const PILES = TIERS.map((_, i) => pileOf(i, BACK))
export const DISH_SEAT: Point3 = [0, 0, DISH_FLOOR + BALL]

/** Height of the support ring under each funnel (top face, in the funnel frame). */
const ringS = (i: number) => TIERS[i].L + TIERS[i].H * 0.3
const ringIn = (i: number) => TIERS[i].rs + (TIERS[i].R - TIERS[i].rs) * 0.3
const RING_H = 2
const RING_W = 2.8
const armZ = (i: number) => TIP[i] + ringS(i) - RING_H / 2

// ——— Base, post, bosses and arms (all behind the funnels) ———

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`]
  for (const [x, y] of byDepth(k.corners(BASE, 12))) {
    out.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }))
    out.push(S(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }))
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.4), { tone: 'mid', inner: L(k.sideSeam(BASE, -3.4, P, 8), { tone: 'faint' }) }))
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }))
  const screws = k.corners(BASE, 10)
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }))
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }))

  // Engraved tag in front of the dish: the one word in the drawing.
  const tag: Plan = { x: 2, y: 19, w: 22, d: 9, r: 1.4 }
  out.push(S(k.slabOf(tag, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }))
  out.push(L(k.planOutline(k.insetPlan(tag, 1.4), 0.8, P, 4), { tone: 'faint' }))
  out.push(k.faceTextSvg(k.topMatrix([tag.x + tag.w / 2, tag.y + 6], 0.8, P, 'x'), 'ABO', { size: 4.2, tone: 'mid', anchor: 'middle' }))
  out.push(D([at([tag.x + 2.6, tag.y + tag.d / 2, 0.8]), at([tag.x + tag.w - 2.6, tag.y + tag.d / 2, 0.8])], { size: 0.4 }))

  // Label plate behind the dish: three rule lines stand for the printed spec.
  const label: Plan = { x: -44, y: 8, w: 26, d: 14, r: 1.4 }
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }))
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 4), { tone: 'faint' }))
  ;[
    [4, 15],
    [7, 10],
    [10, 13],
  ].forEach(([dy, len]) => out.push(L(k.lineOnTop([label.x + 5, label.y + dy], [label.x + 5 + len, label.y + dy], 0.8, P), { tone: 'lo', free: true })))
  return out.join('')
}

function post() {
  const out: string[] = []
  const [x, y] = POST
  // Threaded boss the post screws into, with a lock nut.
  out.push(S(k.cylinder(x, y, 7.5, 0, 3, P, 36, 0.4), { tone: 'mid' }))
  out.push(S(k.cylinder(x, y, 5.2, 3, 3.4, P, 6, 0.3), { tone: 'mid' }))
  // Graduated rod: a tick every 5, a long one every 25, on the side that faces the viewer.
  const F = up([x, y, 0])
  const minor: string[] = []
  const major: string[] = []
  const clear = (z: number) => TIERS.every((_, i) => Math.abs(z - armZ(i)) > BOSS + 2)
  for (let z = 15; z < POST_TOP - 6; z += 5) {
    if (!clear(z)) continue
    const big = z % 25 === 0
    const span = big ? 0.75 : 0.4
    ;(big ? major : minor).push(G.arcOf(F, z, POST_R, P, { from: FACING - span, to: FACING + span, trim: 0 }))
  }
  out.push(S(k.cylinder(x, y, POST_R, 6.4, POST_TOP - 6.4, P, 28), { tone: 'mid', crease: 'none', inner: L(minor.join(''), { tone: 'lo' }) + L(major.join(''), { tone: 'mid' }) }))
  out.push(S(G.solidOf([[POST_TOP, POST_R], [POST_TOP + 1.2, POST_R, 1], [POST_TOP + 2, 1.8, 1], [POST_TOP + 2.3, 0.2, 1]], F, P), { tone: 'mid' }))
  return out.join('')
}

/** Boss head on the post, its thumb screw, and the arm out to the funnel's ring. */
function boss(i: number) {
  const out: string[] = []
  const [x, y] = POST
  const z = armZ(i)
  const plan: Plan = { x: x - BOSS, y: y - BOSS, w: BOSS * 2, d: BOSS * 2, r: 1.6 }
  out.push(S(k.slabOf(plan, z - BOSS, BOSS * 2, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(plan, z, P, 4), { tone: 'faint' }) }))
  out.push(L(k.ring(x, y, POST_R + 0.6, z + BOSS, P, 24), { tone: 'lo' }))
  out.push(D([at([plan.x + 2, plan.y + 2, z + BOSS]), at([plan.x + plan.w - 2, plan.y + plan.d - 2, z + BOSS])], { size: 0.4 }))

  // Thumb screw on the +y face: neck, knurled knob, flat end.
  const T = G.frameOf([x, y + BOSS, z + BOSS * 0.45], [0, 1, 0], [1, 0, 0], [0, 0, 1])
  out.push(S(G.disc(0, 1.6, 1.3, T, P), { tone: 'mid', crease: 'none' }))
  out.push(S(G.disc(1.6, 5.2, 2.8, T, P), { tone: 'mid', inner: L(G.ribsOf(T, 1.9, 4.9, 2.8, 22, P), { tone: 'lo' }) }))

  // Arm: a round rod from the +x face to the ring, with a collar at the boss.
  const reach = Math.hypot(x, y)
  const dir: Point3 = [-x / reach, -y / reach, 0]
  const exit = BOSS / Math.abs(dir[0])
  const A = G.frameAlong([x + dir[0] * exit, y + dir[1] * exit, z], dir)
  const len = reach - exit - ringIn(i) - RING_W + 0.6
  out.push(S(G.disc(0, 1.4, 2.2, A, P), { tone: 'mid' }))
  out.push(S(G.disc(1.4, len, 1.3, A, P), { tone: 'mid', crease: 'none' }))
  return out.join('')
}

// ——— Funnels ———

/** Clip that keeps what sits inside an opening: the void itself and everything above its centre line. */
function insideClip(id: string, voidPath: string, centreY: number) {
  return `<clipPath id="${id}"><path d="${voidPath}"/><rect x="-200" y="-400" width="${WIDTH + 400}" height="${centreY + 400}"/></clipPath>`
}

function ringOf(i: number, front: boolean, id: string) {
  const t = TIERS[i]
  const F = up([0, 0, TIP[i]])
  const s = ringS(i)
  const art = S(G.ringBand(s - RING_H, s, ringIn(i), ringIn(i) + RING_W, F, P), { tone: 'mid', crease: 'lo' })
  if (!front) return art
  // Front half only, and only where the flaring cone above doesn't hide it.
  const cy = at([0, 0, TIP[i] + s - RING_H / 2])[1]
  const cone = G.solidOf([[s, ringIn(i)], [t.L + t.H + 0.4, t.R + 1]], F, P).fill
  const box = `x="-200" y="-400" width="${WIDTH + 400}" height="${HEIGHT + 800}"`
  return (
    `<mask id="${id}-ring${i}" maskUnits="userSpaceOnUse" ${box}>` +
    `<rect x="-200" y="${cy}" width="${WIDTH + 400}" height="${HEIGHT + 400}" fill="#fff"/><path d="${cone}" fill="#000"/></mask>` +
    `<g mask="url(#${id}-ring${i})">${art}</g>`
  )
}

/** Funnel body with its rolled rim and the dark opening. Returns the art and the inside clip. */
function funnel(i: number, id: string) {
  const t = TIERS[i]
  const F = up([0, 0, TIP[i]])
  const top = t.L + t.H
  const m = slopeOf(t)
  const out: string[] = []
  const seam = G.arcOf(F, t.L + 3, t.rs + 3 * m, P, { slope: m, trim: 0 })
  out.push(S(G.solidOf([[0, t.rs], [t.L, t.rs], [top, t.R]], F, P), { tone: 'hi', crease: 'lo', inner: L(seam, { tone: 'faint' }) }))
  // Drip tip: a thin lip at the stem end.
  out.push(S(G.disc(0, 0.8, t.rs + 0.4, F, P), { tone: 'hi', crease: 'lo' }))
  out.push(S(G.disc(top - 1.4, top + 0.4, t.R + 1, F, P), { tone: 'hi', crease: 'lo' }))
  const voidPath = G.circleOf(F, top + 0.4, t.R - WALL, P)
  out.push(`<path d="${voidPath}" style="fill:var(--anatomy-shade-0)"/>`)
  const clip = `${id}-in${i}`
  out.push(insideClip(clip, voidPath, at([0, 0, RIM[i] + 0.4])[1]))
  // Inner wall: two faint rings on the far side give the cone its depth.
  const rings = [0.78, 0.55].map((f) => G.arcOf(F, t.L + t.H * f, innerAt(t, t.H * f), P, { slope: m, inward: true, trim: 0 })).join('')
  const grey = [...PILES[i].grey].sort((a, b) => depth(a) - depth(b))
  const inside = L(rings, { tone: 'lo' }) + grey.map((p) => S(G.sphereOf(p, BALL, P), { tone: 'mid' })).join('')
  return { pre: out.join(''), clip, inside }
}

function dish(id: string) {
  const F = up([0, 0, 0])
  const out: string[] = []
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: -12, y: -12, w: 24, d: 24, r: 12 }, 0, 0.1, P)}" style="filter:blur(4px)"/>`)
  out.push(S(G.disc(0, DISH.foot, 11, F, P), { tone: 'lo' }))
  out.push(S(G.solidOf([[DISH.foot, 12], [DISH.foot + 1.6, DISH.r - 0.6], [DISH_TOP, DISH.r]], F, P), { tone: 'hi', crease: 'lo' }))
  out.push(S(G.disc(DISH_TOP - 1, DISH_TOP + 0.4, DISH.r + 0.8, F, P), { tone: 'hi', crease: 'lo' }))
  const voidPath = G.circleOf(F, DISH_TOP + 0.4, DISH.r - 0.9, P)
  out.push(`<path d="${voidPath}" style="fill:var(--anatomy-shade-0)"/>`)
  const clip = `${id}-dish`
  out.push(insideClip(clip, voidPath, at([0, 0, DISH_TOP + 0.4])[1]))
  return { pre: out.join(''), clip, inside: L(G.circleOf(F, DISH_FLOOR, DISH.r - 3, P), { tone: 'faint' }) }
}

/** The red lead, built at the origin and moved with translateAlong. */
export const LEAD = S(G.sphereOf([0, 0, 0], BALL, P), { tone: 'hi', lit: true, className: 'ff-lead' })
export const leadAt = (p: Point3) => k.translateAlong(P, p)

export type Layer = { pre: string; clip: string; inside: string; slot: number }

/**
 * Static art in painter's order, as layers around the live slots for the red lead.
 * Each layer: static art, then a clipped group (what lies inside an opening) holding the slot.
 * Slots: 0..2 inside the funnels, 3 inside the dish. `tail` closes the drawing; the air slot comes after it.
 * `__ID__` stands for the instance id: clip paths must be unique on a page with several slides.
 */
function build() {
  const id = '__ID__'
  const d = dish(id)
  const layers: Layer[] = [{ pre: base() + post() + [2, 1, 0].map(boss).join('') + d.pre, clip: d.clip, inside: d.inside, slot: 3 }]
  let carry = ''
  for (const i of [2, 1, 0]) {
    const f = funnel(i, id)
    layers.push({ pre: carry + ringOf(i, false, id) + f.pre, clip: f.clip, inside: f.inside, slot: i })
    carry = ringOf(i, true, id)
  }
  return { layers, tail: carry }
}

export const ART = build()

/** Screen height (share of the viewBox) of each funnel's middle and of the dish, for picking by pointer. */
export const PICK = [...TIERS.map((t, i) => at([0, 0, NECK[i] + t.H * 0.5])[1] / HEIGHT), at([0, 0, DISH_TOP])[1] / HEIGHT]

export { ENTRY, NECK, RIM, TIP, DISH_TOP }
