import type { ReactNode } from 'react'
import { SIGNAL_RING } from './ui'

// Figure look of the deck's matrices, after the figures of the Redewerkstatt: a white card with a hairline and a
// 4px frame, a stone field with a 10 × 10 grid, ink dots and lines. The one accent stays the signal ring.

/** White card with hairline and the faintest shadow; the field sits inside a 4px frame. */
export function FigureCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`size-full rounded-[16px] border border-ink/[0.08] bg-paper p-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  )
}

const GRID =
  'linear-gradient(to right, rgb(17 17 17 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.1) 1px, transparent 1px)'

/**
 * Stone field, 0 to 10 on both axes: grid every 10 %, stronger mid lines at 5. Children are positioned inside it
 * in percent. `target` puts the signal ring on the top-right quarter.
 */
export function FigureGrid({ children, target = false, className = '' }: { children?: ReactNode; target?: boolean; className?: string }) {
  return (
    <div className={`relative size-full rounded-[12px] bg-stone ${className}`}>
      <div className="absolute inset-0 overflow-hidden rounded-[12px]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: GRID, backgroundSize: '10% 10%' }} />
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/30" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/30" />
        {target && <span className={`absolute bottom-1/2 left-1/2 right-0 top-0 rounded-tr-[12px] ${SIGNAL_RING}`} />}
      </div>
      {children}
    </div>
  )
}
