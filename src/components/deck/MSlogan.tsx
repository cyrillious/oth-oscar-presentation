import { useContext } from 'react'
import { DeckNext, Slide } from './Slide'

export type MSloganProps = {
  chrome?: boolean
}

/**
 * The campaign line «Make Carwash Sexy again.» centred in display size on the black stage, «Sexy» in signal red
 * (the word MStatement hands over). No image trail, no cycling feelings. A click goes to the next slide.
 */
export function MSlogan({ chrome = true }: MSloganProps) {
  const next = useContext(DeckNext)
  return (
    <Slide
      chrome={chrome}
      lines={false}
      tone="ink"
      clickThrough
      background={
        next ? (
          <button
            type="button"
            onClick={next}
            aria-label="Nächste Folie"
            className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-signal/40"
          />
        ) : undefined
      }
    >
      <div className="grid-12 min-h-0 flex-1 content-center pb-[80px]">
        <h2 className="col-span-12 select-none text-center text-display text-paper">
          <span className="block">Make Carwash</span>
          <span className="block">
            <span className="text-signal">Sexy</span> again.
          </span>
        </h2>
      </div>
    </Slide>
  )
}
