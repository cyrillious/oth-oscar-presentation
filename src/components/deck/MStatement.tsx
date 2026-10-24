import { Slide } from './Slide'

export type MStatementProps = {
  /** The one sentence of the slide, in display size. A line break in the text starts a new line. */
  text?: string
  chrome?: boolean
}

/** Opening statement: one sentence in display size on paper, left-aligned from the third half-column (Janick's sketch, slide 1). */
export function MStatement({ text = 'Autowaschen ist\nnicht sexy.', chrome = true }: MStatementProps) {
  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 content-center pb-[80px]">
        <h2 className="col-span-10 col-start-3 whitespace-pre-line text-balance text-display text-ink">{text}</h2>
      </div>
    </Slide>
  )
}
