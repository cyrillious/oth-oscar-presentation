import { Slide } from './Slide'
import { CARD, CARDS, CARD_FAINT, CARD_INK, CARD_MUTE } from './ui'

export type MKonkurrenzVersagtProps = {
  chrome?: boolean
}

const PATTERNS = [
  {
    label: 'Plakate',
    title: 'Rein transaktional',
    text: '«10 % Frühlingsrabatt», Punkte sammeln. Kein Video-Storytelling, null Emotion.',
  },
  {
    label: 'Klischee 1',
    title: 'Der Technik-Erklärbär',
    text: 'Textilbürsten, Osmose-Wasser, Preistabellen und leere Hallen-Drohnenflüge.',
  },
  {
    label: 'Klischee 2',
    title: 'Der Auto-Poser',
    text: 'Zeitlupen-Schaum auf schwarzem AMG oder Porsche, dazu aggressive Trap-Beats.',
  },
]

/** Why the competitors' marketing fails: three patterns as hover cards, three in a row with a 20px gap. */
export function MKonkurrenzVersagt({ chrome = true }: MKonkurrenzVersagtProps) {
  return (
    <Slide title="Warum das Marketing der Konkurrenz an allen Standorten versagt." titleSpan={9} chrome={chrome}>
      <div className={`${CARDS} grid min-h-0 flex-1 grid-cols-3 gap-x-5`}>
        {PATTERNS.map((p) => (
          <div key={p.title} className={`${CARD} flex flex-col p-[32px]`}>
            <p className={`text-body ${CARD_FAINT}`}>{p.label}</p>
            <div className="mt-auto">
              <p className={`text-balance text-headline ${CARD_INK}`}>{p.title}</p>
              <p className={`mt-[12px] max-w-[30ch] text-pretty text-body ${CARD_MUTE}`}>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}
