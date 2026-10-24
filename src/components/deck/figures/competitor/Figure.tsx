import { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { translateAlong } from '#/components/iso/iso-kit'
import { IsoFigure } from '#/components/iso/react/draw'
import { follow, useInView, useLoop, useReadout } from '#/components/iso/react/live'
import { DeckPlate } from '../DeckPlate'
import { DAMPING, MINUTES, OSCAR_MINUTES, REST_ANGLE, REST_RIVAL, STIFFNESS, STOP, angleFor, readoutOf, type Rival } from './model'
import { H, LABEL, LIFT, P, STATIC, W, beam, bucket, stirrupShift } from './geometry'
import './competitor.css'

const TOUR_FIRST = 1.4
const TOUR_LOOP = 10
const TOUR_SWAP = 4.6
const RESUME_MS = 3600
const LIFT_TAU = 0.24

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const other = (r: Rival): Rival => (r === 'bucket' ? 'token' : 'bucket')
/** How much of a load rests on the pan: 1 when seated, 0 once lifted a few units. */
const seatedShare = (lift: number) => clamp(1 - lift / 2.5, 0, 1)

interface State {
  th: number
  rate: number
  want: Rival
  lift: Record<Rival, number>
  clock: number
  touring: boolean
  hovering: boolean
  lastInput: number
  said: string
}

/**
 * Fig 03 · The True Competitor. A beam balance: OSCAR's token (5 min) against the real rival.
 * Another car wash weighs the same, the beam stays level. A bucket and sponge (a Saturday, 180 min)
 * tips it to the stop.
 */
export function FigCompetitor() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const bucketArt = useMemo(() => bucket(`fc${id}`), [id])
  const restBeam = useMemo(() => beam(REST_ANGLE), [])
  const { anchor, say } = useReadout<HTMLDivElement>()
  const visible = useInView(anchor)

  const beamRef = useRef<SVGGElement>(null)
  const leftRef = useRef<SVGGElement>(null)
  const rightRef = useRef<SVGGElement>(null)
  const stirLeftRef = useRef<SVGGElement>(null)
  const stirRightRef = useRef<SVGGElement>(null)
  const bucketRef = useRef<SVGGElement>(null)
  const tokenRef = useRef<SVGGElement>(null)
  const resume = useRef<number>(0)

  const state = useRef<State>({
    th: REST_ANGLE,
    rate: 0,
    want: REST_RIVAL,
    lift: { bucket: 0, token: LIFT },
    clock: 0,
    touring: true,
    hovering: false,
    lastInput: 0,
    said: readoutOf(REST_RIVAL),
  })

  const draw = useCallback(() => {
    const s = state.current
    beamRef.current && (beamRef.current.innerHTML = beam(s.th))
    const left = translateAlong(P, stirrupShift(-1, s.th))
    const right = translateAlong(P, stirrupShift(1, s.th))
    leftRef.current?.setAttribute('transform', left)
    stirLeftRef.current?.setAttribute('transform', left)
    rightRef.current?.setAttribute('transform', right)
    stirRightRef.current?.setAttribute('transform', right)
    for (const [rival, node] of [
      ['bucket', bucketRef.current],
      ['token', tokenRef.current],
    ] as const) {
      if (!node) continue
      const lift = s.lift[rival]
      const t = clamp(lift / LIFT, 0, 1)
      node.setAttribute('transform', translateAlong(P, [0, 0, lift]))
      node.style.opacity = String(1 - t * t * (3 - 2 * t))
      node.style.visibility = t >= 0.999 ? 'hidden' : ''
    }
  }, [])

  const tick = useCallback(
    (dt: number, calm: boolean) => {
      const s = state.current
      const now = performance.now()
      const quiet = !s.hovering && now - s.lastInput > RESUME_MS
      if (calm) s.touring = false
      else if (!s.touring && quiet && s.lastInput) {
        s.touring = true
        s.clock = s.want === 'bucket' ? TOUR_FIRST : TOUR_FIRST + TOUR_SWAP
      }
      if (s.touring) {
        s.clock += dt
        if (s.clock > TOUR_FIRST) {
          const t = (s.clock - TOUR_FIRST) % TOUR_LOOP
          s.want = t < TOUR_SWAP ? 'bucket' : 'token'
        }
      }

      // Loads: the unwanted one lifts off first, then the wanted one comes down.
      const away = other(s.want)
      s.lift[away] = follow(s.lift[away], LIFT, dt, LIFT_TAU, calm)
      const clear = s.lift[away] >= LIFT * 0.45
      s.lift[s.want] = follow(s.lift[s.want], clear ? 0 : LIFT, dt, LIFT_TAU, calm)

      // Beam: damped swing toward the angle the loads ask for, stopped by the pan rests.
      const left = MINUTES.bucket * seatedShare(s.lift.bucket) + MINUTES.token * seatedShare(s.lift.token)
      const target = angleFor(left, OSCAR_MINUTES)
      if (calm) {
        s.th = target
        s.rate = 0
      } else {
        const steps = Math.max(1, Math.ceil(dt * 240))
        const h = dt / steps
        for (let i = 0; i < steps; i++) {
          s.rate += ((target - s.th) * STIFFNESS - s.rate * DAMPING) * h
          s.th += s.rate * h
          if (s.th < -STOP) {
            s.th = -STOP
            if (s.rate < 0) s.rate = -s.rate * 0.18
          } else if (s.th > STOP) {
            s.th = STOP
            if (s.rate > 0) s.rate = -s.rate * 0.18
          }
        }
        if (Math.abs(target - s.th) < 5e-4 && Math.abs(s.rate) < 5e-4) {
          s.th = target
          s.rate = 0
        }
      }

      draw()
      const seated: Rival | null = seatedShare(s.lift.bucket) >= 0.5 ? 'bucket' : seatedShare(s.lift.token) >= 0.5 ? 'token' : null
      const text = readoutOf(seated)
      if (text !== s.said) {
        s.said = text
        say(text)
        anchor.current?.setAttribute('aria-label', `Balkenwaage: ${text}. Eingabe tauscht den Gegner.`)
      }
      const settled = s.rate === 0 && s.th === target && s.lift[s.want] === 0 && s.lift[away] === LIFT
      return s.touring || !settled || !quiet
    },
    [draw, say, anchor],
  )

  const kick = useLoop(tick, visible)

  useEffect(() => () => window.clearTimeout(resume.current), [])

  const touch = useCallback(() => {
    const s = state.current
    s.touring = false
    s.lastInput = performance.now()
    window.clearTimeout(resume.current)
    resume.current = window.setTimeout(kick, RESUME_MS + 50)
    kick()
  }, [kick])

  const choose = useCallback(
    (next: Rival) => {
      state.current.want = next
      touch()
    },
    [touch],
  )

  return (
    <DeckPlate fig="Fig 03" title="Der wahre Gegner" hint="Klick: Gegner tauschen" readout={readoutOf(REST_RIVAL)}>
      <div
        ref={anchor}
        className="fc"
        tabIndex={0}
        role="button"
        aria-label={`Balkenwaage: ${readoutOf(REST_RIVAL)}. Eingabe tauscht den Gegner.`}
        onPointerEnter={() => {
          state.current.hovering = true
          touch()
        }}
        onPointerLeave={() => {
          state.current.hovering = false
          touch()
        }}
        onClick={(e) => {
          // The figure is a control: don't let the slide link around it navigate.
          e.preventDefault()
          e.stopPropagation()
          choose(other(state.current.want))
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') choose(other(state.current.want))
          else if (e.key === 'ArrowLeft' || e.key === '1') choose('bucket')
          else if (e.key === 'ArrowRight' || e.key === '2') choose('token')
          else return
          e.preventDefault()
        }}
      >
        <IsoFigure width={W} height={H} label={LABEL}>
          <g dangerouslySetInnerHTML={{ __html: STATIC.back + STATIC.scale }} />
          <g ref={rightRef} transform={translateAlong(P, stirrupShift(1, REST_ANGLE))}>
            <g dangerouslySetInnerHTML={{ __html: STATIC.rightBack + STATIC.tokenOscar + STATIC.rightFront }} />
          </g>
          <g ref={leftRef} transform={translateAlong(P, stirrupShift(-1, REST_ANGLE))}>
            <g dangerouslySetInnerHTML={{ __html: STATIC.leftBack }} />
            <g ref={bucketRef} dangerouslySetInnerHTML={{ __html: bucketArt }} />
            <g ref={tokenRef} transform={translateAlong(P, [0, 0, LIFT])} style={{ opacity: 0, visibility: 'hidden' }} dangerouslySetInnerHTML={{ __html: STATIC.tokenLeft }} />
            <g dangerouslySetInnerHTML={{ __html: STATIC.leftFront }} />
          </g>
          <g ref={beamRef} dangerouslySetInnerHTML={{ __html: restBeam }} />
          <g ref={stirLeftRef} transform={translateAlong(P, stirrupShift(-1, REST_ANGLE))} dangerouslySetInnerHTML={{ __html: STATIC.stirrupLeft }} />
          <g ref={stirRightRef} transform={translateAlong(P, stirrupShift(1, REST_ANGLE))} dangerouslySetInnerHTML={{ __html: STATIC.stirrupRight }} />
        </IsoFigure>
      </div>
    </DeckPlate>
  )
}
