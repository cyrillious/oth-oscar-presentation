import { Slide } from './Slide'
import { Tag } from './ui'

export type S08HooksProps = {
  /** Small line under each hook: how it resolves, or for whom it holds. */
  notes?: boolean
  chrome?: boolean
}

const HOOKS = [
  { type: 'Rätsel', hook: 'Warum dein Auto 2 Tage nach der Wäsche wieder dreckig ist …', note: 'Auflösung: Unlimited, jeden Tag waschen zum Fixpreis.' },
  { type: 'Gegenthese', hook: 'Wasch dein Auto im Winter NICHT wie im Sommer.', note: 'Salz und Unterboden. Unterbodenwäsche ist in All In enthalten.' },
  { type: 'POV Saison', hook: 'POV: Erste Salzwoche, und an der Tür klebt schon die Kruste.', note: 'Vorher zeigen, nachher zeigen.' },
  { type: 'Rechnung', hook: '2 Wäschen im Monat, und das Abo hat sich bezahlt.', note: 'Gilt für Silber und das Jahresabo. Silber: 2 × 26.– = 52.– bar, Abo 45.– oder 37.50.' },
  { type: 'Saugen', hook: 'Wir stoppen hier nicht die Zeit.', note: 'Gratis saugen nach jeder Wäsche, ohne Zeitlimit.' },
]

// Skill layout 9 «Liste», full width: number and type in half-columns 1–2, the hook from
// half-column 3. The first hook (Rätsel) carries the one signal accent: we test it first.
export function S08Hooks({ notes = true, chrome = true }: S08HooksProps) {
  return (
    <Slide n={8} kicker="Hook-Bank" title="Fünf Hooks, die wir gegeneinander testen." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col">
        {HOOKS.map((h, i) => (
          <div key={h.type} className="grid-12 flex-1 content-center items-baseline border-t border-ink/10">
            <div className="col-span-2 flex items-baseline gap-[16px]">
              <span className="text-body text-mute tabular-nums">0{i + 1}</span>
              <Tag tone={i === 0 ? 'red' : 'grey'}>{h.type}</Tag>
            </div>
            <div className="col-span-10 col-start-3">
              <p className="text-pretty text-headline text-ink">«{h.hook}»</p>
              {notes && <p className="mt-[4px] text-body text-mute">{h.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}
