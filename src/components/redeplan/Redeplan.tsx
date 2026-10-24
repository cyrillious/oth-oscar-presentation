import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { REDEPLAN, type DotColor, type Ear, type PlanItem, type Redeplan as Plan } from './redeplan-data'

// Speech plan for the pitch, built with the Redewerkstatt (redewerksttt.vercel.app/werkstatt).
// Step colours are the tool's own legend, so the plan reads the same as in the Werkstatt.

const DOT: Record<DotColor, string> = {
  green: '#7EAC94',
  orange: '#EC6A3F',
  pink: '#F2BFCB',
  blue: '#88B2DB',
  yellow: '#F6CE2B',
  navy: '#3D5A99',
  black: '#232323',
}

const EARS: { id: Ear; name: string; question: string }[] = [
  { id: 'sache', name: 'Sache', question: 'Worüber informiere ich?' },
  { id: 'appell', name: 'Appell', question: 'Wozu will ich bewegen?' },
  { id: 'selbst', name: 'Selbstkundgabe', question: 'Was zeige ich von mir?' },
  { id: 'beziehung', name: 'Beziehung', question: 'Wie stehen wir zueinander?' },
]
const LEVELS = ['schwach', 'mittel', 'stark']
const CHECK = { erreicht: 'Ziel erreicht', nah: 'Nah am Ziel', offen: 'Noch offen' }

/** Names for suggested patterns that the plan does not use. */
const PATTERN_NAMES: Record<string, string> = {
  standpunkt: 'Standpunkt-Formel',
  'ist-soll-weg': 'Ist, Soll, Weg',
  aida: 'AIDA',
  popp: 'POPP-Pitch',
  klimax: 'Klimax',
}

export type RedeplanProps = {
  /** Show the speaker text under each step, or the structure only. */
  showText?: boolean
  /** Show the Werkstatt's pattern suggestions at the end. */
  showSuggestions?: boolean
}

