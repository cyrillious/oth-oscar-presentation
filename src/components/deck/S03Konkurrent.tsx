import { Slide } from './Slide'
import { MethodLayout } from './ui'
import { IlluCompetitor } from './illustrations'
import { FigCompetitor } from './figures/competitor/Figure'

export type S03KonkurrentProps = {
  /** Anatomy figure (isometric, live) or the earlier flat line illustration. */
  figur?: 'anatomie' | 'linie'
  illustration?: boolean
  side?: 'left' | 'right'
  /** Show what our content answers to each excuse. */
  answers?: boolean
  chrome?: boolean
}

const EXCUSES = [
  {
    quote: 'Mach ich am Wochenende selbst.',
    answer: 'Wir rechnen vor: ein Samstag gegen 5 Minuten.',
  },
  {
    quote: 'Lass ich halt dreckig.',
    answer: 'Wir zeigen, was Salz und Pollen mit dem Lack machen.',
  },
]

export function S03Konkurrent({ figur = 'anatomie', illustration = true, side = 'left', answers = true, chrome = true }: S03KonkurrentProps) {
  return (
    <Slide
      n={9}
      kicker="Methode 03 · The True Competitor"
      title="Der Gegner ist nicht die nächste Waschanlage. Es ist die Ausrede."
      source="Pip-Karte: The True Competitor"
      chrome={chrome}
    >
      <MethodLayout
        illustration={figur === 'anatomie' ? <FigCompetitor /> : <IlluCompetitor className="w-full" />}
        showIllustration={illustration}
        side={side}
        method="Wer nicht zu OSCAR fährt, wäscht selbst oder lässt das Auto dreckig. Diese Gewohnheit ist der Gegner."
        product="Content gegen die Ausrede"
      >
        {/* The excuse is what the audience reads (intro); our answer is the side note (body, mute). */}
        <div className="flex flex-col gap-[16px]">
          {EXCUSES.map((e) => (
            <div key={e.quote}>
              <p className="text-balance text-body">«{e.quote}»</p>
              {answers && <p className="mt-[4px] max-w-[52ch] text-pretty text-body text-mute">{e.answer}</p>}
            </div>
          ))}
        </div>
      </MethodLayout>
    </Slide>
  )
}
