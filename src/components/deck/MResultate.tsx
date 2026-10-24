import { Slide } from './Slide'
import { CARD, CARDS, CARD_INK, CARD_MUTE, CARD_FAINT, Ph, SURFACE } from './ui'

export type MResultateProps = {
  /** Formula line under the three figures. */
  formula?: boolean
  chrome?: boolean
}

/** Same three steps as the sum: what the pilot costs, what one Abo is worth, when it pays off. */
const ROI = [
  { label: 'Investition Pilot', value: <Ph>CHF …</Ph>, text: 'Drei Monate in der Salz-Saison, ein Drehtag pro Monat.' },
  { label: 'Wert pro Abo', value: 'CHF 450–540', text: 'Pro Abo und Jahr. Aus dem Abo-Preis OSCAR Silber.' },
  { label: 'Break-even', value: <Ph>… Abos</Ph>, text: 'Ab dem nächsten Abo verdient OSCAR am Pilot.' },
]

/** ROI of the pilot: three figures on the grid (col-span-4 each), the last one is the slide's one signal accent. */
export function MResultate({ formula = true, chrome = true }: MResultateProps) {
  return (
    <Slide kicker="Resultate" title="Der Pilot rechnet sich mit wenigen Abos." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col gap-y-5">
        <div className={`${CARDS} grid-12 min-h-0 flex-1 content-center gap-x-[24px]`}>
          {ROI.map((r, i) => (
            <div
              key={r.label}
              className={`${CARD} col-span-4 flex min-h-[340px] flex-col justify-between p-[32px]`}
            >
              <p className={`text-body ${CARD_FAINT}`}>
                <span className="tabular-nums">0{i + 1}</span> · {r.label}
              </p>
              <div>
                <p
                  className={`origin-left text-headline tabular-nums transition-[color,scale] duration-500 ease-frame motion-safe:group-hover/card:scale-[1.06] ${i === 2 ? 'text-signal' : 'text-ink group-hover/card:text-paper'}`}
                >
                  {r.value}
                </p>
                <p className={`mt-[16px] max-w-[26ch] text-pretty text-body ${CARD_MUTE}`}>
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        {formula && (
          <div className={`grid-12 shrink-0 items-baseline py-[28px] ${SURFACE}`}>
            <span className="col-span-4 pl-[32px] text-body text-mute">So rechnen wir</span>
            <span className="col-span-8 pl-4 pr-[32px] text-body text-ink">Investition ÷ Wert pro Abo = Abos bis Break-even</span>
          </div>
        )}
      </div>
    </Slide>
  )
}
