import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconArrowRight, IconMaximize, IconNotes, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { DECK, slideNumber } from './deck'
import { DeckNext, SlideNumber } from './Slide'

export type DeckPresenterProps = {
  /** Slide change: fade, or slide along like the tier switch on the Abo page. */
  transitionStyle?: 'fade' | 'slide'
  transition?: Transition
  /** Speaker notes open on start (toggle with N). */
  notesOpen?: boolean
  /** Start slide, 1-based. The URL hash (#5) wins. */
  start?: number
}

/** Fullscreen presentation. ← → / Space / PageUp / PageDown, Home/End, N = notes, F = fullscreen, Esc = overview. */
export function DeckPresenter({
  transitionStyle = 'slide',
  transition = { type: 'spring', duration: 0.4, bounce: 0 },
  notesOpen = false,
  start = 1,
}: DeckPresenterProps) {
  const [index, setIndex] = useState(Math.min(Math.max(start - 1, 0), DECK.length - 1))
  const [dir, setDir] = useState(1)
  const [notes, setNotes] = useState(notesOpen)
  // Slides render only after the URL hash was read, so a deep link (#5) never flashes slide 1.
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()

  const go = useCallback(
    (next: number) => {
      const n = Math.min(Math.max(next, 0), DECK.length - 1)
      setDir(n >= index ? 1 : -1)
      setIndex(n)
    },
    [index],
  )

  // Hash ↔ slide.
  useEffect(() => {
    const read = () => {
      const n = Number(window.location.hash.slice(1))
      return Number.isInteger(n) && n >= 1 ? Math.min(n, DECK.length) - 1 : null
    }
    const first = read()
    if (first != null) setIndex(first)
    setReady(true)
    const onHash = () => {
      const n = read()
      if (n != null) setIndex((cur) => (setDir(n >= cur ? 1 : -1), n))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    if (ready) history.replaceState(null, '', `#${index + 1}`)
  }, [index, ready])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        go(index + 1)
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        go(index - 1)
      } else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(DECK.length - 1)
      else if (e.key === 'n' || e.key === 'N') setNotes((v) => !v)
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const slide = DECK[index]
  const Current = slide.Component
  const slideAnim = transitionStyle === 'slide' && !reduce
  const t: Transition = reduce ? { duration: 0.15 } : transition

  return (
    <main className="fixed inset-0 flex flex-col bg-ink text-paper">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 md:p-8">
        <div className="mx-auto grid w-full grid-cols-1" style={{ maxWidth: `calc((100dvh - ${notes ? 260 : 120}px) * 16 / 9)` }}>
          {ready && (
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              initial={slideAnim ? { x: dir * 70, opacity: 0 } : { opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={slideAnim ? { x: dir * -70, opacity: 0 } : { opacity: 0 }}
              transition={t}
              className="overflow-hidden rounded-[12px] [grid-area:1/1]"
            >
              <SlideNumber.Provider value={slideNumber(index)}>
                <DeckNext.Provider value={() => go(index + 1)}>
                  <Current />
                </DeckNext.Provider>
              </SlideNumber.Provider>
            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </div>

      {notes && (
        <div className="mx-auto w-full max-w-[1100px] shrink-0 px-6 pb-4">
          <p className="text-small text-paper/50">Sprechernotizen · {slide.label}</p>
          <p className="mt-1.5 max-w-[68ch] text-pretty text-prose text-paper/90">{slide.notes}</p>
        </div>
      )}

      <nav className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" hash={slide.id} aria-label="Zur Übersicht" className="grid size-11 place-items-center rounded-full bg-paper/10 transition-colors duration-300 ease-frame hover:bg-paper/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
          <IconX size={20} stroke={1.6} />
        </Link>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Vorherige Folie" onClick={() => go(index - 1)} disabled={index === 0} className="grid size-11 place-items-center rounded-full bg-paper/10 transition-colors duration-300 ease-frame hover:bg-paper/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-30">
            <IconArrowLeft size={20} stroke={1.6} />
          </button>
          <span className="w-24 text-center text-small text-paper/50 tabular-nums">
            {index + 1} / {DECK.length}
          </span>
          <button type="button" aria-label="Nächste Folie" onClick={() => go(index + 1)} disabled={index === DECK.length - 1} className="grid size-11 place-items-center rounded-full bg-paper/10 transition-colors duration-300 ease-frame hover:bg-paper/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-30">
            <IconArrowRight size={20} stroke={1.6} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-pressed={notes} aria-label="Sprechernotizen (N)" onClick={() => setNotes((v) => !v)} className={`grid size-11 place-items-center rounded-full transition-colors ${notes ? 'bg-paper text-ink' : 'bg-paper/10 hover:bg-paper/20'}`}>
            <IconNotes size={20} stroke={1.6} />
          </button>
          <button type="button" aria-label="Vollbild (F)" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())} className="grid size-11 place-items-center rounded-full bg-paper/10 transition-colors duration-300 ease-frame hover:bg-paper/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
            <IconMaximize size={20} stroke={1.6} />
          </button>
        </div>
      </nav>
    </main>
  )
}
