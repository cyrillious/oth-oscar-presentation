import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Slide } from './Slide'

export type MStrategieProps = {
  chrome?: boolean
}

// The core concept as a tension curve, like the dramaturgy of a film: it climbs from the fear through the
// story, drops the moment OSCAR enters and settles in the relief. No slide title, the panel takes the whole
// body: 1440 × 600 (12 columns of 120px).
const W = 1440
const H = 600

const NODE = {
  angst: { name: 'Angst', text: 'Grundangst der Kundschaft' },
  story: { name: 'Story', text: 'Content erzählt die Szene' },
  oscar: { name: 'OSCAR', text: 'Held, Helfer oder Insider' },
  relief: { name: 'Relief', text: 'Die Kundschaft atmet auf' },
}

const LINK = {
  a: 'baut Spannung auf',
  b: 'bringt OSCAR ins Bild',
  c: 'löst die Spannung',
  d: 'bleibt im Kopf',
}

// Reveal choreography (styles.css, `.strat`): the line draws at a constant speed, so every stop appears
// when the line reaches it. `f` is the share of the curve's length at that stop.
const DRAW_START = 0.5
const DRAW = 3.6
const reach = (f: number) => DRAW_START + DRAW * f

type Delay = { delay?: number }
const after = (delay = 0) => ({ '--d': `${delay}s` }) as CSSProperties
const at = (x: number, y: number, delay?: number): CSSProperties => ({ left: x, top: y, ...after(delay) })

const STOPS = [
  { x: 170, y: 470, from: 470, f: 0.016, r: 8 },
  { x: 496, y: 290, from: 300, f: 0.302, r: 8 },
  { x: 880, y: 110, from: 120, f: 0.631, r: 12 },
  { x: 1170, y: 470, from: 470, f: 1, r: 8 },
]

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
        <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
  )
}

/** Station centred on a point: name over a grey line of context. */
function Station({ x, y, n, signal = false, delay }: { x: number; y: number; n: keyof typeof NODE; signal?: boolean } & Delay) {
  return (
    <div data-p className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={at(x, y, delay)}>
      <p className={`text-headline ${signal ? 'text-signal' : 'text-ink'}`}>{NODE[n].name}</p>
      <p className="mt-[4px] whitespace-nowrap text-body text-mute">{NODE[n].text}</p>
    </div>
  )
}

function Tag({ x, y, children, className = 'text-body text-mute', delay }: { x: number; y: number; children: ReactNode; className?: string } & Delay) {
  return (
    <p data-p className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${className}`} style={at(x, y, delay)}>
      {children}
    </p>
  )
}

function Curve() {
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Spannungskurve: Die Spannung steigt von der Angst durch die Story, fällt mit OSCAR und löst sich im Relief">
        <Defs id="strategie-arrow" />
        <path data-p d="M100 40 V470 H1400" fill="none" stroke="var(--color-ink)" strokeOpacity="0.2" style={after(0)} />
        <path
          data-draw
          pathLength="1"
          d="M150 470 C400 470 580 110 880 110 C1010 110 1040 470 1170 470"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          style={after(DRAW_START)}
        />
        <path data-p d="M1170 470 H1380" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" markerEnd="url(#strategie-arrow)" style={after(reach(1) + 0.2)} />
        {STOPS.map(({ x, y, from, f, r }) => (
          <g key={x} style={after(reach(f) - 0.1)}>
            <path data-p d={`M${x} ${from} V500`} fill="none" stroke="var(--color-ink)" strokeOpacity="0.2" strokeDasharray="4 6" />
            <circle data-pop cx={x} cy={y} r={r} fill={r === 12 ? 'var(--color-signal)' : 'var(--color-paper)'} stroke={r === 12 ? undefined : 'var(--color-ink)'} strokeWidth="2" />
          </g>
        ))}
      </svg>
      <p data-p className="absolute text-body text-mute" style={at(124, 40, 0.2)}>Spannung</p>
      <Tag x={300} y={300} delay={reach(0.15)}>{LINK.a}</Tag>
      <Tag x={740} y={255} delay={reach(0.47)}>{LINK.b}</Tag>
      <Tag x={1190} y={250} delay={reach(0.84)}>{LINK.c}</Tag>
      <Tag x={1290} y={436} delay={reach(1) + 0.5}>{LINK.d}</Tag>
      <Station x={170} y={540} n="angst" delay={reach(0.016) - 0.2} />
      <Station x={496} y={540} n="story" delay={reach(0.302)} />
      <Station x={880} y={540} n="oscar" signal delay={reach(0.631)} />
      <Station x={1170} y={540} n="relief" delay={reach(1) - 0.1} />
    </>
  )
}

export function MStrategie({ chrome = true }: MStrategieProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(false)

  // Start once the panel is on screen, so the overview and the canvas don't spend it off-screen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setPlay(true)
        io.disconnect()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Slide n={5} kicker="Die Strategie" source="Strategie: Angst, Story, Relief" chrome={chrome}>
      <div ref={ref} data-play={play || undefined} className="strat relative mx-auto h-[600px] w-[1440px] shrink-0 overflow-hidden rounded-[12px] bg-stone">
        <Curve />
      </div>
    </Slide>
  )
}
