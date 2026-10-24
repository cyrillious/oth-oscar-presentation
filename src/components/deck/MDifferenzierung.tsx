import { Slide } from './Slide'
import { CARD, CARDS, CARD_FAINT, CARD_INK, CARD_MUTE, CARD_RULE, SURFACE } from './ui'

export type MDifferenzierungProps = {
  /** Bottom strip: the gap in the market that the differentiation builds on. */
  gap?: boolean
  chrome?: boolean
}

/** Core differentiation in three moves. Each one is also a step towards the Abo. */
const MOVES = [
  {
    label: 'Sagen',
    title: 'Die Angst beim Namen nennen.',
    text: 'Kratzer, Preis, Warten, Sauberkeit, Umwelt: pro Reel eine Angst, offen beantwortet. Die Konkurrenz schweigt dazu.',
    conversion: 'Die Frage ist weg, bevor sie jemand stellt.',
  },
  {
    label: 'Zeigen',
    title: 'Beweisen statt behaupten.',
    text: 'Textil-Lappen in Nahaufnahme, Fixpreis am Display, die Schlange live. Was nur OSCAR hat, kommt ins Bild.',
    conversion: 'Wer es gesehen hat, glaubt es.',
  },
  {
    label: 'Abschliessen',
    title: 'Vom Reel direkt zum Abo.',
    text: 'Jeder Beitrag endet auf der Abo-Seite. Die Angst ist weg, jetzt braucht es nur noch einen Klick.',
    conversion: 'Aus Aufmerksamkeit wird ein Abschluss.',
  },
]

/** Three columns of col-span-4. The first move is the slide's one signal accent. */
export function MDifferenzierung({ gap = true, chrome = true }: MDifferenzierungProps) {
  return (
    <Slide kicker="Differenzierung" title="OSCAR ist die Waschanlage, die jede Angst offen beantwortet." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col gap-y-5">
        <div className={`${CARDS} grid-12 min-h-0 flex-1 content-center gap-x-[24px]`}>
          {MOVES.map((m, i) => (
            <div key={m.label} className={`${CARD} col-span-4 flex flex-col p-[32px]`}>
              <p className={`text-body ${i === 0 ? 'text-signal' : CARD_FAINT}`}>
                <span className="tabular-nums">0{i + 1}</span> · {m.label}
              </p>
              <p className={`mt-[16px] max-w-[16ch] text-balance text-headline ${CARD_INK}`}>{m.title}</p>
              <p className={`mt-[16px] mb-[24px] max-w-[30ch] text-pretty text-body ${CARD_MUTE}`}>{m.text}</p>
              <p className={`mt-auto max-w-[30ch] border-t pt-[16px] text-pretty text-body ${CARD_RULE} ${CARD_INK}`}>{m.conversion}</p>
            </div>
          ))}
        </div>
        {gap && (
          <div className={`grid-12 shrink-0 items-baseline py-[28px] ${SURFACE}`}>
            <span className="col-span-4 pl-[32px] text-body text-mute">Warum das trägt</span>
            <span className="col-span-8 pl-4 pr-[32px] text-pretty text-body text-ink">
              Von 24 Konkurrenz-Posts nimmt genau einer eine Angst auf. Das Feld gehört dem, der zuerst antwortet.
            </span>
          </div>
        )}
      </div>
    </Slide>
  )
}
