import * as React from 'react'
import * as k from '#/components/iso/iso-kit'
import { Dots, IsoFigure, Line, Solid } from '#/components/iso/react/draw'
import { follow, useInView, useLoop, useReadout } from '#/components/iso/react/live'
import { DeckPlate } from '../DeckPlate'
import {
  BLOCK_EDGE,
  BORE,
  BORE_SCREEN,
  CORE,
  FACE_ART,
  FAR_RIMS,
  FAR_RIM_SCREWS,
  HEAD,
  HEIGHT,
  NEAR,
  NEAR_SCREWS,
  P,
  PANES,
  RIG,
  TOP,
  TRAY_ART,
  WIDTH,
  type Part,
} from './geometry'
import { DEEPEST, DEPTH, LIFTED, REST, STOPS, readoutOf, spokenOf, stratumAt } from './model'
import './realproduct.css'

const LABEL =
  'Ein Kernbohrgerät auf einem Probenkasten, dessen vorderes Viertel aufgeschnitten ist. Oben liegt eine dünne Schicht Schaum, die Wäsche. Darunter drei helle Schichten, das echte Produkt: Stolz aufs Auto, Zeit am Samstag, Ruhe dank Fixpreis. Ganz unten drei dunkle Schichten mit Steinen, die Ängste: Kratzer, zu viel zahlen, warten. Der rote Bohrer fährt durch alle Schichten.'

const part = (p: Part, key: string) => <Solid key={key} paths={p.paths} tone={p.tone} crease={p.crease} lit={p.lit} />

// ---------- static art, built once ----------

const CASE_BACK = (
  <g key="case-back">
    <path className="iso-halo" d={TRAY_ART.halo} />
    {TRAY_ART.feet.map((p, i) => part(p, `foot-${i}`))}
    {part(TRAY_ART.tray, 'tray')}
    <Line d={TRAY_ART.groove} tone="faint" />
    <Line d={TRAY_ART.screwRings} tone="lo" />
    <Dots points={TRAY_ART.screws} size={0.5} />
    {part(TRAY_ART.label.plate, 'label')}
    <Line d={TRAY_ART.label.inset} tone="faint" />
    {TRAY_ART.label.rules.map((d, i) => (
      <Line key={i} d={d} tone="lo" free />
    ))}
    <Dots points={TRAY_ART.label.screws} size={0.4} />
  </g>
)

const SAMPLE = (
  <g key="sample">
    {FACE_ART.map((f) => (
      <g key={f.key}>
        {f.bands.map((b) => (
          <path key={b.i} className="fr-band" data-i={b.i} d={b.d} />
        ))}
        <path className="fr-shade" d={f.shade.d} fillOpacity={f.shade.alpha} />
        {f.pebbles.map((p, i) => (
          <path key={i} className="fr-pebble" d={p.d} />
        ))}
        <Dots points={f.sand} size={0.42} tone="lo" />
        {f.bubbles.map((d, i) => (
          <Line key={i} d={d} tone="lo" />
        ))}
        {f.lines.map((l) => (
          <Line key={l.i} d={l.d} tone={l.i === 4 ? 'mid' : 'lo'} />
        ))}
      </g>
    ))}
    <path className="fr-bore" d={BORE.x} />
    <path className="fr-bore" data-wall="" d={BORE.y} />
    <Line d={BORE.lips} tone="mid" />
    <Line d={BORE.floor} tone="mid" />
    <path className="fr-top" d={TOP.fill} />
    <Line d={TOP.foam} tone="lo" />
    <Line d={BLOCK_EDGE} tone="hi" />
  </g>
)

const CASE_FRONT = (
  <g key="case-front">
    {FAR_RIMS.map((p, i) => part(p, `far-${i}`))}
    <Dots points={FAR_RIM_SCREWS} size={0.4} />
    {PANES.map((p, i) => (
      <g key={i}>
        <path className="fr-glass" d={p.outline} />
        {p.glare.map((d, j) => (
          <Line key={j} d={d} tone="faint" />
        ))}
        <Line d={p.outline} tone="lo" />
      </g>
    ))}
    {NEAR.map((p, i) => part(p, `near-${i}`))}
    <Dots points={NEAR_SCREWS} size={0.4} />
  </g>
)

