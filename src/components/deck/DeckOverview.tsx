import { Link } from '@tanstack/react-router'
import { DECK, MAIN_COUNT, slideNumber } from './deck'
import { SlideNumber } from './Slide'

export type DeckOverviewProps = {
  /** Speaker notes beside each slide, or slides only. */
  notes?: boolean
  /** Slide width next to the notes column. */
  density?: 'comfortable' | 'compact'
}

/** All slides in a column with their speaker notes. Printing gives one slide per page (PDF). */
export function DeckOverview({ notes = true, density = 'comfortable' }: DeckOverviewProps) {
  const compact = density === 'compact'
  return (
    <main className="min-h-dvh bg-paper pb-24 print:p-0">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 backdrop-blur print:hidden">
        <div className="mx-auto flex min-h-16 max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3 md:px-10">
          <svg width="30" height="17" viewBox="0 0 750 414" role="img" aria-label="oth.view" className="shrink-0 text-ink">
            <circle cx="375" cy="207" r="183" fill="none" stroke="currentColor" strokeWidth="34" />
            <rect x="0" y="190" width="750" height="34" fill="currentColor" />
          </svg>
          <h1 className="order-last basis-full text-pretty text-small text-ink/65 md:order-none md:min-w-0 md:basis-0 md:flex-1">
            oth.view · Pitch Social Media für OSCAR · {MAIN_COUNT} Folien + Anhang
          </h1>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center rounded-full bg-hairline px-4 text-small text-ink transition-colors duration-300 ease-frame hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              Als PDF sichern
            </button>
            <Link
              to="/praesentieren"
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-small text-paper transition-colors duration-300 ease-frame hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
            >
              Präsentieren
            </Link>
          </div>
        </div>
      </header>

      <ol className="mx-auto mt-10 flex max-w-[1600px] flex-col gap-12 px-6 md:px-10 print:m-0 print:max-w-none print:gap-0 print:p-0">
        {DECK.map((s, i) => {
          const heading = `${s.appendix ? slideNumber(i).n : `Folie ${i + 1}`} · ${s.label}`
          return (
            <li
              key={s.id}
              id={s.id}
              className={`grid scroll-mt-32 items-start sm:scroll-mt-24 gap-6 ${notes ? (compact ? 'lg:grid-cols-[minmax(0,1fr)_440px]' : 'lg:grid-cols-[minmax(0,1fr)_360px]') : ''} print:block`}
            >
              <Link
                to="/praesentieren"
                hash={String(i + 1)}
                aria-label={`Präsentieren ab ${heading}`}
                className="block overflow-hidden rounded-[12px] shadow-[0_0_0_1px_rgba(17,17,17,0.08)] outline-none transition-transform duration-500 ease-frame focus-visible:ring-2 focus-visible:ring-signal motion-safe:hover:scale-[0.99] print:rounded-none print:shadow-none"
              >
                {/* The link is the one control; the live slide inside is a picture of it. */}
                <div inert>
                  <SlideNumber.Provider value={slideNumber(i)}>
                    <s.Component />
                  </SlideNumber.Provider>
                </div>
              </Link>
              {notes && (
                <div className="lg:pt-2 print:hidden">
                  <h2 className="text-small text-ink/65 tabular-nums">{heading}</h2>
                  <p className="mt-3 max-w-[52ch] text-pretty text-body leading-[1.5] text-ink">{s.notes}</p>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
