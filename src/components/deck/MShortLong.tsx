import { Slide } from './Slide'

export type MShortLongProps = {
  chrome?: boolean
}

const SIDES = [
  {
    label: 'Bis hier: Short Form',
    head: 'Sketche holen Aufmerksamkeit.',
    text: '15 bis 60 Sekunden, zwei pro Woche, auf Social Media. Man lacht, erkennt sich wieder, und OSCAR bleibt im Kopf.',
  },
  {
    label: 'Ab hier: Long Form',
    head: 'Der Imagefilm baut Vertrauen auf.',
    text: 'Zwei bis drei Minuten, ein Film im Jahr. Wer OSCAR eine ganze Geschichte lang zuschaut, glaubt der Marke. Und wer der Marke glaubt, löst das Abo.',
  },
]

/**
 * Transition between the shorts (sketches, scripts) and the hero content (image films) on the red stage, like
 * MDivider: Short Form left of the axis, Long Form right of it, a hairline between them. The right side says
 * what the long form is for: trust, the step before the subscription.
 */
export function MShortLong({ chrome = true }: MShortLongProps) {
  return (
    <Slide
      title="Von Short Form zu Long Form."
      titleSpan={12}
      chrome={chrome}
      lines={false}
      inverse
      background={<div aria-hidden="true" className="absolute inset-0 bg-signal" />}
    >
      <div className="grid-12 min-h-0 flex-1 content-center">
        {SIDES.map((s, i) => (
          <div key={s.label} className={i === 0 ? 'col-span-6 pr-[48px]' : 'col-span-6 col-start-7 border-l border-paper/30 pl-[48px]'}>
            <p className="text-body text-paper/60">{s.label}</p>
            <p className="mt-[16px] text-balance text-headline text-paper">{s.head}</p>
            <p className="mt-[24px] max-w-[36ch] text-pretty text-body text-paper/80">{s.text}</p>
          </div>
        ))}
      </div>
    </Slide>
  )
}
