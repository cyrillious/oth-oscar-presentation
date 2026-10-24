import { Slide } from './Slide'
import { Tag } from './ui'

export type MSozialeSchamProps = {
  chrome?: boolean
}

/** «Find the Fear»: the method name in display size left of the axis, the hidden fear (social shame) right of it. */
export function MSozialeScham({ chrome = true }: MSozialeSchamProps) {
  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 content-center items-start pb-[80px]">
        <h2 className="col-span-6 text-balance text-display text-ink">Find the Fear</h2>
        <div className="col-span-6 col-start-7 pl-4 pt-[12px]">
          <p className="text-body text-mute">Die versteckte Angst</p>
          <p className="mt-[8px] text-balance text-headline text-ink">Soziale Scham.</p>
          <p className="mt-[24px] max-w-[42ch] text-pretty text-body text-ink">
            Menschen kaufen selten aus reinem Vernunftkalkül, sondern um eine Angst zu lindern. Niemand will, dass das Date, Kunden oder Kollegen in ein
            verkrümeltes, schmutziges Auto steigen.
          </p>
          <Tag tone="red" className="mt-[24px]">
            Fear of Criticism
          </Tag>
        </div>
      </div>
    </Slide>
  )
}
