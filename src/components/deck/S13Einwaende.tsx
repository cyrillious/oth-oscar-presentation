import { Slide } from './Slide'
import { Ph } from './ui'

export type S13EinwaendeProps = {
  /** Third column: what the answer rests on. */
  proof?: boolean
  chrome?: boolean
}

const ROWS = [
  {
    q: 'Kratzer?',
    a: 'Die Textil-Lappen zeigen und anfassen lassen.',
    p: 'Textil-Waschanlagen. Wir sagen «schonend», nie «kratzfrei».',
  },
  { q: 'Kosten?', a: 'Preis nennen: ab 37.50 im Monat.', p: 'Silber im Jahresabo, 1 Wäsche pro Tag.' },
  { q: 'Warten?', a: 'Kapazität zeigen: bis 150 Autos pro Stunde in Emmen.', p: 'Keine Wartezeiten versprechen, nur die Kapazität nennen.' },
  { q: 'Umwelt?', a: <Ph>nur falls belegt</Ph>, p: <Ph>Wasserrückgewinnung, falls zutreffend</Ph> },
]

// Table on the half-column grid: Einwand | Antwort (ends on the axis) | Beleg (right of the axis).
// Without the proof column it becomes the skill's «Label + Text» pattern.
export function S13Einwaende({ proof = true, chrome = true }: S13EinwaendeProps) {
  const col = proof
    ? { q: 'col-span-2', a: 'col-span-4 col-start-3 pr-[20px]', p: 'col-span-5 col-start-7 pl-4' }
    : { q: 'col-span-4', a: 'col-span-6 col-start-7 pl-4', p: '' }
  return (
    <Slide
      n={13}
      kicker="Einwände direkt beantworten"
      title="Wir beantworten Einwände, bevor sie jemand stellt."
      source="Pip-Karte: Red Team"
      chrome={chrome}
    >
      <div className="flex flex-1 flex-col">
        <div className="grid-12 pb-[12px] text-body text-mute">
          <span className={col.q}>Einwand</span>
          <span className={col.a}>Antwort im Content</span>
          {proof && <span className={col.p}>Beleg</span>}
        </div>
        <div className="flex flex-1 flex-col">
          {ROWS.map((r) => (
            <div key={r.q} className="grid-12 flex-1 items-baseline border-t border-ink/10 pt-[20px]">
              <span className={`${col.q} text-headline text-ink`}>«{r.q}»</span>
              <span className={`${col.a} max-w-[30ch] text-pretty text-body text-ink`}>{r.a}</span>
              {proof && <span className={`${col.p} max-w-[44ch] text-pretty text-body text-mute`}>{r.p}</span>}
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}
