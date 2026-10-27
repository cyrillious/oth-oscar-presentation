import type { ReactNode } from 'react'
import { motion } from 'motion/react'

// Shared building blocks of the deck, on the oth-view-design skill: flat stone panels on paper,
// 12px corners, capsules, six colours, everything at weight 400. Signal red is the one accent
// of a slide (the grid axis does not count).

/** Flat stone panel: no glass, no gradient, no shadow. */
export const SURFACE = 'rounded-[12px] bg-stone'

/** Ring that marks the one recommended / highlighted element of a slide. */
export const SIGNAL_RING = 'shadow-[inset_0_0_0_2px_var(--color-signal)]'

/**
 * Hover cards, one system for the whole deck. Put CARDS on the container and CARD on each card:
 * the hovered card lifts and turns ink, its siblings step back (dim + shrink). Inside a card use
 * CARD_INK / CARD_MUTE / CARD_FAINT for text and CARD_RULE for hairlines so they flip with the card.
 */
export const CARDS = 'group/cards'
export const CARD = `group/card ${SURFACE} cursor-default transition-[background-color,opacity,translate,scale] duration-500 ease-frame hover:bg-ink motion-safe:hover:-translate-y-[8px] motion-safe:group-has-[:hover]/cards:not-hover:scale-[0.97] group-has-[:hover]/cards:not-hover:opacity-55`
const FLIP = 'transition-colors duration-500 ease-frame'
export const CARD_INK = `text-ink ${FLIP} group-hover/card:text-paper`
export const CARD_MUTE = `text-mute ${FLIP} group-hover/card:text-paper/70`
export const CARD_FAINT = `text-mute ${FLIP} group-hover/card:text-paper/60`
export const CARD_RULE = `border-ink/10 ${FLIP} group-hover/card:border-paper/15`