const CORE_BOX = (
  <g key="core">
    <path className="iso-halo" d={CORE.halo} style={{ filter: 'blur(4px)' }} />
    {part(CORE.floor, 'floor')}
    {CORE.back.map((p, i) => part(p, `back-${i}`))}
    {CORE.rows.map((row, ri) => (
      <g key={ri}>
        {row.saddles.map((p, i) => part(p, `saddle-${i}`))}
        {row.segs.map((seg) => (
          <g key={seg.i} className="fr-core" data-i={seg.i}>
            <Solid paths={seg.paths} tone="hi" crease="lo" />
          </g>
        ))}
        {ri === 0 ? part(CORE.divider, 'divider') : null}
      </g>
    ))}
    {CORE.front.map((p, i) => part(p, `front-${i}`))}
    <Dots points={CORE.screws} size={0.4} />
  </g>
)

const RIG_ART = (
  <g key="rig">
    <path className="iso-halo" d={RIG.halo} style={{ filter: 'blur(4px)' }} />
    {RIG.runners.map((p, i) => part(p, `runner-${i}`))}
    {part(RIG.skid, 'skid')}
    <Line d={RIG.skidGroove} tone="faint" />
    <Dots points={RIG.skidScrews} size={0.45} />
    {RIG.gussets.map((p, i) => part(p, `gusset-${i}`))}
    {part(RIG.flange, 'flange')}
    <Dots points={RIG.flangeBolts} size={0.45} />
    <Solid paths={RIG.mast.paths} tone="mid" inner={<Line d={RIG.mastSeams} tone="faint" />} />
    {part(RIG.rack, 'rack')}
    <Line d={RIG.rackTeeth} tone="lo" />
    {part(RIG.ruler, 'ruler')}
    <Line d={RIG.ticks.minor} tone="lo" />
    <Line d={RIG.ticks.major} tone="mid" />
    <Line d={RIG.ticks.zero} tone="hi" />
    {part(RIG.cap, 'cap')}
    <Dots points={RIG.capScrews} size={0.4} />
  </g>
)

const HEAD_ART = (
  <g key="head">
    <Solid paths={HEAD.carriage.paths} tone="mid" inner={<Line d={HEAD.carriageSeam} tone="faint" />} />
    <Dots points={HEAD.carriageScrews} size={0.45} />
    {part(HEAD.index, 'index')}
    <Line d={HEAD.indexMark} tone="hi" />
    {part(HEAD.lockNeck, 'lock')}
    {part(HEAD.arm, 'arm')}
    <Dots points={HEAD.armScrews} size={0.45} />
    {part(HEAD.bit, 'bit')}
    <Line d={HEAD.bitTeeth} tone="lit" />
    <Line d={HEAD.bitSeam} tone="lit" />
    {part(HEAD.rod, 'rod')}
    <Line d={HEAD.rodJoints} tone="lit" />
    {part(HEAD.chuck, 'chuck')}
    <Line d={HEAD.chuckJaws} tone="lo" />
    <Dots points={HEAD.chuckKey} size={0.5} />
    <Solid paths={HEAD.housing.paths} tone="hi" crease="lo" inner={<Line d={HEAD.housingSeams} tone="lo" />} />
    <Line d={HEAD.fins} tone="faint" />
    <Line d={HEAD.capRing} tone="lo" />
    {part(HEAD.knob, 'knob')}
    <Line d={HEAD.knobKnurl} tone="lo" />
    <Line d={HEAD.knobMark} tone="hi" />
  </g>
)

// ---------- live ----------

const headAt = (depth: number) => k.translateAlong(P, [0, 0, -(depth - LIFTED)])
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const smooth = (t: number) => {
  const u = clamp(t, 0, 1)
  return u * u * (3 - 2 * u)
}

/** Idle tour: lift out, then drill down stratum by stratum, pausing in each, then pull the rod back up. */
type Leg = { to: number; move: number; hold: number }
const LEGS: Leg[] = [
  { to: LIFTED, move: 1.4, hold: 0.8 },
  ...STOPS.map((to, i) => ({ to, move: i === 0 ? 1.0 : 1.1, hold: 1.15 })),
  { to: LIFTED, move: 2.6, hold: 0.6 },
]
const LOOP = LEGS.reduce((s, l) => s + l.move + l.hold, 0)
function tourAt(t: number, from: number) {
  let clock = t % LOOP
  let prev = t < LOOP ? from : LEGS[LEGS.length - 1]!.to
  for (const leg of LEGS) {
    if (clock < leg.move) return prev + (leg.to - prev) * smooth(clock / leg.move)
    clock -= leg.move
    if (clock < leg.hold) return leg.to
    clock -= leg.hold
    prev = leg.to
  }
  return prev
}

