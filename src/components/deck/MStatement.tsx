import { useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { DeckNext, Slide } from './Slide'

export type MStatementProps = {
  /** A click turns «Autowaschen ist nicht sexy.» into «Make Carwash Sexy again.». Off: the statement stays. */
  morph?: boolean
  /** Start on the slogan instead of the statement (to check the second state on the canvas). */
  slogan?: boolean
  chrome?: boolean
}

type Point = { x: number; y: number }

/**
 * Opening statement in display size, centred (Janick's sketch, slide 1). «sexy» is the one red word.
 * A click morphs the sentence into the campaign line: the other words blur out and in, «sexy» travels
 * to its place in «Make Carwash Sexy again.». The click after that goes to the next slide (on the canvas it turns back).
 */
export function MStatement({ morph = true, slogan = false, chrome = true }: MStatementProps) {
  const next = useContext(DeckNext)
  const [on, setOn] = useState(morph && slogan)
  const box = useRef<HTMLDivElement>(null)
  const slotA = useRef<HTMLSpanElement>(null)
  const slotB = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ a: Point; b: Point } | null>(null)
  const [glide, setGlide] = useState(false)

  useEffect(() => setOn(morph && slogan), [morph, slogan])

  // Both sentences sit in the same cell; the red word is measured in each (layout px, so the stage scale does not matter).
  useLayoutEffect(() => {
    const measure = () => {
      const a = slotA.current
      const b = slotB.current
      if (!a || !b) return
      setPos({ a: { x: a.offsetLeft, y: a.offsetTop }, b: { x: b.offsetLeft, y: b.offsetTop } })
    }
    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    if (box.current) ro.observe(box.current)
    // The first position lands without travel; only later switches glide.
    const raf = requestAnimationFrame(() => setGlide(true))
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const onClick = () => {
    if (morph && !on) setOn(true)
    else if (next) next()
    else if (morph) setOn(false)
  }

  const p = pos ? (on ? pos.b : pos.a) : null

  return (
    <Slide
      chrome={chrome}
      clickThrough
      background={
        <button
          type="button"
          onClick={onClick}
          aria-label={morph && !on ? 'Zum Slogan wechseln' : 'Nächste Folie'}
          className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-signal/40"
        />
      }
    >
      <div className="grid-12 min-h-0 flex-1 content-center pb-[80px]">
        <h2 className="col-span-full select-none text-center text-display text-ink" aria-live="polite">
          <span ref={box} className="relative grid">
            {/* Statement */}
            <span className="[grid-area:1/1]" aria-hidden={on}>
              <span className="block">
                <Word show={!on} i={0}>Autowaschen</Word> <Word show={!on} i={1}>ist</Word>
              </span>
              <span className="block">
                <Word show={!on} i={2}>nicht</Word>{' '}
                <span ref={slotA} className={`inline-block text-signal ${p || on ? 'invisible' : ''}`}>sexy</span>
                <Word show={!on} i={3}>.</Word>
              </span>
            </span>

            {/* Slogan */}
            <span className="[grid-area:1/1]" aria-hidden={!on}>
              <span className="block">
                <Word show={on} i={0}>Make</Word> <Word show={on} i={1}>Carwash</Word>
              </span>
              <span className="block">
                <span ref={slotB} className={`inline-block text-signal ${p || !on ? 'invisible' : ''}`}>Sexy</span>{' '}
                <Word show={on} i={2}>again.</Word>
              </span>
            </span>

            {/* The red word that travels between both sentences. */}
            {p && (
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 grid text-signal ${glide ? 'transition-transform duration-[900ms] ease-frame motion-reduce:transition-none' : ''}`}
                style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
              >
                <span className={`[grid-area:1/1] transition-opacity duration-500 ease-frame ${on ? 'opacity-0' : 'opacity-100'}`}>sexy</span>
                <span className={`[grid-area:1/1] transition-opacity duration-500 ease-frame ${on ? 'opacity-100' : 'opacity-0'}`}>Sexy</span>
              </span>
            )}
          </span>
        </h2>
      </div>

      {/* Click hint: the switch is a click, said in plain words with a pulsing red point. Gone once the slogan stands. */}
      {morph && (
        <p
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-[12px] text-body text-mute transition-opacity duration-500 ease-frame ${on ? 'opacity-0' : 'opacity-100'}`}
        >
          <span className="relative grid size-[12px] place-items-center">
            <span className="absolute size-full rounded-full bg-signal/40 motion-safe:animate-ping" />
            <span className="size-[8px] rounded-full bg-signal" />
          </span>
          Klicken
        </p>
      )}
    </Slide>
  )
}

/** One word that blurs out and in, staggered by its index. */
function Word({ show, i, children }: { show: boolean; i: number; children: ReactNode }) {
  return (
    <span
      className={`inline-block transition-[opacity,filter,translate] duration-500 ease-frame motion-reduce:transition-opacity ${show ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-[24px] opacity-0 blur-[12px]'}`}
      style={{ transitionDelay: `${show ? 250 + i * 70 : i * 40}ms` }}
    >
      {children}
    </span>
  )
}