/** Stone card that reacts to hover (see CARD). Padding comes from className. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${CARD} ${className}`}>{children}</div>
}

export function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${CARD} p-[32px] ${className}`}>{children}</div>
}

/** Stone panel with the signal ring: the one red accent of its slide. */
export function BoxRecommended({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative ${CARD} ${SIGNAL_RING} p-[32px] ${className}`}>{children}</div>
}

/** Capsule tag (text-body). `red` and `solid` count as the slide's one signal accent. Amber = «mit OSCAR klären». */
export function Tag({
  children,
  tone = 'grey',
  className = '',
}: {
  children: ReactNode
  tone?: 'grey' | 'red' | 'amber' | 'dark' | 'solid'
  className?: string
}) {
  const tones = {
    grey: `bg-ink/[0.06] text-ink ${FLIP} group-hover/card:bg-paper/15 group-hover/card:text-paper`,
    red: 'bg-signal/10 text-signal',
    amber: 'bg-hint-bg text-hint',
    dark: 'bg-paper/15 text-paper',
    solid: 'bg-signal text-paper',
  }
  return (
    <span className={`inline-flex h-[22px] shrink-0 items-center whitespace-nowrap rounded-full px-[10px] text-[16px] leading-none ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

/** Placeholder that must be filled before the pitch: «[Follower und letzte Posts heute]». Not part of the look. */
export function Ph({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline rounded-[6px] bg-hint-bg px-[8px] py-[1px] text-hint [box-decoration-break:clone] ${className}`}>
      [{children}]
    </span>
  )
}

/** Outlined capsule that fills when selected, for picking what the slide shows (text-body). */
export function Pill({
  children,
  selected = false,
  dashed = false,
  onClick,
  className = '',
  layoutId,
}: {
  children: ReactNode
  selected?: boolean
  /** Dashed outline for «add» actions. */
  dashed?: boolean
  onClick?: () => void
  className?: string
  /** Pills of one row that share this id hand the selected ink capsule from one to the next. */
  layoutId?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dashed ? undefined : selected}
      className={`relative inline-flex h-[32px] shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border px-[14px] text-[16px] leading-none transition-[color,background-color,border-color,scale] duration-300 ease-frame motion-safe:active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 ${
        selected
          ? `border-ink text-paper ${layoutId ? '' : 'bg-ink'}`
          : dashed
            ? 'border-dashed border-ink/25 text-mute hover:border-ink hover:text-ink'
            : 'border-ink/25 text-ink hover:border-ink'
      } ${className}`}
    >
      {layoutId && selected && (
        <motion.span
          layoutId={layoutId}
          className="absolute -inset-px rounded-full bg-ink"
          transition={{ duration: 0.5, ease: [0.14, 0.71, 0.16, 0.99] }}
          aria-hidden="true"
        />
      )}
      <span className="relative inline-flex items-center gap-[6px]">{children}</span>
    </button>
  )
}

/** Row of single marks, one per point. Filled marks are earned points. `bar` draws short segments instead of dots. */
export function Dots({
  value,
  max,
  tone = 'ink',
  size = 14,
  shape = 'dot',
  className = '',
}: {
  value: number
  max: number
  tone?: 'signal' | 'ink'
  size?: number
  shape?: 'dot' | 'bar'
  className?: string
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * (shape === 'bar' ? 0.3 : 0.45) }} role="img" aria-label={`${value} von ${max} Punkten`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`shrink-0 ${shape === 'bar' ? 'rounded-[2px]' : 'rounded-full'} ${i < value ? (tone === 'signal' ? 'bg-signal' : 'bg-current') : 'shadow-[inset_0_0_0_1.5px_color-mix(in_srgb,currentColor_22%,transparent)]'}`}
          style={{ width: size, height: shape === 'bar' ? size * 0.36 : size }}
        />
      ))}
    </span>
  )
}

/** Hairline divider. */
export function Rule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-current opacity-10 ${className}`} />
}

/** Small grey label above a block (text-body, mute). */
export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-body ${CARD_FAINT} ${className}`}>{children}</p>
}

/**
 * Method slide body on the grid: illustration panel over three columns (col-span-6) on one side,
 * «Die Methode», «Für OSCAR» and the product on the other. The product box carries the slide's
 * one signal ring: it names what OSCAR gets.
 */
export function MethodLayout({
  illustration,
  method,
  children,
  product,
  side = 'left',
  showIllustration = true,
}: {
  illustration: ReactNode
  method: ReactNode
  /** «Für OSCAR»: how the method looks applied. */
  children: ReactNode
  /** Deliverable OSCAR gets. */
  product: ReactNode
  side?: 'left' | 'right'
  showIllustration?: boolean
}) {
  const panelLeft = showIllustration && side === 'left'
  const panel = showIllustration && (
    <div
      className={`relative row-start-1 overflow-hidden rounded-[12px] bg-stone ${
        side === 'left' ? 'col-span-6 col-start-1' : 'col-span-6 col-start-7'
      }`}
    >
      {illustration}
    </div>
  )
  // Text right of the axis when the figure is left; left of it (with the same 16px air) when right.
  const text = !showIllustration
    ? 'col-span-6 col-start-7 pl-4'
    : panelLeft
      ? 'col-span-6 col-start-7 pl-4'
      : 'col-span-6 col-start-1 pr-4'
  return (
    <div className="grid-12 min-h-0 flex-1">
      {panel}
      <div className={`row-start-1 flex min-h-0 flex-col ${text}`}>
        <Label>Die Methode</Label>
        <p className="mt-[8px] max-w-[34ch] text-pretty text-body">{method}</p>
        <Label className="mt-[20px] border-t border-current/10 pt-[12px]">Für OSCAR</Label>
        <div className="mt-[4px] min-h-0 pb-[20px]">{children}</div>
        <div className={`mt-auto flex items-baseline justify-between gap-[24px] ${SURFACE} ${SIGNAL_RING} px-[24px] py-[20px]`}>
          <span className="shrink-0 text-body text-mute">Das Produkt</span>
          <span className="text-balance text-right text-body">{product}</span>
        </div>
      </div>
    </div>
  )
}

/** Numbered example line used under «Für OSCAR». */
export function Example({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[40px_1fr] items-baseline py-[3px]">
      <span className="text-body text-mute tabular-nums">0{n}</span>
      <p className="text-pretty text-body">{children}</p>
    </div>
  )
}
