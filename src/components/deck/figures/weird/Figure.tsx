import * as React from 'react'
import { DeckPlate } from '../DeckPlate'
import { useInView, useLoop, useReadout, follow } from '#/components/iso/react/live'
import { Stage } from '#/components/iso/react/live'
import {
  HEIGHT,
  WIDTH,
  blade,
  carClip,
  carSvg,
  depthOfCar,
  leverAt as leverArt,
  needleAt,
  rodAt,
  shiftX,
  shiftZ,
  slatsAt,
  staticArt,
} from './geometry'
import { COUNT, GATE_DOWN, GATE_UP, GATE_X, HALF_L, TWIST, TWIST_MAX, carX, readoutOf, restBelt, step, stopped, type Belt } from './model'
import './weird.css'

const LABEL =
  'Ein Förderband zwischen zwei Waschkabinen. Identische Modellautos fahren aus der Waschstrasse an einem gefederten Fühlerhebel vorbei. Ein Auto steht um einige Grad verdreht auf dem Band: Seine Ecke drückt die Rolle des Fühlers weg, der Zeiger schlägt aus, das Tor fällt und das Band steht kurz still.'

const ID = 'fw-figure'
const ART = staticArt(ID)
const REST = restBelt()
const RESTING = readoutOf(TWIST, REST)
const CAR_PLAIN = carSvg(0, false)
const BLADE = blade()

const TOUR_BACK = 3600
const NUDGE = 1

const gateBottom = (gate: number) => GATE_UP - (GATE_UP - GATE_DOWN) * gate

function spokenOf(twist: number, belt: Belt) {
  return `Auto um ${Math.round(twist)} Grad verdreht. ${stopped(belt) ? 'Der Fühler hat ausgelöst, das Band steht.' : 'Das Band läuft.'}`
}

/** Fig 01 · Weirding the Normal: a turned car on a feed of identical cars trips the feeler and stops the belt. */
export function FigWeird() {
  return (
    <DeckPlate fig="Fig 01" title="Förderband" hint="Zeiger ← → dreht das Auto" readout={RESTING}>
      <WeirdLive />
    </DeckPlate>
  )
}

