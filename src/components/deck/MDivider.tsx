import { Slide } from './Slide'

export type MDividerProps = {
  /** The question or statement that opens the next part. */
  title?: string
  /** One sentence under the title. */
  lead?: string
  chrome?: boolean
}

/** Transition slide between two parts of the deck: one big question centred on the red stage, in the style of the slogan. */
export function MDivider({
  title = 'Was macht die Konkurrenz?',
  lead = 'Zwei Waschanlagen aus der Region, ihre Kanäle, Post für Post.',
  chrome = true,
}: MDividerProps) {
  return (
    <Slide chrome={chrome} lines={false} inverse background={<div aria-hidden="true" className="absolute inset-0 bg-signal" />}>
      <div className="grid-12 min-h-0 flex-1 content-center">
        <div className="col-span-12 text-center">
          <h2 className="text-balance text-display text-paper">{title}</h2>
          <p className="mx-auto mt-[32px] max-w-[40ch] text-pretty text-body text-paper/60">{lead}</p>
        </div>
      </div>
    </Slide>
  )
}
