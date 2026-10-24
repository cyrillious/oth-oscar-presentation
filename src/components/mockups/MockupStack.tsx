import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

/** One sentence; parts in `hi` are set in ink, the rest in mute (as on gipfeli.ui8.dev). */
type Line = Array<string | { hi: string }>

export type Mockup = {
  id: string
  title: string
  src: string
  text: Line
}

export const UNLIMITED_MOCKUPS: Mockup[] = [
  {
    id: 'desktop',
    title: 'Unlimited · Desktop',
    src: '/images/mockups/unlimited-desktop.webp',
    text: [
      'Auf dem ',
      { hi: 'Desktop' },
      ' steht die Karte links, Preis und Vorteile rechts. Ein Klick, und man ist ',
      { hi: 'Gold Unlimited' },
      '.',
    ],
  },
  {
    id: 'tarif',
    title: 'Unlimited · Tarif',
    src: '/images/mockups/unlimited-tarif.webp',
    text: [
      'Mobil wählt man den Tarif mit einem ',
      { hi: 'Wisch' },
      ': Silber, Gold oder All In, der Preis pro Monat gleich darunter.',
    ],
  },
  {
    id: 'zahlung',
    title: 'Unlimited · Zahlung',
    src: '/images/mockups/unlimited-zahlung.webp',
    text: [
      'Beim Bezahlen steht das ',
      { hi: 'Jahresabo' },
      ' zuoberst: zwei Monate geschenkt. Quartal und Monat bleiben offen, ',
      { hi: 'jederzeit kündbar' },
      '.',
    ],
  },
]

// Poses of the stack from the top card down (gipfeli.ui8.dev: -3° / 3° · 0.95 / -6° · 0.9).
const POSES = [
  { rotate: -3, scale: 1 },
  { rotate: 3, scale: 0.95 },
  { rotate: -6, scale: 0.9 },
  { rotate: 3, scale: 0.85 },
]
const EASE = [0.4, 0, 0.2, 1] as const

export type MockupStackProps = {
  items?: Mockup[]
  /** Card on top at first render. */
  start?: number
  /** Description, counter and arrows next to the stack. */
  showText?: boolean
  className?: string
}

/**
 * Stacked mockup cards after the project stack on gipfeli.ui8.dev: tilted photo cards in a thin white
 * frame. Click, drag or the arrows send the top card to the back. Photos: device scenes from Higgsfield
 * with the real OSCAR screenshots set onto the screen.
 */
export function MockupStack({ items = UNLIMITED_MOCKUPS, start = 0, showText = true, className = '' }: MockupStackProps) {
  const n = items.length
  const [top, setTop] = useState(((start % n) + n) % n)
  // Last card that left the top, and in which direction, for the fly-out.
  const [leaving, setLeaving] = useState<{ id: string; dir: 1 | -1; key: number } | null>(null)

  // Follow the canvas control when `start` changes after mount.
  useEffect(() => {
    setTop(((start % n) + n) % n)
    setLeaving(null)
  }, [start, n])

  const next = (dir: 1 | -1 = 1) => {
    if (dir === 1) {
      setLeaving({ id: items[top].id, dir, key: Date.now() })
      setTop((t) => (t + 1) % n)
    } else {
      const prev = (top - 1 + n) % n
      setLeaving({ id: items[prev].id, dir, key: Date.now() })
      setTop(prev)
    }
  }

  const current = items[top]

  return (
    <section className={`flex flex-col items-center gap-[40px] md:flex-row md:items-center md:gap-[48px] ${className}`}>
      <div className="relative aspect-[340/400] w-[min(340px,72vw)] shrink-0">
        {items.map((item, i) => {
          const depth = (i - top + n) % n
          const pose = POSES[Math.min(depth, POSES.length - 1)]
          const isTop = depth === 0
          const flying = leaving?.id === item.id
          const dir = leaving?.dir ?? 1
          // Forward: the top card leaves to the right and tucks in at the back. Back: the bottom card
          // comes out to the left and lands on top. Either way it stays above the stack while flying.
          const from = dir === 1 ? POSES[0] : POSES[Math.min(n - 1, POSES.length - 1)]
          return (
            <motion.div
              key={flying ? `${item.id}-${leaving?.key}` : item.id}
              className="absolute inset-0 origin-center"
              style={flying ? undefined : { zIndex: 10 - depth }}
              initial={flying ? { x: 0, rotate: from.rotate, scale: from.scale, zIndex: 20 } : false}
              animate={
                flying
                  ? {
                      x: [0, dir * 360, 0],
                      rotate: [from.rotate, dir * 12, pose.rotate],
                      scale: [from.scale, 0.96, pose.scale],
                      zIndex: [20, 20, 10 - depth],
                    }
                  : { x: 0, rotate: pose.rotate, scale: pose.scale }
              }
              transition={flying ? { duration: 0.7, ease: EASE, times: [0, 0.45, 1] } : { duration: 0.4, ease: EASE }}
              drag={isTop ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80) next(info.offset.x > 0 ? 1 : -1)
              }}
            >
              <button
                type="button"
                onClick={() => isTop && next(1)}
                tabIndex={isTop ? 0 : -1}
                aria-label={isTop ? `Nächstes Mockup (jetzt: ${item.title})` : undefined}
                aria-hidden={!isTop}
                className="relative block h-full w-full cursor-pointer touch-pan-y select-none rounded-[22px] border border-ink/[0.08] bg-white p-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="pointer-events-none h-full w-full rounded-[18px] object-cover"
                />
              </button>
            </motion.div>
          )
        })}
      </div>

      {showText && (
        <div className="flex w-[min(340px,72vw)] flex-col gap-[20px] md:w-[300px]">
          <div className="flex items-baseline justify-between text-small text-mute">
            <span>{current.title}</span>
            <span className="tabular-nums">
              {String(top + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
          <p className="min-h-[5lh] text-pretty text-body text-mute">
            {current.text.map((part, i) =>
              typeof part === 'string' ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i} className="text-ink">
                  {part.hi}
                </span>
              ),
            )}
          </p>
          <div className="flex gap-[8px]">
            <ArrowButton label="Vorheriges Mockup" onClick={() => next(-1)}>
              <IconArrowLeft size={16} stroke={2} />
            </ArrowButton>
            <ArrowButton label="Nächstes Mockup" onClick={() => next(1)}>
              <IconArrowRight size={16} stroke={2} />
            </ArrowButton>
          </div>
        </div>
      )}
    </section>
  )
}

/** Nested button from gipfeli.ui8.dev: faint outer ring, white key inside. */
function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group inline-flex rounded-[12px] border border-ink/[0.05] bg-ink/[0.015] p-[3px] outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
    >
      <span className="grid size-[34px] place-items-center rounded-[8px] border border-ink/[0.14] bg-white text-ink shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition-colors duration-150 group-hover:border-ink/25 group-hover:bg-stone">
        {children}
      </span>
    </button>
  )
}
