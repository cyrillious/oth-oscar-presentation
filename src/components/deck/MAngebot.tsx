import { Slide } from './Slide'

export type MAngebotProps = {
  /** Price range per month under the lead. */
  price?: boolean
  chrome?: boolean
}

const POINTS = [
  { nr: '01', title: 'Monatlich fix', text: 'Ein fester Betrag pro Monat, planbar wie das Unlimited-Abo Ihrer Kundschaft.' },
  { nr: '02', title: 'Feste Lieferung', text: 'Rund 2 Videos pro Woche plus ein paar Posts. Hochwertig, aber handmade.' },
  { nr: '03', title: 'Partnerschaftlich', text: 'Massgeschneidert auf OSCAR. Wir lernen Anlage, Team und Kundschaft kennen und bleiben dran.' },
]

/**
 * Janick's slide 11, the offer: a content subscription. List layout of the skill (title left, entries right of
 * the axis, border-t rows). The first number is the slide's one signal accent.
 */
export function MAngebot({ price = true, chrome = true }: MAngebotProps) {
  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 pt-[40px]">
        <div className="col-span-5 flex flex-col">
          <p className="text-body text-mute">Das Angebot</p>
          <h2 className="mt-[16px] text-balance text-headline text-ink">Ein Content-Abo. So wie Ihr Wasch-Abo.</h2>
          <p className="mt-[24px] max-w-[36ch] text-pretty text-body text-mute">
            Statt einzelner Aufträge eine monatliche Zahlung für eine feste Content-Lieferung.
          </p>
          {price && (
            <p className="mt-auto border-t border-ink/10 pt-[16px] text-body text-mute">Preis pro Monat</p>
          )}
          {price && (
            <p className="mt-[8px] text-headline text-ink tabular-nums">CHF 3’000 bis 7’000</p>
          )}
        </div>
        <div className="col-span-6 col-start-7 self-start pl-4">
          <ol className="border-b border-ink/10">
            {POINTS.map((p, i) => (
              <li key={p.nr} className="grid grid-cols-[72px_1fr] border-t border-ink/10 py-[24px]">
                <span className={`text-body ${i === 0 ? 'text-signal' : 'text-mute'}`}>{p.nr}</span>
                <div>
                  <p className="text-headline text-ink">{p.title}</p>
                  <p className="mt-[8px] max-w-[40ch] text-pretty text-body text-mute">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Slide>
  )
}
