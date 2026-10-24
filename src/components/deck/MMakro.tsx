import { Slide } from './Slide'
import { CARD, CARDS, CARD_MUTE, SURFACE } from './ui'
import { MACRO, RESEARCH_DATE } from './competitors'

export type MMakroProps = {
  /** Closing line for OSCAR under the numbers. */
  lesson?: boolean
  chrome?: boolean
}

/**
 * Macro view after the single posts: the pattern in three numbers (skill layout 8 «Kennzahlen»:
 * three text-headline figures in col-span-4). The first figure is the slide's one signal accent.
 */
export function MMakro({ lesson = true, chrome = true }: MMakroProps) {
  return (
    <Slide
      kicker="Das Muster"
      title="Viel Anlass, kaum Antwort."
      source={`Je die letzten 12 Posts von Happy Car Wash und Autop & Stützliwösch · Stand ${RESEARCH_DATE}`}
      chrome={chrome}
    >
      <div className={`${CARDS} grid-12 min-h-0 flex-1 content-center gap-x-[24px]`}>
        {MACRO.map((m, i) => (
          <div key={m.value} className={`${CARD} col-span-4 flex min-h-[300px] flex-col justify-between p-[32px]`}>
            <p className={`origin-left text-headline tabular-nums transition-[color,scale] duration-500 ease-frame motion-safe:group-hover/card:scale-[1.06] ${i === 0 ? 'text-signal' : 'text-ink group-hover/card:text-paper'}`}>{m.value}</p>
            <p className={`max-w-[24ch] text-pretty text-body ${CARD_MUTE}`}>{m.label}</p>
          </div>
        ))}
      </div>
      {lesson && (
        <div className={`grid-12 shrink-0 items-baseline py-[28px] ${SURFACE}`}>
          <span className="col-span-4 pl-[32px] text-body text-mute">Für OSCAR</span>
          <span className="col-span-6 col-start-7 max-w-[30ch] text-balance pl-4 text-body text-ink">
            Wer die Ängste offen beantwortet, ist in der Region allein.
          </span>
        </div>
      )}
    </Slide>
  )
}
