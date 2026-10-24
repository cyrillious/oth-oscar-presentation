import { Fragment, useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useInView, useLoop } from '#/components/iso/react/live'
import { DeckPlate } from '../DeckPlate'
import { ART, HEIGHT, LEAD, PICK, WIDTH, leadAt } from './geometry'
import { STOPS, leadOf, stopBefore } from './path'
import { BOFU_DWELL, READOUT, TIERS } from './model'
import './funnel.css'

/** Fall: gravity-like start, capped speed, soft landing on the seat. */
const ACCEL = 520
const TOP_SPEED = 240
const BRAKE = 640

const restOf = (stage: number) => STOPS[stage === 2 ? 3 : stage]
const readoutAt = (u: number) => READOUT[Math.max(0, stopBefore(u))]

/**
 * Fig 05 · Tofu, Mofu, Bofu: three funnels on a retort stand. Each holds the leads still in that stage
 * (24, 8, 3); the red lead drops to the open stage and, at BOFU, on into the dish: the subscription.
 * `stage` comes from the slide's list; clicking a funnel or the arrow keys pick a stage and report it back.
 */
export function FigFunnel({ stage = 0, onStage }: { stage?: number; onStage?: (stage: number) => void }) {
  const raw = useId()
  const id = `ff${raw.replace(/[^a-zA-Z0-9]/g, '')}`
  const fix = (html: string) => html.replaceAll('__ID__', id)
  const [current, setCurrent] = useState(stage)
  useEffect(() => setCurrent(stage), [stage])

  const stageRef = useRef<HTMLDivElement>(null)
  const slots = useRef<Array<SVGGElement | null>>([])
  const start = restOf(stage)
  const state = useRef({ u: start, v: 0, target: start, want: stage, dwell: 0 })
  const inView = useInView(stageRef)

  const draw = useCallback(() => {
    const s = state.current
    const lead = leadOf(s.u)
    slots.current.forEach((node, slot) => {
      if (!node) return
      const shown = slot === lead.slot && lead.alpha > 0.01
      node.style.display = shown ? '' : 'none'
      if (!shown) return
      const ball = node.firstElementChild as SVGGElement | null
      ball?.setAttribute('transform', leadAt(lead.at))
      if (ball) ball.style.opacity = lead.alpha < 0.999 ? String(lead.alpha) : ''
    })
    const text = readoutAt(s.u)
    const slot = stageRef.current?.closest('.iso-plate')?.querySelector('[data-readout]')
    if (slot && slot.textContent !== text) slot.textContent = text
    stageRef.current?.setAttribute('aria-valuetext', text)
  }, [])

  const kick = useLoop((dt, calm) => {
    const s = state.current
    if (calm) {
      s.u = restOf(s.want)
      s.target = s.u
      s.v = 0
      draw()
      return false
    }
    // At BOFU the lead rests a moment in the last funnel, then drops into the dish.
    if (s.want === 2 && s.u >= STOPS[2] - 1e-6 && s.target === STOPS[2]) {
      s.dwell += dt
      if (s.dwell >= BOFU_DWELL) s.target = STOPS[3]
    }
    const left = s.target - s.u
    if (left > 0) {
      s.v = Math.min(s.v + ACCEL * dt, TOP_SPEED, Math.sqrt(2 * BRAKE * left) + 12)
      s.u = Math.min(s.target, s.u + s.v * dt)
    }
    if (s.u >= s.target) s.v = 0
    draw()
    return s.u < s.target || (s.want === 2 && s.target === STOPS[2])
  }, inView)

  // A new stage: forward runs on down the stand; backward drops a fresh lead in from the top.
  useEffect(() => {
    const s = state.current
    s.want = current
    s.dwell = 0
    const target = STOPS[current]
    if (target < s.u - 1e-6) {
      s.u = 0
      s.v = 0
    }
    s.target = target
    stageRef.current?.setAttribute('aria-valuenow', String(current + 1))
    kick()
  }, [current, kick])

  const pick = (next: number) => {
    const clamped = Math.min(2, Math.max(0, next))
    setCurrent(clamped)
    onStage?.(clamped)
  }

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const svg = event.currentTarget.querySelector('svg')
    if (!svg) return
    const box = svg.getBoundingClientRect()
    const share = (event.clientY - box.top) / box.height
    const near = PICK.reduce((best, y, i) => (Math.abs(y - share) < Math.abs(PICK[best] - share) ? i : best), 0)
    pick(Math.min(2, near))
  }

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    let to: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') to = current + 1
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') to = current - 1
    if (event.key === 'Home') to = 0
    if (event.key === 'End') to = 2
    // Only keep the key when it moves the stage: at either end it goes on to the presenter (next slide).
    if (to === null || to < 0 || to > 2 || to === current) return
    event.preventDefault()
    event.stopPropagation()
    pick(to)
  }

  const first = leadOf(start)
  const resting = readoutAt(start)
  const ball = (slot: number) => (
    <g
      ref={(node) => {
        slots.current[slot] = node
      }}
      style={first.slot === slot ? undefined : { display: 'none' }}
    >
      <g transform={leadAt(first.at)} dangerouslySetInnerHTML={{ __html: LEAD }} />
    </g>
  )

  return (
    <DeckPlate fig="Fig 05" title="Drei Trichter" hint="Trichter anklicken" readout={resting}>
      <div
        ref={stageRef}
        className="iso-stage ff"
        tabIndex={0}
        role="slider"
        aria-label="Drei Trichter an einem Stativ: Pfeiltasten wählen die Stufe"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={stage + 1}
        aria-valuetext={resting}
        onClick={onClick}
        onKeyDown={onKey}
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Ein Stativ mit drei Trichtern übereinander, jeder kleiner als der darüber. Im obersten liegen ${TIERS[0].count} Kugeln, im mittleren ${TIERS[1].count}, im untersten ${TIERS[2].count}. Eine rote Kugel fällt von Trichter zu Trichter und landet zuletzt in der Schale auf dem Fuss, beschriftet mit Abo.`}
          focusable="false"
        >
          {ART.layers.map((layer) => (
            <Fragment key={layer.slot}>
              <g dangerouslySetInnerHTML={{ __html: fix(layer.pre) }} />
              <g clipPath={`url(#${fix(layer.clip)})`}>
                <g dangerouslySetInnerHTML={{ __html: layer.inside }} />
                {ball(layer.slot)}
              </g>
            </Fragment>
          ))}
          <g dangerouslySetInnerHTML={{ __html: fix(ART.tail) }} />
          {ball(4)}
        </svg>
      </div>
    </DeckPlate>
  )
}
