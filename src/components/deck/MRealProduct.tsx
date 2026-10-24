import { Slide } from './Slide'
import { Label, MethodLayout } from './ui'
import { IlluIceberg } from './illustrations'
import { FigRealProduct } from './figures/realproduct/Figure'

export type MRealProductProps = {
  /** Anatomy figure (isometric, live) or the earlier flat line illustration. */
  figur?: 'anatomie' | 'linie'
  illustration?: boolean
  side?: 'left' | 'right'
  chrome?: boolean
}

const REAL = ['Stolz aufs Auto', 'Zeit am Samstag', 'Ruhe dank Fixpreis']
const FEARS = ['«Gibt das Kratzer?»', '«Zahle ich zu viel?»', '«Muss ich warten?»']

export function MRealProduct({ figur = 'anatomie', illustration = true, side = 'right', chrome = true }: MRealProductProps) {
  const textLeft = illustration && side === 'right'
  return (
    <Slide
      n={10}
      kicker="Methode 04 · The Real Product & Find the Fear"
      title="Niemand kauft eine Wäsche. Man kauft das Gefühl danach, ohne Risiko davor."
      source="Pip-Karten: The Real Product · Find the Fear"
      chrome={chrome}
    >
      <MethodLayout
        illustration={figur === 'anatomie' ? <FigRealProduct /> : <IlluIceberg className="w-full" />}
        showIllustration={illustration}
        side={side}
        method="Die Wäsche ist nur die Spitze. Darunter liegt, was die Kundschaft wirklich will und wovor sie Angst hat."
        product="3 Gefühle, 3 Ängste, je ein Reel"
      >
        {/* Second column starts on a half-column line: the text column begins on the 80px margin
            when the figure is right, 16px right of the axis when it is left. */}
        <div className={`grid ${textLeft ? 'grid-cols-[360px_1fr]' : 'grid-cols-[344px_1fr]'}`}>
          {[
            { label: 'Das echte Produkt', items: REAL },
            { label: 'Die Angst davor', items: FEARS },
          ].map((col) => (
            <div key={col.label}>
              <Label>{col.label}</Label>
              <ul className="mt-[8px] flex flex-col gap-[4px]">
                {col.items.map((t) => (
                  <li key={t} className="text-pretty text-body">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MethodLayout>
    </Slide>
  )
}
