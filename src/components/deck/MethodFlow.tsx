// Flowchart sketches that explain the four methods (lightbox of «Die Lösung», MSolution).
// Drawn 1:1 in px so the labels stay at the deck's 20px body size. Ink lines on a stone panel,
// paper nodes, the result node is the single signal accent.
import { motion, useReducedMotion } from 'motion/react'

export type MethodFlowKey = 'weird' | 'only' | 'competitor' | 'realproduct'

export type MethodFlowProps = {
  /** Which method to draw. */
  method?: MethodFlowKey
  /** Draw the chart step by step when it appears. */
  animated?: boolean
  className?: string
}

type Pt = [number, number]

type FlowNode = {
  type: 'node'
  /** start = pill, step = box, ask = decision diamond, end = result (signal), drop = discarded (dashed). */
  kind: 'start' | 'step' | 'ask' | 'end' | 'drop'
  x: number
  y: number
  w: number
  h: number
  /** Line breaks with \n. */
  label: string
}

type FlowEdge = {
  type: 'edge'
  pts: Pt[]
  /** Arrowhead at the last point (default true). */
  arrow?: boolean
  dim?: boolean
}

type FlowLabel = {
  type: 'label'
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}

type FlowItem = FlowNode | FlowEdge | FlowLabel

type Flow = { title: string; h: number; items: FlowItem[] }

const node = (kind: FlowNode['kind'], x: number, y: number, w: number, h: number, label: string): FlowNode => ({
  type: 'node',
  kind,
  x,
  y,
  w,
  h,
  label,
})
const edge = (pts: Pt[], opts: Omit<FlowEdge, 'type' | 'pts'> = {}): FlowEdge => ({ type: 'edge', pts, ...opts })
const label = (x: number, y: number, text: string, anchor: FlowLabel['anchor'] = 'start'): FlowLabel => ({
  type: 'label',
  x,
  y,
  text,
  anchor,
})

/** Width of the drawing; the height comes with each flow. */
const W = 600

export const METHOD_FLOWS: Record<MethodFlowKey, Flow> = {
  // Turn a normal moment one notch, check both ways: weird enough, still clear.
  weird: {
    title: 'Weirding the Normal',
    h: 616,
    items: [
      node('start', 160, 0, 280, 56, 'Normaler Moment'),
      edge([[300, 56], [300, 100]]),
      node('step', 150, 100, 300, 56, 'Um einen Grad drehen'),
      edge([[300, 156], [300, 200]]),
      node('ask', 160, 200, 280, 130, 'Zweimal\nhinschauen?'),
      edge([[440, 265], [530, 265], [530, 128], [450, 128]]),
      label(485, 250, 'nein', 'middle'),
      edge([[300, 330], [300, 380]]),
      label(314, 355, 'ja'),
      node('ask', 160, 380, 280, 130, 'Noch\nverständlich?'),
      edge([[160, 445], [70, 445], [70, 128], [150, 128]]),
      label(115, 430, 'nein', 'middle'),
      edge([[300, 510], [300, 560]]),
      label(314, 535, 'ja'),
      node('end', 180, 560, 240, 56, 'Reel-Serie'),
    ],
  },
  // Only hard facts, only what nobody else has, translated into a benefit and proven.
  only: {
    title: 'Only Is Better Than Best',
    h: 536,
    items: [
      node('start', 120, 0, 360, 56, 'Mitbewerber nebeneinander'),
      edge([[300, 56], [300, 100]]),
      node('step', 170, 100, 260, 56, 'Nur harte Fakten'),
      edge([[300, 156], [300, 200]]),
      node('ask', 180, 200, 240, 130, 'Hat das\nnur OSCAR?'),
      edge([[420, 265], [480, 265]], { dim: true }),
      label(450, 245, 'nein', 'middle'),
      node('drop', 480, 237, 120, 56, 'Streichen'),
      edge([[300, 330], [300, 380]]),
      label(314, 355, 'ja'),
      node('step', 120, 380, 360, 56, 'Nutzen für die Kundschaft'),
      edge([[300, 436], [300, 480]]),
      node('end', 180, 480, 240, 56, 'Beweis-Clip'),
    ],
  },
  // The reason to wash fans out into everything people do instead; keep the strongest, answer them.
  competitor: {
    title: 'The True Competitor',
    h: 476,
    items: [
      node('start', 150, 0, 300, 56, 'Warum wäscht jemand?'),
      edge([[300, 56], [300, 160]]),
      edge([[300, 100], [95, 100], [95, 160]]),
      edge([[300, 100], [505, 100], [505, 160]]),
      label(314, 84, 'stattdessen'),
      node('step', 0, 160, 190, 56, 'Eimer'),
      node('step', 205, 160, 190, 56, 'SB-Box'),
      node('step', 410, 160, 190, 56, '«Mach ich selbst»'),
      edge([[95, 216], [95, 270], [300, 270]], { arrow: false }),
      edge([[505, 216], [505, 270], [300, 270]], { arrow: false }),
      edge([[300, 216], [300, 320]]),
      node('step', 140, 320, 320, 56, 'Die stärksten behalten'),
      edge([[300, 376], [300, 420]]),
      node('end', 170, 420, 260, 56, 'Content dagegen'),
    ],
  },
  // Two questions about the same wash: what is really bought, what is feared. Both feed one reel.
  realproduct: {
    title: 'The Real Product & Find the Fear',
    h: 524,
    items: [
      node('start', 180, 0, 240, 56, 'Eine Wäsche'),
      edge([[300, 56], [300, 96], [140, 96], [140, 160]]),
      edge([[300, 96], [460, 96], [460, 160]]),
      label(154, 136, 'Real Product'),
      label(474, 136, 'Find the Fear'),
      node('step', 0, 160, 280, 84, 'Was kauft man\nwirklich?'),
      node('step', 320, 160, 280, 84, 'Wovor hat man\nAngst?'),
      edge([[140, 244], [140, 290]]),
      edge([[460, 244], [460, 290]]),
      node('step', 0, 290, 280, 56, 'Das Gefühl danach'),
      node('step', 320, 290, 280, 56, 'Kratzer, Preis, Warten'),
      edge([[140, 346], [140, 400], [300, 400]], { arrow: false }),
      edge([[460, 346], [460, 400], [300, 400]], { arrow: false }),
      edge([[300, 400], [300, 440]]),
      node('end', 160, 440, 280, 84, 'Gefühl zeigen,\nAngst nehmen'),
    ],
  },
}

