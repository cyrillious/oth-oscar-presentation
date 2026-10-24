import { Slide } from './Slide'
import { Example, MethodLayout } from './ui'
import { IlluOnly } from './illustrations'
import { FigOnly } from './figures/only/Figure'

export type S04OnlyProps = {
  /** Anatomy figure (isometric, live) or the earlier flat line illustration. */
  figur?: 'anatomie' | 'linie'
  illustration?: boolean
  side?: 'left' | 'right'
  chrome?: boolean
}

const ITEMS = [
  'Jeden Tag waschen zum Fixpreis. Das bietet sonst niemand in der Region.',
  'Gratis saugen ohne Zeitlimit.',
  '3 Standorte, auch sonntags offen.',
]

export function S04Only({ figur = 'anatomie', illustration = true, side = 'right', chrome = true }: S04OnlyProps) {
  return (
    <Slide
      n={8}
      kicker="Methode 02 · Only Is Better Than Best"
      title="Nicht «die Beste». Sondern das, was es nur bei OSCAR gibt."
      source="Pip-Karte: Only Is Better Than Best"
      chrome={chrome}
    >
      <MethodLayout
        illustration={figur === 'anatomie' ? <FigOnly /> : <IlluOnly className="w-full" />}
        showIllustration={illustration}
        side={side}
        method="«Die Beste» sagt jede Anlage, und niemand glaubt es. «Nur bei OSCAR» lässt sich zeigen und nachrechnen."
        product="Beweis-Clips, je 15 Sekunden"
      >
        {ITEMS.map((e, i) => (
          <Example key={e} n={i + 1}>
            {e}
          </Example>
        ))}
      </MethodLayout>
    </Slide>
  )
}