function WeirdLive() {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const inView = useInView(anchor)
  const slats = React.useRef<SVGPathElement>(null)
  const needle = React.useRef<SVGPathElement>(null)
  const lever = React.useRef<SVGGElement>(null)
  const odd = React.useRef<SVGGElement>(null)
  const lane = React.useRef<SVGGElement>(null)
  const cars = React.useRef<(SVGGElement | null)[]>([])
  const wraps = React.useRef<(SVGGElement | null)[]>([])
  const gate = React.useRef<SVGGElement>(null)
  const gateBlade = React.useRef<SVGGElement>(null)
  const gateRod = React.useRef<SVGGElement>(null)
  const state = React.useRef({
    belt: restBelt(),
    twist: TWIST,
    target: TWIST,
    touring: true,
    drawn: { twist: TWIST, phi: REST.phi, order: '' },
    spoken: '',
    resume: 0 as ReturnType<typeof setTimeout> | 0,
  })

  const draw = React.useCallback(() => {
    const s = state.current
    const b = s.belt
    slats.current?.setAttribute('d', slatsAt(b.travel))
    if (Math.abs(s.drawn.phi - b.phi) > 1e-4) {
      s.drawn.phi = b.phi
      if (lever.current) lever.current.innerHTML = leverArt(b.phi)
      needle.current?.setAttribute('d', needleAt(b.phi))
    }
    if (Math.abs(s.drawn.twist - s.twist) > 0.02) {
      s.drawn.twist = s.twist
      if (odd.current) odd.current.innerHTML = carSvg(-s.twist, true)
    }
    // Painter's order: cars by depth. The gate's blade is a plane at GATE_X: it goes after every car with a
    // part behind that plane (those can only be hidden by it) and before the cars wholly past it.
    const items: Array<{ el: SVGGElement | null; depth: number; key: string }> = []
    let gateDepth = -Infinity
    for (let index = 0; index < COUNT; index++) {
      const x = carX(index, b.travel)
      cars.current[index]?.setAttribute('transform', shiftX(x))
      const depth = depthOfCar(x)
      items.push({ el: wraps.current[index] ?? null, depth, key: `c${index}` })
      if (x - HALF_L - 2 < GATE_X) gateDepth = Math.max(gateDepth, depth + 1e-3)
    }
    const bottom = gateBottom(b.gate)
    gateBlade.current?.setAttribute('transform', shiftZ(bottom - GATE_UP))
    if (gateRod.current) gateRod.current.innerHTML = rodAt(bottom)
    items.push({ el: gate.current, depth: gateDepth, key: 'g' })
    items.sort((a, c) => a.depth - c.depth)
    const order = items.map((it) => it.key).join()
    if (order !== s.drawn.order && lane.current) {
      s.drawn.order = order
      for (const it of items) if (it.el) lane.current.appendChild(it.el)
    }
    say(readoutOf(s.twist, b))
    const spoken = spokenOf(s.twist, b)
    if (spoken !== s.spoken && anchor.current) {
      s.spoken = spoken
      anchor.current.setAttribute('aria-valuetext', spoken)
      anchor.current.setAttribute('aria-valuenow', String(Math.round(s.twist)))
    }
  }, [anchor, say])

  const kick = useLoop((dt, calm) => {
    const s = state.current
    if (s.touring) s.target = TWIST
    s.twist = follow(s.twist, s.target, dt, 0.18, calm)
    step(s.belt, s.twist, dt, calm)
    draw()
    return !calm || s.twist !== s.target
  }, inView)

  React.useEffect(() => () => clearTimeout(state.current.resume || undefined), [])

  const steer = (twist: number) => {
    const s = state.current
    s.touring = false
    s.target = Math.min(TWIST_MAX, Math.max(0, twist))
    clearTimeout(s.resume || undefined)
    s.resume = setTimeout(() => {
      s.touring = true
      kick()
    }, TOUR_BACK)
    kick()
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const share = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - 0.2) / 0.6))
    steer(share * TWIST_MAX)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const s = state.current
    const by = event.shiftKey ? 5 : NUDGE
    let to: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') to = Math.round(s.target) + by
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') to = Math.round(s.target) - by
    if (event.key === 'Home') to = 0
    if (event.key === 'End') to = TWIST_MAX
    if (to === null) return
    event.preventDefault()
    steer(to)
  }

  const clip = `url(#${ID}-cars)`
  return (
    <div
      ref={anchor}
      className="fw"
      tabIndex={0}
      role="slider"
      aria-label="Förderband: Pfeiltasten drehen das rote Auto auf dem Band"
      aria-valuemin={0}
      aria-valuemax={TWIST_MAX}
      aria-valuenow={TWIST}
      aria-valuetext={spokenOf(TWIST, REST)}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      <Stage className="iso-stage">
        <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={LABEL} focusable="false">
          <defs>
            <clipPath id={`${ID}-cars`}>
              <path d={carClip} />
            </clipPath>
          </defs>
          <g dangerouslySetInnerHTML={{ __html: ART.back }} />
          <path ref={slats} className="iso-line" data-tone="faint" d={slatsAt(REST.travel)} />
          <g ref={lane}>
            {Array.from({ length: COUNT }, (_, index) => (
              <g key={index} ref={(el) => void (wraps.current[index] = el)} clipPath={clip}>
                <g ref={(el) => void (cars.current[index] = el)} transform={shiftX(carX(index, REST.travel))}>
                  {index === 0 ? (
                    <g ref={odd} dangerouslySetInnerHTML={{ __html: carSvg(-TWIST, true) }} />
                  ) : (
                    <g dangerouslySetInnerHTML={{ __html: CAR_PLAIN }} />
                  )}
                </g>
              </g>
            ))}
            <g ref={gate}>
              <g ref={gateRod} dangerouslySetInnerHTML={{ __html: rodAt(GATE_DOWN) }} />
              <g ref={gateBlade} transform={shiftZ(GATE_DOWN - GATE_UP)} dangerouslySetInnerHTML={{ __html: BLADE }} />
            </g>
          </g>
          <g dangerouslySetInnerHTML={{ __html: ART.beam }} />
          <path ref={needle} className="iso-line fw-needle" data-tone="lit" data-free="end" d={needleAt(REST.phi)} />
          <g ref={lever} dangerouslySetInnerHTML={{ __html: leverArt(REST.phi) }} />
          <g dangerouslySetInnerHTML={{ __html: ART.springPost }} />
          <g dangerouslySetInnerHTML={{ __html: ART.front }} />
        </svg>
      </Stage>
    </div>
  )
}
