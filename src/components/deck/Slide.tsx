import { createContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { GridLines } from './GridLines'

// Stage of the oth-view-design skill (references/slides.md): 1600 × 900, 80px margin all round,
// 12 half-columns of 120px, red axis at x = 800. Export at 1920 × 1080 is a factor of 1.2.
export const SLIDE_W = 1600
export const SLIDE_H = 900
/** Fallback total when a slide renders outside the deck (single story on the canvas). */
export const TOTAL = 10

/** Position in the deck, provided by DeckOverview / DeckPresenter. Wins over the `n` prop. */
export const SlideNumber = createContext<{ n: number | string; total: number } | null>(null)

/** Go to the next slide, provided by DeckPresenter. Null in the overview and on the canvas. */
export const DeckNext = createContext<(() => void) | null>(null)

export type SlideTone ='sheet' | 'white' | 'ink'

export type SlideProps = {
  /** Slide number, e.g. 7. Appendix slides pass a label like «A1». */
  n?: number | string
  /** Chapter label. Kept for the slide files, no longer rendered. */
  kicker?: ReactNode
  /** The one statement of the slide (text-headline). */
  title?: ReactNode
  /** One sentence under the title (text-body, mute). */
  lead?: ReactNode
  /** Bottom-left caption, e.g. the Pip card the slide is based on. */
  source?: ReactNode
  tone?: SlideTone
  /** Header (wordmark) and footer (number, source). */
  chrome?: boolean
  /** Visible grid lines with the red axis. */
  lines?: boolean
  /** Colour of the central axis. */
  axis?: 'signal' | 'ink' | 'none'
  /** Half-columns the title block spans (1–12). */
  titleSpan?: 6 | 7 | 8 | 9 | 10 | 12
  /** Title as one quiet line (text-body) instead of the headline, for slides where the content is the point. */
  quietTitle?: boolean
  /** The area between header and footer scrolls (title and content), for slides that need more room than 900px. */
  scroll?: boolean
  /** Header, title, lead and footer in paper, for a slide that shows a full-bleed colour (red stage) behind its text. */
  inverse?: boolean
  /** Full-bleed layer behind the content (photos). */
  background?: ReactNode
  /** Pointer and wheel events pass through the content area to the background (a live iframe); children that need them set `pointer-events-auto`. */
  clickThrough?: boolean
  className?: string
  children?: ReactNode
}

const TONES: Record<SlideTone, string> = {
  sheet: 'bg-paper text-ink',
  white: 'bg-paper text-ink',
  ink: 'bg-ink text-paper',
}

const SPANS = {
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  12: 'col-span-12',
} as const

/** The oth.view mark (ring on a bar, as in the website's nav) with the name beside it. */
export function OthViewLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[10px] text-body ${className}`}>
      <svg width="30" height="17" viewBox="0 0 750 414" aria-hidden="true">
        <circle cx="375" cy="207" r="183" fill="none" stroke="currentColor" strokeWidth="34" />
        <rect x="0" y="190" width="750" height="34" fill="currentColor" />
      </svg>
      oth.view
    </span>
  )
}

/** Scales a fixed 1600 × 900 stage to the width of its frame. Print renders it 1:1. */
export function SlideFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SLIDE_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`slide-frame relative aspect-video w-full overflow-hidden ${className}`}
      style={{ '--s': scale ?? 0.5 } as CSSProperties}
    >
      <div
        className="slide-inner absolute left-0 top-0 h-[900px] w-[1600px] origin-top-left"
        style={{ visibility: scale == null ? 'hidden' : undefined }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * One slide on the oth.view grid. The header is `text-body`, the title is the
 * slide's one `text-headline`. Children fill the remaining height; lay them out with `grid-12`
 * (no gap, column edges on the lines), text right of the axis at `col-start-7 col-span-6 pl-4`.
 */
export function Slide({
  title,
  lead,
  tone = 'sheet',
  chrome = true,
  lines = true,
  axis = 'signal',
  titleSpan = 10,
  scroll = false,
  quietTitle = false,
  inverse = false,
  background,
  clickThrough = false,
  className = '',
  children,
}: SlideProps) {
  const dark = tone === 'ink'
  const light = dark || inverse
  const meta = dark ? 'text-paper/50' : inverse ? 'text-paper/80' : 'text-mute'
  return (
    <SlideFrame>
      <section className={`slide flex flex-col ${TONES[tone]} ${className}`}>
        {background}
        {lines && <GridLines position="absolute" allLines axis={axis} />}

        {chrome && (
          <header className="relative z-10 grid-12 shrink-0 items-center text-body">
            <OthViewLogo className={`col-span-4 transition-colors duration-700 ease-frame ${light ? 'text-paper' : 'text-ink'}`} />
          </header>
        )}

        {(() => {
          const titleBlock = title && (
            <div className={`relative z-10 grid-12 shrink-0 ${quietTitle ? 'mt-[32px]' : 'mt-[48px]'}`}>
              <div className={SPANS[titleSpan]}>
                <h2 className={`text-balance transition-colors duration-700 ease-frame ${quietTitle ? 'text-body' : 'text-headline'} ${light ? 'text-paper' : 'text-ink'}`}>{title}</h2>
                {lead && <p className={`mt-[16px] max-w-[46ch] text-pretty text-body transition-colors duration-700 ease-frame ${meta}`}>{lead}</p>}
              </div>
            </div>
          )
          if (!scroll)
            return (
              <>
                {titleBlock}
                <div className={`relative z-10 mt-[40px] flex min-h-0 flex-1 flex-col ${clickThrough ? 'pointer-events-none' : ''}`}>{children}</div>
              </>
            )
          return (
            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              {titleBlock}
              <div className="relative mt-[40px] pb-[40px]">{children}</div>
            </div>
          )
        })()}
      </section>
    </SlideFrame>
  )
}
