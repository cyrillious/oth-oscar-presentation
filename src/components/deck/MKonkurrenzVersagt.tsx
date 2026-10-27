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
    sketch: '/images/konkurrenz-sketch/plakate.webp',
    alt: 'Skizze: schiefes Plakat mit «-10 %», eine Person läuft vorbei.',
  },
  {
    label: 'Klischee 1',
    title: 'Der Technik-Erklärbär',
    text: 'Textilbürsten, Osmose-Wasser, Preistabellen und leere Hallen-Drohnenflüge.',
    sketch: '/images/konkurrenz-sketch/erklaerbaer.webp',
    alt: 'Skizze: Person mit Brille zeigt auf eine Tafel mit Bürste, Tropfen und Tabelle.',
  },
  {
    label: 'Klischee 2',
    title: 'Der Auto-Poser',
    text: 'Zeitlupen-Schaum auf schwarzem AMG oder Porsche, dazu aggressive Trap-Beats.',
    sketch: '/images/konkurrenz-sketch/poser.webp',
    alt: 'Skizze: Auto voller Schaum, Typ mit Sonnenbrille, Lautsprecher mit Noten.',
  },
]

/**
 * Why the competitors' marketing fails: three patterns as hover cards, three in a row with a 20px gap.
 * Each card carries a rough marker sketch (Higgsfield, styled on Janick's storyboard); transparent ink
 * lines that invert to paper when the card turns ink on hover.
 */
export function MKonkurrenzVersagt({ chrome = true }: MKonkurrenzVersagtProps) {
  return (
    <Slide title="Warum das Marketing der Konkurrenz an allen Standorten versagt." titleSpan={9} chrome={chrome}>
      <div className={`${CARDS} grid min-h-0 flex-1 grid-cols-3 gap-x-5`}>
        {PATTERNS.map((p) => (
          <div key={p.title} className={`${CARD} flex flex-col p-[32px]`}>
            <p className={`text-body ${CARD_FAINT}`}>{p.label}</p>
            <div className="grid min-h-0 flex-1 place-items-center py-[24px]">
              <img
                src={p.sketch}
                alt={p.alt}
                className="max-h-full w-full max-w-[340px] object-contain transition-[filter] duration-500 ease-frame group-hover/card:invert"
              />
            </div>
            <div>
              <p className={`text-balance text-headline ${CARD_INK}`}>{p.title}</p>
              <p className={`mt-[12px] max-w-[30ch] text-pretty text-body ${CARD_MUTE}`}>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}
