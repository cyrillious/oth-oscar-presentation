import { Slide } from './Slide'

export type MEndeProps = {
  /** The closing line. */
  line?: string
  chrome?: boolean
}

/** Closing slide: the red stage, the invitation in paper white, display size, centred. */
export function MEnde({ line = 'Let’s create something.', chrome = true }: MEndeProps) {
  return (
    <Slide chrome={chrome} lines={false} inverse background={<div aria-hidden="true" className="absolute inset-0 bg-signal" />}>
      <div className="grid-12 min-h-0 flex-1 content-center pb-[80px]">
        <h2 className="col-span-12 text-balance text-center text-display text-paper">{line}</h2>
      </div>
    </Slide>
  )
}
