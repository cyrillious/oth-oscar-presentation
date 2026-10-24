import { Slide } from './Slide'
import { Example, MethodLayout } from './ui'
import { IlluWeird } from './illustrations'
import { FigWeird } from './figures/weird/Figure'

export type MWeirdingProps = {
  /** Anatomy figure (isometric, live) or the earlier flat line illustration. */
  figur?: 'anatomie' | 'linie'
  illustration?: boolean
  side?: 'left' | 'right'
  chrome?: boolean
}

const EXAMPLES = [
  'Die Wäsche aus Sicht des Autos, nur mit Sound.',
  '30 Tage, ein Auto, jeden Tag gewaschen.',
  'Die Waschstrasse als Spa.',
]

export function MWeirding({ figur = 'anatomie', illustration = true, side = 'left', chrome = true }: MWeirdingProps) {
  return (
    <Slide
      n={7}
      kicker="Methode 01 · Weirding the Normal"
      title="Das Normale so zeigen, dass man zweimal hinschaut."
      source="Pip-Karte: Weirding the Normal"
      chrome={chrome}
    >
      <MethodLayout
        illustration={figur === 'anatomie' ? <FigWeird /> : <IlluWeird className="w-full" />}
        showIllustration={illustration}
        side={side}
        method="Alle zeigen die Wäsche gleich. Wir drehen den bekannten Alltag um einen Grad, und der Daumen stoppt."
        product="Reel-Serie «Ganz normal», 4 pro Monat"
      >
        {EXAMPLES.map((e, i) => (
          <Example key={e} n={i + 1}>
            {e}
          </Example>
        ))}
      </MethodLayout>
    </Slide>
  )
}
