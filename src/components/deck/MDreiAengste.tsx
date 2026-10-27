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
    angst: { head: '«Was denken die anderen?»', text: 'Niemand will, dass Dates, Kunden oder Kollegen in ein verkrümeltes, schmutziges Auto steigen.' },
    loesung: { head: 'Immer vorzeigbar.', text: 'Mit dem Abo ist das Auto jederzeit sauber, auch wenn es spontan wird. Keine Peinlichkeiten mehr.' },
  },
  {
    area: 'Das Finanzielle',
    angst: { head: '«Lohnt sich das Abo?»', text: 'Wer nicht weiss, wie oft er wäscht, rechnet lange hin und her. Und lässt es am Ende lieber bleiben.' },
    loesung: { head: 'Ein fixer Preis.', text: 'Ein Betrag pro Monat, fertig gerechnet. Silber lohnt sich schon ab zwei Wäschen.' },
  },
  {
    area: 'Die Zeit',
    angst: { head: '«Keine Zeit dafür.»', text: 'Keine Zeit heisst meist: keine Motivation. Autowaschen rutscht immer ans Ende der Liste, Zeit ist wertvoller als Geld.' },
    loesung: { head: 'In 3 Minuten.', text: 'Rein, durch, weiter. Drei Minuten in der Anlage, der Rest des Tages gehört dem Kunden.' },
  },
]

/**
 * Janick's slides 4 and 5 on one layout: three cards (col-span-4, 24px gutter), one per fear. The «angst» view
 * names the fear as the customer would say it, the «loesung» view answers it on the same card, so the two slides
 * read as a before/after. All three dots are signal red: OSCAR answers every one of them.
 */
export function MDreiAengste({ view = 'angst', chrome = true }: MDreiAengsteProps) {
  const solved = view === 'loesung'
  return (
    <Slide
      title={solved ? 'OSCAR spricht alle drei an.' : 'Darum gehen Leute nicht in die Waschstrasse.'}
      lead={solved ? 'Kostensicherheit durch das Abo, Zeitersparnis durch Tempo, keine Peinlichkeiten mehr.' : undefined}
      chrome={chrome}
    >
      <div className={`${CARDS} grid-12 min-h-0 flex-1 gap-x-[24px] pb-[8px]`}>
        {FEARS.map((f) => {
          const c = solved ? f.loesung : f.angst
          return (
            <div key={f.area} className={`${CARD} col-span-4 flex flex-col justify-between p-[32px]`}>
              <p className={`flex items-center gap-[12px] text-body ${CARD_FAINT}`}>
                <span className="size-[14px] rounded-full bg-signal" />
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
