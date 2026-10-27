import { Slide } from './Slide'

export type MDrehplanProps = {
  chrome?: boolean
}

const FIGURES = [
  { value: '1', label: 'Drehtag pro Konzept' },
  { value: '2–4', label: 'Videos pro Drehtag' },
  { value: '2', label: 'Videos pro Woche online', signal: true },
]

/** Shooting plan as three key figures in col-span-4 each; the posting rhythm is the slide's one signal accent. */
export function MDrehplan({ chrome = true }: MDrehplanProps) {
  return (
    <Slide title="Shorts Drehplan" lead="Drei Konzepte, drei Drehtage: 6 bis 12 Videos, Stoff für 3 bis 6 Wochen." chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 content-end pb-[40px]">
        {FIGURES.map((f) => (
          <div key={f.label} className="col-span-4 border-t border-ink/10 pr-4 pt-[16px]">
            <p className={`text-display tabular-nums ${f.signal ? 'text-signal' : 'text-ink'}`}>{f.value}</p>
            <p className="mt-[16px] text-body text-mute">{f.label}</p>
          </div>
        ))}
      </div>
    </Slide>
  )
}
