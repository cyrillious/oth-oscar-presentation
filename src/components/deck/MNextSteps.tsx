import { Slide } from './Slide'
import { CARD, CARDS, CARD_FAINT, CARD_INK, Ph } from './ui'

export type MNextStepsProps = {
  /** Dark box with the next appointment. */
  appointment?: boolean
  chrome?: boolean
}

const STEPS = [
  { when: 'Woche 1', title: 'Workshop' },
  { when: 'Woche 2–3', title: 'Konzept' },
  { when: 'Nov.–Jan.', title: 'Pilot' },
  { when: 'Februar', title: 'Review' },
]

export function MNextSteps({ appointment = true, chrome = true }: MNextStepsProps) {
  return (
    <Slide n={13} tone="white" kicker="Nächste Schritte" title="In vier Schritten zum ersten Reel und zum Entscheid." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col gap-y-5">
        {/* Four step cards of col-span-3 with a 24px gutter. The first step is the current one:
            its dot is the slide's one signal accent. */}
        <div className={`${CARDS} grid-12 min-h-0 flex-1 gap-x-[24px]`}>
          {STEPS.map((s, i) => (
            <div key={s.title} className={`${CARD} col-span-3 flex flex-col justify-between p-[32px]`}>
              <p className={`flex items-center gap-[12px] text-body ${CARD_FAINT}`}>
                <span className={`size-[14px] rounded-full transition-colors duration-500 ease-frame ${i === 0 ? 'bg-signal' : 'bg-ink/20 group-hover/card:bg-paper/40'}`} />
                {s.when}
              </p>
              <div>
                <p className={`text-balance text-headline ${CARD_INK}`}>{s.title}</p>
              </div>
            </div>
          ))}
        </div>
        {appointment && (
          <div className="grid-12 shrink-0 items-center rounded-[12px] bg-ink py-[28px] text-paper">
            <div className="col-span-6 pl-[32px]">
              <p className="text-body text-paper/50">Nächster Termin</p>
              <p className="mt-[8px] text-headline">Workshop vereinbaren</p>
            </div>
            <div className="col-span-6 col-start-7 flex items-center justify-between gap-[24px] pl-4 pr-[28px]">
              <p className="text-body">
                <Ph>Datum und Ort</Ph>
              </p>
              <span className="inline-flex h-[48px] shrink-0 items-center rounded-full bg-paper px-[24px] text-body text-ink">
                oth.view × OSCAR
              </span>
            </div>
          </div>
        )}
      </div>
    </Slide>
  )
}
