import { Slide } from './Slide'
import { CARD, CARDS, CARD_FAINT, CARD_INK, CARD_MUTE } from './ui'

export type MDreiAengsteProps = {
  /** «angst»: the three customer fears (Janick, slide 4). «loesung»: how OSCAR takes each one away (slide 5). */
  view?: 'angst' | 'loesung'
  chrome?: boolean
}

type Fear = {
  area: string
  angst: { head: string; text: string }
  loesung: { head: string; text: string }
}

const FEARS: Fear[] = [
  {
    area: 'Das Soziale',
    angst: { head: '«Was denken die anderen?»', text: 'Ein schmutziges Auto ist peinlich. Vor dem Date, vor Kunden, vor Kollegen.' },
    loesung: { head: 'Immer vorzeigbar.', text: 'Mit dem Abo ist das Auto jederzeit sauber, auch wenn es spontan wird. Keine Peinlichkeit mehr.' },
  },
  {
    area: 'Das Finanzielle',
    angst: { head: '«Lohnt sich das Abo?»', text: 'Kostet das zu viel? Wer nicht weiss, wie oft er wäscht, rechnet lange hin und her.' },
    loesung: { head: 'Ein fixer Preis.', text: 'Das Abo gibt Kostensicherheit: ein Betrag pro Monat. Silber lohnt sich schon ab 2 Wäschen.' },
  },
  {
    area: 'Die Zeit',
    angst: { head: '«Keine Zeit dafür.»', text: 'Autowaschen fällt immer hinten runter. Zeit ist wertvoller als Geld.' },
    loesung: { head: 'In 8 Minuten durch.', text: 'Rein, durch, weiter. Die Anlage ist schnell, die Zeit bleibt beim Kunden.' },
  },
]

/**
 * Janick's slides 4 and 5 on one layout: three cards (col-span-4, 24px gutter), one per fear. The «angst» view
 * names the fear as the customer would say it, the «loesung» view answers it on the same card, so the two slides
 * read as a before/after. The social fear (the hidden one from «Find the Fear») carries the slide's one signal dot.
 */
export function MDreiAengste({ view = 'angst', chrome = true }: MDreiAengsteProps) {
  const solved = view === 'loesung'
  return (
    <Slide
      title={solved ? 'Die Lösung: OSCAR nimmt alle drei.' : 'Drei Ängste halten Kunden von der Waschstrasse fern.'}
      lead={solved ? 'Kostensicherheit durch das Abo, Zeitersparnis durch Tempo, keine Peinlichkeit mehr.' : undefined}
      chrome={chrome}
    >
      <div className={`${CARDS} grid-12 min-h-0 flex-1 gap-x-[24px] pb-[8px]`}>
        {FEARS.map((f, i) => {
          const c = solved ? f.loesung : f.angst
          return (
            <div key={f.area} className={`${CARD} col-span-4 flex flex-col justify-between p-[32px]`}>
              <p className={`flex items-center gap-[12px] text-body ${CARD_FAINT}`}>
                <span className={`size-[14px] rounded-full transition-colors duration-500 ease-frame ${i === 0 ? 'bg-signal' : 'bg-ink/20 group-hover/card:bg-paper/40'}`} />
                {f.area}
              </p>
              <div>
                <p className={`text-balance text-headline ${CARD_INK}`}>{c.head}</p>
                <p className={`mt-[16px] max-w-[30ch] text-pretty text-body ${CARD_MUTE}`}>{c.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Slide>
  )
}