const INK = 'var(--color-ink)'
const MUTE = 'var(--color-mute)'
const PAPER = 'var(--color-paper)'
const RED = 'var(--color-signal)'
const LINE = 26

/** Polyline with rounded corners. */
function roundedPath(pts: Pt[], r = 10) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    const inLen = Math.hypot(x - px, y - py)
    const outLen = Math.hypot(nx - x, ny - y)
    const k = Math.min(r, inLen / 2, outLen / 2)
    const ax = x - ((x - px) / inLen) * k
    const ay = y - ((y - py) / inLen) * k
    const bx = x + ((nx - x) / outLen) * k
    const by = y + ((ny - y) / outLen) * k
    d += ` L${ax} ${ay} Q${x} ${y} ${bx} ${by}`
  }
  const [lx, ly] = pts[pts.length - 1]
  return `${d} L${lx} ${ly}`
}

function arrowHead(pts: Pt[]) {
  const [x, y] = pts[pts.length - 1]
  const [px, py] = pts[pts.length - 2]
  const len = Math.hypot(x - px, y - py)
  const ux = (x - px) / len
  const uy = (y - py) / len
  const s = 11
  const b = 6
  return `M${x} ${y} L${x - ux * s - uy * b} ${y - uy * s + ux * b} L${x - ux * s + uy * b} ${y - uy * s - ux * b} Z`
}

function Label({ text, cx, cy, fill, strike }: { text: string; cx: number; cy: number; fill: string; strike?: boolean }) {
  const lines = text.split('\n')
  return (
    <text
      textAnchor="middle"
      fontSize={20}
      fill={fill}
      style={{ letterSpacing: '-0.01em', textDecoration: strike ? 'line-through' : undefined }}
    >
      {lines.map((l, i) => (
        <tspan key={l} x={cx} y={cy + (i - (lines.length - 1) / 2) * LINE} dominantBaseline="central">
          {l}
        </tspan>
      ))}
    </text>
  )
}

function Shape({ n }: { n: FlowNode }) {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  if (n.kind === 'ask') {
    const d = `M${cx} ${n.y} L${n.x + n.w} ${cy} L${cx} ${n.y + n.h} L${n.x} ${cy} Z`
    return (
      <>
        <path d={d} fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <Label text={n.label} cx={cx} cy={cy} fill={INK} />
      </>
    )
  }
  const rx = n.kind === 'start' ? n.h / 2 : 12
  const fill = n.kind === 'end' ? RED : n.kind === 'drop' ? 'transparent' : PAPER
  const stroke = n.kind === 'end' ? 'none' : n.kind === 'drop' ? MUTE : INK
  return (
    <>
      <rect
        x={n.x + 1}
        y={n.y + 1}
        width={n.w - 2}
        height={n.h - 2}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={n.kind === 'drop' ? '6 6' : undefined}
      />
      <Label
        text={n.label}
        cx={cx}
        cy={cy}
        fill={n.kind === 'end' ? PAPER : n.kind === 'drop' ? MUTE : INK}
        strike={n.kind === 'drop'}
      />
    </>
  )
}

const EASE = [0.14, 0.71, 0.16, 0.99] as const

export function MethodFlow({ method = 'weird', animated = true, className = '' }: MethodFlowProps) {
  const flow = METHOD_FLOWS[method]
  const reduce = useReducedMotion()
  const play = animated && !reduce
  const steps = flow.items.map((item) => (item.type === 'node' ? item.label.replace('\n', ' ') : null)).filter(Boolean)

  return (
    <svg
      key={method}
      viewBox={`-4 -4 ${W + 8} ${flow.h + 8}`}
      width={W + 8}
      height={flow.h + 8}
      className={`overflow-visible ${className}`}
      role="img"
      aria-label={`${flow.title}: ${steps.join(', ')}`}
    >
      {flow.items.map((item, i) => {
        const delay = 0.25 + i * 0.09
        if (item.type === 'edge') {
          const stroke = item.dim ? MUTE : INK
          return (
            <g key={i}>
              <motion.path
                d={roundedPath(item.pts)}
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={play ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay }}
              />
              {item.arrow !== false && (
                <motion.path
                  d={arrowHead(item.pts)}
                  fill={stroke}
                  initial={play ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: delay + 0.32 }}
                />
              )}
            </g>
          )
        }
        return (
          <motion.g
            key={i}
            initial={play ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay }}
          >
            {item.type === 'node' ? (
              <Shape n={item} />
            ) : (
              <text x={item.x} y={item.y} textAnchor={item.anchor} dominantBaseline="central" fontSize={20} fill={MUTE} style={{ letterSpacing: '-0.01em' }}>
                {item.text}
              </text>
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}
