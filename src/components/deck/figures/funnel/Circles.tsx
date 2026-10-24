import { useEffect, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { DeckPlate } from '../DeckPlate'
import { READOUT, TIERS } from './model'

// Fig 05 as plain circles: one circle per stage, stacked, each smaller than the one above.
// The open stage is filled red (the slide's one signal accent); the others are outlines.

const WIDTH = 600
const HEIGHT = 500
const CX = WIDTH / 2
const RADII = [100, 66, 40]
const GAP = 24

const CIRCLES = (() => {
  const total = RADII.reduce((h, r) => h + r * 2, 0) + GAP * (RADII.length - 1)
  let y = (HEIGHT - total) / 2
  return TIERS.map((t, i) => {
    const r = RADII[i]
    const cy = y + r
    y += r * 2 + GAP
    return { key: t.key, r, cy }
  })
})()

const PAPER = 'var(--color-paper)'
const FAINT = 'color-mix(in srgb, var(--color-ink) 22%, var(--color-stone))'

/**
 * Fig 05 · Tofu, Mofu, Bofu as three circles. `stage` comes from the slide's list; clicking a circle or
 * the arrow keys pick a stage and report it back.
 */
export function FigFunnelCircles({ stage = 0, onStage }: { stage?: number; onStage?: (stage: number) => void }) {
  const [current, setCurrent] = useState(stage)
  useEffect(() => setCurrent(stage), [stage])
  const reduce = useReducedMotion()

  const pick = (next: number) => {
    const clamped = Math.min(2, Math.max(0, next))
    setCurrent(clamped)
    onStage?.(clamped)
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

  const readout = READOUT[current]
  const transition = reduce ? undefined : 'fill 500ms var(--ease-frame), stroke 500ms var(--ease-frame)'

  return (
    <DeckPlate fig="Fig 05" readout={readout} bare>
      <div
        className="iso-stage"
        tabIndex={0}
        role="slider"
        aria-label="Drei Kreise, einer pro Stufe: Pfeiltasten wählen die Stufe"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={current + 1}
        aria-valuetext={readout}
        onKeyDown={onKey}
      >
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Drei Kreise übereinander, jeder kleiner als der darüber. Der Kreis der offenen Stufe ist rot."
          focusable="false"
        >
          {CIRCLES.map((c, i) => (
            <circle
              key={c.key}
              className="cursor-pointer"
              onClick={() => pick(i)}
              cx={CX}
              cy={c.cy}
              r={c.r}
              fill={i === current ? 'var(--color-signal)' : PAPER}
              stroke={i === current ? 'var(--color-signal)' : FAINT}
              strokeWidth={1.5}
              style={{ transition }}
            />
          ))}
        </svg>
      </div>
    </DeckPlate>
  )
}