export function Redeplan({ showText = true, showSuggestions = true }: RedeplanProps) {
  const plan = REDEPLAN
  const steps = plan.items.filter((i) => i.kind === 'step')
  const chain = [...new Set(plan.items.filter((i) => i.kind === 'step' && i.depth === 0).map((i) => i.patternName))]

  return (
    <main className="min-h-dvh bg-paper pb-28">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <img src="/images/oscarwash-logo.svg" alt="OSCAR wash.ch" className="h-[15px] w-auto" />
            <span className="truncate text-small text-mute">oth.view · Redeplan zum Pitch</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/redeplan-oscar.md"
              download
              className={`${PILL} bg-hairline text-ink hover:bg-ink/10`}
            >
              Als Markdown
            </a>
            <Link to="/" className={`${PILL} bg-ink text-paper hover:bg-ink/85`}>
              Zu den Folien
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-6 md:px-10">
        <section className="pt-16 md:pt-24">
          <p className="text-small text-mute">Kernbotschaft</p>
          <h1 className="mt-5 max-w-[36ch] text-balance text-headline text-ink">
            {plan.core}
          </h1>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/10 pt-6 md:grid-cols-4">
            <Fact term="Für">{plan.audience}</Fact>
            <Fact term="Muster-Kette">{chain.join(' → ')}</Fact>
            <Fact term="Aufbau">
              {plan.stats.patterns} Muster, {plan.stats.steps} Schritte
            </Fact>
            <Fact term="Sprechtext-Gerüst">
              {plan.stats.words} Wörter, rund {plan.stats.time} Min.
            </Fact>
          </dl>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-2">
          <EarsCheck plan={plan} />
          <TensionArc items={steps} hints={plan.hints} />
        </section>

        <section className="mt-20">
          <SectionHead title="Ablauf" note="Jeder Schritt mit Folien, Spannung und Sprechtext. Eingerückt: eingebettete Muster." />
          <Flow items={plan.items} patterns={plan.patterns} showText={showText} />
        </section>

        {showSuggestions && (
          <section className="mt-20">
            <SectionHead title="Was die Werkstatt vorschlägt" note={plan.summary} />
            <ol className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {plan.suggestions.map((s, i) => {
                const used = plan.items.some((it) => it.patternId === s.patternId)
                return (
                  <li key={s.patternId} className="flex items-baseline gap-5 py-4">
                    <span className="w-6 shrink-0 text-small text-mute tabular-nums">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="text-body text-ink">{PATTERN_NAMES[s.patternId] ?? plan.patterns[s.patternId]?.name ?? s.patternId}</span>
                      <span className="ml-3 text-body text-mute">{s.reason}</span>
                    </span>
                    {used && <span className="shrink-0 rounded-full bg-ink/[0.06] px-3 py-1 text-small text-ink">im Plan</span>}
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        <footer className="mt-16 max-w-[68ch] text-pretty text-small text-mute">
          Gebaut mit der{' '}
          <a href="https://redewerksttt.vercel.app/werkstatt" className="underline decoration-ink/20 underline-offset-4 transition-colors duration-300 ease-frame hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
            Redewerkstatt
          </a>
          : Vier-Ohren-Check nach Schulz von Thun, Muster-Vorschläge und Spannungsbogen stammen aus dem Tool. Sprechtext nach den Speaker Notes der
          Folien.
        </footer>
      </div>
    </main>
  )
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-small text-mute">{term}</dt>
      <dd className="mt-1.5 text-pretty text-body text-ink">{children}</dd>
    </div>
  )
}

function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:items-baseline">
      <h2 className="text-balance text-headline text-ink md:col-span-6 md:pr-8">{title}</h2>
      {note && <p className="max-w-[30ch] text-pretty text-intro text-mute md:col-span-6 md:col-start-7 md:pl-4">{note}</p>}
    </div>
  )
}

const PILL =
  'inline-flex h-10 items-center rounded-full px-4 text-small transition-colors duration-300 ease-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-paper'

const CARD = 'rounded-[12px] bg-stone p-6 md:p-7'

function EarsCheck({ plan }: { plan: Plan }) {
  return (
    <div className={CARD}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="text-title text-ink">Vier-Ohren-Check</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-small ${plan.check === 'erreicht' ? 'bg-ink text-paper' : 'bg-ink/[0.06] text-ink'}`}>
          {CHECK[plan.check]}
        </span>
      </div>
      <ul className="mt-8 flex flex-col gap-4">
        {EARS.map((ear) => (
          <li key={ear.id} className="grid grid-cols-[minmax(0,1fr)_132px] items-center gap-4">
            <div className="min-w-0">
              <p className="text-body text-ink">{ear.name}</p>
              <p className="text-small text-mute">{ear.question}</p>
            </div>
            <Meter ist={plan.ist[ear.id]} soll={plan.soll[ear.id]} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-6 text-small text-mute">
        <span className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-ink" /> Satz heute
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full ring-1 ring-ink/50 ring-offset-2 ring-offset-stone" /> Ziel
        </span>
      </div>
      {plan.earlier.length > 0 && (
        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="text-small text-mute">Erste Fassung</p>
          <p className="mt-1.5 max-w-[52ch] text-pretty text-body text-mute">{plan.earlier[0]}</p>
          {plan.change && <p className="mt-3 max-w-[52ch] text-pretty text-body text-ink">{plan.change}</p>}
        </div>
      )}
    </div>
  )
}

/** Three segments: filled up to «ist», outlined up to «soll». */
function Meter({ ist, soll }: { ist: number; soll: number }) {
  return (
    <div className="flex gap-2" aria-label={`${LEVELS[ist]}, Ziel ${LEVELS[soll]}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2 flex-1 rounded-full ${i <= ist ? 'bg-ink' : 'bg-ink/[0.08]'} ${i <= soll ? 'ring-1 ring-ink/50 ring-offset-2 ring-offset-stone' : ''}`}
        />
      ))}
    </div>
  )
}

/** Tension per step, like the Werkstatt's arc: 1 at the bottom, 5 at the top, dashed line between top-level blocks. */
function TensionArc({ items, hints }: { items: PlanItem[]; hints: string[] }) {
  const W = 560
  const H = 210
  const padX = 22
  const top = 26
  const bottom = 176
  const n = items.length
  const x = (i: number) => padX + (i * (W - padX * 2)) / Math.max(1, n - 1)
  const y = (t: number) => bottom - ((t - 1) / 4) * (bottom - top)
  const peak = Math.max(...items.map((s) => s.tension))
  const peakAt = items.findIndex((s) => s.tension === peak)
  const breaks = items.flatMap((s, i) => (i > 0 && s.block !== items[i - 1].block ? [(x(i) + x(i - 1)) / 2] : []))

  return (
    <div className={CARD}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="text-title text-ink">Spannungsbogen</h3>
        <span className="shrink-0 text-small text-mute">Spannung 1 bis 5</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-auto w-full" role="img" aria-label="Spannung pro Schritt">
        {[1, 2, 3, 4, 5].map((t) => (
          <line key={t} x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} className="stroke-ink/[0.06]" />
        ))}
        {breaks.map((bx) => (
          <line key={bx} x1={bx} x2={bx} y1={top - 14} y2={bottom + 6} className="stroke-ink/25" strokeDasharray="3 4" />
        ))}
        <polyline
          points={items.map((s, i) => `${x(i)},${y(s.tension)}`).join(' ')}
          fill="none"
          className="stroke-ink"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {items.map((s, i) => (
          <g key={s.key}>
            {i === peakAt && <circle cx={x(i)} cy={y(s.tension)} r={11} fill="none" stroke="var(--color-signal)" strokeWidth={1.5} />}
            <circle cx={x(i)} cy={y(s.tension)} r={s.depth > 0 ? 4.5 : 6} fill={DOT[s.dot]} className="stroke-stone" strokeWidth={1.5} />
            <text x={x(i)} y={H - 6} textAnchor="middle" className="fill-mute text-micro tabular-nums">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      {hints.map((h) => (
        <p key={h} className="mt-3 max-w-[52ch] text-pretty text-body text-ink">
          {h}
        </p>
      ))}
    </div>
  )
}

function Flow({ items, patterns, showText }: { items: PlanItem[]; patterns: Plan['patterns']; showText: boolean }) {
  let stepNo = 0
  let blockNo = 0
  return (
    <ol className="mt-10">
      {items.map((it, idx) => {
        const prev = items[idx - 1]
        if (it.kind === 'bridge') {
          return (
            <li key={it.key} className="mt-4 grid grid-cols-[28px_minmax(0,1fr)] gap-x-5 border-t border-dashed border-ink/15 py-8 md:grid-cols-[56px_minmax(0,1fr)_132px]">
              <div className="col-start-2 min-w-0">
                <p className="text-small text-mute">Übergang</p>
                <p className="mt-2 max-w-[36ch] text-balance font-serif text-title italic text-ink">«{it.text}»</p>
              </div>
              <span className="col-start-2 mt-3 text-small text-mute tabular-nums md:col-start-3 md:mt-0 md:text-right">Folie {it.slides}</span>
            </li>
          )
        }
        stepNo++
        const prevStep = items.slice(0, idx).filter((p) => p.kind === 'step').pop()
        const newBlock = it.depth === 0 && (!prevStep || prevStep.block !== it.block)
        const newEmbed = it.depth > 0 && (!prev || prev.patternName !== it.patternName)
        if (newBlock) blockNo++
        const pattern = it.patternId ? patterns[it.patternId] : undefined
        return (
          <li key={it.key}>
            {newBlock && pattern && (
              <div className={`grid gap-x-5 pb-6 pt-12 md:grid-cols-[56px_minmax(0,1fr)] ${blockNo > 1 ? '' : 'border-t border-ink/10'}`}>
                <span className="text-small text-mute tabular-nums md:pt-3">{String(blockNo).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="text-title text-ink">{pattern.name}</h3>
                    <span className="text-small text-mute">{pattern.origin}</span>
                  </div>
                  <p className="mt-3 max-w-[60ch] text-pretty text-prose text-mute">{pattern.description}</p>
                </div>
              </div>
            )}
            {newEmbed && pattern && (
              <div className="ml-[28px] border-l border-ink/10 pl-6 pt-4 md:ml-[76px]">
                <p className="max-w-[68ch] text-pretty text-small text-mute">
                  Eingebettet: <span className="text-ink">{pattern.name}</span> · {pattern.description}
                </p>
              </div>
            )}
            <Step item={it} n={stepNo} showText={showText} />
          </li>
        )
      })}
    </ol>
  )
}

function Step({ item, n, showText }: { item: PlanItem; n: number; showText: boolean }) {
  const cut = item.label.indexOf(': ')
  const title = cut > 0 ? item.label.slice(0, cut) : item.label
  const detail = cut > 0 ? item.label.slice(cut + 2) : ''
  const nested = item.depth > 0
  return (
    <div className={`grid grid-cols-[28px_minmax(0,1fr)] gap-x-5 py-4 md:grid-cols-[56px_minmax(0,1fr)_132px] ${nested ? 'ml-[28px] border-l border-ink/10 pl-6 md:ml-[76px]' : ''}`}>
      <span className="flex h-[22px] items-center gap-2 self-start">
        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: DOT[item.dot] }} />
        <span className="text-small text-mute tabular-nums">{n}</span>
      </span>
      <div className="min-w-0">
        <p className="text-body">
          <span className="text-ink">{/^\d+$/.test(item.mark) ? '' : `${item.mark} · `}{title}</span>
          {detail && <span className="text-mute"> · {detail}</span>}
        </p>
        {showText && <p className="mt-2 max-w-[60ch] text-pretty text-prose text-ink">{item.text}</p>}
      </div>
      <div className="col-start-2 mt-3 flex items-center gap-4 md:col-start-auto md:mt-0 md:flex-col md:items-end md:gap-2 md:pt-[3px]">
        <span className="text-small text-mute tabular-nums">Folie {item.slides}</span>
        <Pips value={item.tension} />
      </div>
    </div>
  )
}

function Pips({ value }: { value: number }) {
  return (
    <span className="flex gap-[3px]" aria-label={`Spannung ${value} von 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-3 w-[5px] rounded-full ${i <= value ? (value === 5 ? 'bg-signal' : 'bg-ink') : 'bg-ink/[0.08]'}`} />
      ))}
    </span>
  )
}