const TOUR_FIRST = 1.4
const TOUR_BACK = 3600

function DrillLive() {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const head = React.useRef<SVGGElement>(null)
  const visible = useInView(anchor)
  const s = React.useRef({ depth: REST, target: REST, touring: true, clock: -TOUR_FIRST, layer: stratumAt(REST) })
  const idle = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const kick = useLoop((dt, calm) => {
    const st = s.current
    if (st.touring && !calm) {
      st.clock += dt
      if (st.clock > 0) st.target = tourAt(st.clock, REST)
    }
    st.depth = follow(st.depth, st.target, dt, st.touring ? 0.12 : 0.22, calm)
    head.current?.setAttribute('transform', headAt(st.depth))
    say(readoutOf(st.depth))
    const layer = st.depth <= 0.5 ? -1 : stratumAt(st.depth)
    if (layer !== st.layer && anchor.current) {
      st.layer = layer
      anchor.current.setAttribute('aria-valuenow', String(Math.round(st.depth)))
      anchor.current.setAttribute('aria-valuetext', spokenOf(st.depth))
    }
    return (st.touring && !calm) || st.depth !== st.target
  }, visible)

  const steer = React.useCallback(
    (depth: number) => {
      const st = s.current
      st.touring = false
      st.target = clamp(depth, LIFTED, DEEPEST)
      clearTimeout(idle.current)
      kick()
    },
    [kick],
  )
  const resumeLater = React.useCallback(() => {
    clearTimeout(idle.current)
    idle.current = setTimeout(() => {
      const st = s.current
      st.touring = true
      st.clock = 0
      kick()
    }, TOUR_BACK)
  }, [kick])
  React.useEffect(() => () => clearTimeout(idle.current), [])

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const svg = anchor.current?.querySelector('svg')
    if (!svg) return
    const box = svg.getBoundingClientRect()
    const vy = ((e.clientY - box.top) / box.height) * HEIGHT
    steer(((vy - BORE_SCREEN.top) / (BORE_SCREEN.floor - BORE_SCREEN.top)) * DEPTH)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const st = s.current
    const now = st.target
    let to: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = STOPS.find((d) => d > now + 0.5) ?? DEEPEST
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = [...STOPS].reverse().find((d) => d < now - 0.5) ?? LIFTED
    if (e.key === 'Home') to = LIFTED
    if (e.key === 'End') to = DEEPEST
    if (e.key === 'Escape') {
      resumeLater()
      return
    }
    if (to === null) return
    e.preventDefault()
    steer(to)
    resumeLater()
  }

  return (
    <div
      ref={anchor}
      className="fr"
      tabIndex={0}
      role="slider"
      aria-label="Bohrtiefe: Zeiger hoch und runter oder Pfeiltasten führen den Bohrer von Schicht zu Schicht"
      aria-valuemin={LIFTED}
      aria-valuemax={DEEPEST}
      aria-valuenow={Math.round(REST)}
      aria-valuetext={spokenOf(REST)}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={resumeLater}
      onFocus={() => steer(s.current.target)}
      onBlur={resumeLater}
      onKeyDown={onKeyDown}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={LABEL}>
        {CASE_BACK}
        {SAMPLE}
        {CASE_FRONT}
        {CORE_BOX}
        {RIG_ART}
        <g ref={head} transform={headAt(REST)}>
          {HEAD_ART}
        </g>
      </IsoFigure>
    </div>
  )
}

/** Fig 04 · The Real Product & Find the Fear: the wash is only the surface; we drill for what lies below. */
export function FigRealProduct() {
  return (
    <DeckPlate fig="Fig 04" title="Probebohrung" hint="Zeiger hoch / runter" readout={readoutOf(REST)}>
      <DrillLive />
    </DeckPlate>
  )
}
