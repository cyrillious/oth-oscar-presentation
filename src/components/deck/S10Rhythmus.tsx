import { Slide } from './Slide'

export type S10RhythmusProps = {
  /** Legend «Sie / Wir / Zusammen» above the timeline. */
  legend?: boolean
  chrome?: boolean
}

type Who = 'sie' | 'wir' | 'zusammen'

/** Bar styles: Sie = outlined, Wir = solid ink, Zusammen = signal red (the slide's one accent). */
const BAR: Record<Who, string> = {
  sie: 'bg-paper shadow-[inset_0_0_0_2px_var(--color-ink)]',
  wir: 'bg-ink',
  zusammen: 'bg-signal',
}

const LEGEND: { who: Who; label: string }[] = [
  { who: 'sie', label: 'Sie' },
  { who: 'wir', label: 'Wir' },
  { who: 'zusammen', label: 'Zusammen' },
]

/** Steps of one month. `from` and `to` are in weeks (0–4) on the timeline. */
const STEPS: { title: string; text: string; who: Who; from: number; to: number }[] = [
  { title: 'Themen und Skripte', text: 'Hooks und Shotlist pro Reel, passend zur Saison.', who: 'wir', from: 0, to: 0.75 },
  { title: 'Freigabe', text: 'Sie geben die Skripte frei, innert 48 Stunden.', who: 'sie', from: 0.75, to: 1 },
  { title: 'Drehtag', text: 'Ein Tag im Betrieb: 8–12 Clips plus B-Roll-Bank.', who: 'zusammen', from: 1, to: 1.5 },
  { title: 'Schnitt', text: 'Ein Dreh, fünf Kanäle, von Instagram bis Abo-Seite.', who: 'wir', from: 1.5, to: 2.6 },
  { title: 'Freigabe', text: 'Sie sehen jedes Reel, bevor es online geht.', who: 'sie', from: 2.6, to: 3 },
  { title: 'Publizieren und Report', text: 'Posten nach Plan, Report auf einer Seite.', who: 'wir', from: 3, to: 4 },
]

const WEEKS = [1, 2, 3, 4]

export function S10Rhythmus({ legend = true, chrome = true }: S10RhythmusProps) {
  return (
    <Slide n={6} kicker="So funktioniert es" title="Ein Monat, vier Wochen, ein Drehtag." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Legend left, week labels over the timeline. Weeks sit on the grid columns (240px each). */}
        <div className="grid-12 shrink-0 items-center pb-[14px] text-body">
          <div className="col-span-4 flex items-center gap-[28px]">
            {legend &&
              LEGEND.map((l) => (
                <span key={l.who} className="inline-flex items-center gap-[10px] text-ink">
                  <span className={`h-[12px] w-[36px] rounded-full ${BAR[l.who]}`} />
                  {l.label}
                </span>
              ))}
          </div>
          {WEEKS.map((w) => (
            <span key={w} className="col-span-2 pl-[12px] text-body text-mute">
              Woche {w}
            </span>
          ))}
        </div>

        <ol className="flex min-h-0 flex-1 flex-col">
          {STEPS.map((s, i) => (
            <li key={i} className="grid-12 min-h-0 flex-1 items-center border-t border-ink/10">
              <div className="col-span-4 pr-[32px]">
                <p className="text-body text-ink">{s.title}</p>
                <p className="mt-[4px] truncate text-body text-mute">{s.text}</p>
              </div>
              <div className="relative col-span-8 h-[12px]">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/[0.08]" />
                <span
                  className={`absolute inset-y-0 rounded-full ${BAR[s.who]}`}
                  style={{ left: `${(s.from / 4) * 100}%`, width: `${((s.to - s.from) / 4) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>

      </div>
    </Slide>
  )
}
