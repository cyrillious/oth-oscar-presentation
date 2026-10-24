import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { follow, spring, useInView, useLoop, type Spring } from '#/components/iso/react/live'
import { DeckPlate } from '../DeckPlate'
import { ART, HEIGHT, RIGHTWARD, WIDTH, carriageAt, counterAt, needleAt, plungerAt } from './geometry'
import { BLOCKS, REACH, RESTING, STOPS, blockUnder, heightUnder, onBoss, readoutOf } from './model'

/** Idle tour: dwell on each «Beste» block, linger on OSCAR's, then slide back. */
const DWELL = [2.2, 2.2, 2.2, 3.6]
const LOOP = DWELL.reduce((a, b) => a + b, 0)
const FIRST_TOUR = 0.8
const TOUR_BACK = 3600
const SLIDE = 0.32
const STIFF = 380
const DRAG = 24

function tourAt(t: number) {
  let left = t % LOOP
  for (let i = 0; i < DWELL.length; i++) {
    if (left < DWELL[i]) return STOPS[i]
    left -= DWELL[i]
  }
  return STOPS[0]
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Fig 02 · Only Is Better Than Best: a dial indicator reads three near-equal blocks and OSCAR's boss. */
export function FigOnly() {
  const stage = useRef<HTMLDivElement>(null)
  const carriage = useRef<SVGGElement>(null)
  const plunger = useRef<SVGGElement>(null)
  const needle = useRef<SVGPathElement>(null)
  const counter = useRef<SVGPathElement>(null)
  const bossUnder = useRef<SVGGElement>(null)
  const bossOver = useRef<SVGGElement>(null)
  const state = useRef({ x: STOPS[0], target: STOPS[0], tip: { at: BLOCKS[0].height, rate: 0 } as Spring, touring: true, clock: -FIRST_TOUR, idle: 0 as ReturnType<typeof setTimeout> | 0 })
  const inView = useInView(stage)

  const draw = useCallback(() => {
    const s = state.current
    const shift = carriageAt(s.x)
    carriage.current?.setAttribute('transform', shift)
    const under = onBoss(s.x)
    for (const [node, shown] of [[bossUnder.current, under], [bossOver.current, !under]] as const) {
      if (!node) continue
      node.setAttribute('transform', shift)
      node.style.display = shown ? '' : 'none'
    }
    plunger.current?.setAttribute('transform', plungerAt(s.tip.at))
    needle.current?.setAttribute('d', needleAt(s.tip.at))
    counter.current?.setAttribute('d', counterAt(s.tip.at))
    const text = readoutOf(s.x, s.tip.at)
    const slot = stage.current?.closest('.iso-plate')?.querySelector('[data-readout]')
    if (slot && slot.textContent !== text) slot.textContent = text
    if (stage.current) {
      stage.current.setAttribute('aria-valuenow', String(blockUnder(s.x) + 1))
      stage.current.setAttribute('aria-valuetext', text)
    }
  }, [])

  const kick = useLoop((dt, calm) => {
    const s = state.current
    if (s.touring && !calm) {
      s.clock += dt
      s.target = s.clock < 0 ? STOPS[0] : tourAt(s.clock)
    }
    s.x = follow(s.x, s.target, dt, SLIDE, calm)
    const want = heightUnder(s.x)
    const still = spring(s.tip, want, dt, STIFF, DRAG, calm)
    draw()
    return s.touring && !calm ? true : !(s.x === s.target && still)
  }, inView)

  const steer = useCallback(
    (next: number) => {
      const s = state.current
      s.touring = false
      s.target = clamp(next, REACH[0], REACH[1])
      if (s.idle) clearTimeout(s.idle)
      s.idle = setTimeout(() => {
        s.touring = true
        s.clock = 0
        kick()
      }, TOUR_BACK)
      kick()
    },
    [kick],
  )

  useEffect(() => () => {
    const s = state.current
    if (s.idle) clearTimeout(s.idle)
  }, [])

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const share = clamp(((event.clientX - box.left) / box.width - 0.2) / 0.6, 0, 1)
    // Pointer right moves the carriage right on screen.
    const from = RIGHTWARD > 0 ? REACH[0] : REACH[1]
    const to = RIGHTWARD > 0 ? REACH[1] : REACH[0]
    steer(from + share * (to - from))
  }

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const s = state.current
    const here = STOPS.reduce((best, stop, i) => (Math.abs(stop - s.target) < Math.abs(STOPS[best] - s.target) ? i : best), 0)
    let to: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') to = Math.min(STOPS.length - 1, here + 1)
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') to = Math.max(0, here - 1)
    if (event.key === 'Home') to = 0
    if (event.key === 'End') to = STOPS.length - 1
    if (to === null) return
    event.preventDefault()
    steer(STOPS[to])
  }

  return (
    <DeckPlate fig="Fig 02" title="Beste oder nur" hint="Schlitten schieben ← →" readout={RESTING}>
      <div
        ref={stage}
        className="iso-stage"
        tabIndex={0}
        role="slider"
        aria-label="Messuhr über vier Endmassen: Pfeiltasten schieben den Schlitten von Block zu Block"
        aria-valuemin={1}
        aria-valuemax={BLOCKS.length}
        aria-valuenow={1}
        aria-valuetext={RESTING}
        onPointerMove={onMove}
        onKeyDown={onKey}
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Eine Messuhr auf einer Messplatte. Ihr Taster liegt auf vier aneinandergeschobenen Endmassen. Drei sind fast gleich hoch, 14.0, 14.2 und 14.1 mm, der Zeiger rührt sich kaum. Der vierte Block, OSCAR, trägt einen Absatz, den kein anderer hat: Der Taster steigt auf 22.0 mm und der Zeiger schlägt weit aus."
          focusable="false"
        >
          <g dangerouslySetInnerHTML={{ __html: ART.back }} />
          <g ref={carriage} transform={carriageAt(STOPS[0])} dangerouslySetInnerHTML={{ __html: ART.carriage }} />
          <g ref={bossUnder} transform={carriageAt(STOPS[0])} style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: ART.boss }} />
          <g ref={plunger} transform={plungerAt(BLOCKS[0].height)} dangerouslySetInnerHTML={{ __html: ART.plunger }} />
          <g ref={bossOver} transform={carriageAt(STOPS[0])} dangerouslySetInnerHTML={{ __html: ART.boss }} />
          <g dangerouslySetInnerHTML={{ __html: ART.dial }} />
          <path ref={counter} className="iso-line" data-tone="mid" data-free="end" d={counterAt(BLOCKS[0].height)} style={{ strokeWidth: 0.9 }} />
          <path ref={needle} className="iso-line" data-tone="lit" data-free="start" d={needleAt(BLOCKS[0].height)} style={{ strokeWidth: 1.3 }} />
        </svg>
      </div>
    </DeckPlate>
  )
}
