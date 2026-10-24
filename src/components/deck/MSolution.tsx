import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react'
import { Slide } from './Slide'
import { SURFACE } from './ui'
import { Bund, Charm, type CharmKind } from './Bund'
import { MethodFlow, type MethodFlowKey } from './MethodFlow'

export type MSolutionProps = {
  /** Charm image on each product card. */
  illustrations?: boolean
  /** Four cards in a row, or a 2 × 2 grid. */
  columns?: '4' | '2'
  chrome?: boolean
}

type Product = {
  method: string
  /** Core claim, same sentence as on the method's own slide. */
  claim: string
  product: string
  /** What the method is, in plain words (after the Pip Decks card). */
  what: string
  /** How we apply it for OSCAR, three steps. */
  steps: string[]
  /** Name of the Pip Decks card the method comes from. */
  card: string
  /** Unit of the OSCAR key ring (public/images/schluesselbund): a motel tag with an OSCAR object. The key ring is shown whole first and stays until a click on the stage or "Bund auflösen" takes it apart into these. */
  charm: string
  charmAlt: string
  /** How the charm moves: each one behaves like its method (see Bund.tsx). */
  kind: CharmKind
  /** Flowchart sketch in the lightbox that explains the method (MethodFlow.tsx). */
  flow: MethodFlowKey
}

const PRODUCTS: Product[] = [
  {
    method: 'Weirding the Normal',
    claim: 'Das Normale so zeigen, dass man zweimal hinschaut.',
    product: 'Reel-Serie, die den Waschalltag ungewohnt zeigt',
    what: 'Ein normales Produkt, das alle kennen, fällt nicht mehr auf. Die Methode dreht es um einen Grad: vertraut, aber anders.',
    steps: [
      'Einen normalen Moment der Wäsche wählen: Einfahrt, Schaum, Trocknen.',
      'Ihn ungewohnt zeigen: andere Perspektive, anderer Ton, als Serie.',
      'Prüfen: Schaut man zweimal hin, und bleibt es trotzdem verständlich?',
    ],
    card: 'Weird Or Normal?',
    kind: 'bubbles',
    flow: 'weird',
    charm: '/images/schluesselbund/unit-01.webp',
    charmAlt: 'Motel-Schild mit Schwamm',
  },
  {
    method: 'Only Is Better Than Best',
    claim: 'Nicht «die Beste». Sondern das, was es nur bei OSCAR gibt.',
    product: 'Beweis-Clips zu dem, was nur OSCAR hat',
    what: '«Die Beste» sagt jede Waschanlage. Gewinnen kann nur, wer etwas zeigt, das sonst niemand hat.',
    steps: [
      'Mitbewerber nebeneinanderlegen und nur harte Fakten notieren, keine Meinung.',
      'Jeden Unterschied in einen Nutzen für die Kundschaft übersetzen.',
      'Den stärksten als Beweis-Clip zeigen: Textil-Lappen, Fixpreis, Schlange live.',
    ],
    card: 'Only Is Better Than Best',
    kind: 'ticket',
    flow: 'only',
    charm: '/images/schluesselbund/unit-02.webp',
    charmAlt: 'Motel-Schild mit Abo-Karte',
  },
  {
    method: 'The True Competitor',
    claim: 'Der Gegner ist nicht die nächste Waschanlage. Es ist die Ausrede.',
    product: 'Content gegen die Ausrede «mach ich selbst»',
    what: 'Der Gegner ist nicht, wer ähnlich aussieht, sondern alles, was die Kundschaft stattdessen wählt. Bei Harley ist es nicht Yamaha, sondern der Wintergarten.',
    steps: [
      'Sammeln, warum jemand wäscht: Aufgabe, Gefühl, Anlass.',
      'Zu jedem Grund die Alternativen notieren: Eimer, SB-Box, «mach ich selbst».',
      'Die vier, fünf stärksten behalten und Content direkt dagegen machen.',
    ],
    card: 'The True Competitor',
    kind: 'bucket',
    flow: 'competitor',
    charm: '/images/schluesselbund/unit-03.webp',
    charmAlt: 'Motel-Schild mit Staubsauger-Düse',
  },
  {
    method: 'The Real Product & Find the Fear',
    claim: 'Niemand kauft eine Wäsche. Man kauft das Gefühl danach, ohne Risiko davor.',
    product: 'Botschaften, die Gefühl verkaufen und Angst nehmen',
    what: 'Niemand kauft eine Wäsche, sondern den Wert dahinter. Und jede Kategorie lebt von einer Angst, gegen die ihre Marken das Gegenmittel sind.',
    steps: [
      'Fragen, was die Kundschaft wirklich kauft: das Gefühl, nicht die Wäsche.',
      'Die Angst dahinter finden: Kratzer, Preis, Warten, Sauberkeit, Umwelt.',
      'Pro Reel eine Angst offen beantworten.',
    ],
    card: 'The Real Product · Find the Fear',
    kind: 'shield',
    flow: 'realproduct',
    charm: '/images/schluesselbund/unit-04.webp',
    charmAlt: 'Motel-Schild mit Modellauto',
  },
]

/** ease-frame */
const EASE = [0.14, 0.71, 0.16, 0.99] as const

export function MSolution({ illustrations = true, columns = '2', chrome = true }: MSolutionProps) {
  const four = columns === '4'
  const [open, setOpen] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const [apart, setApart] = useState(!!reduce)
  // R gathers the charms back onto the key ring (for questions in the pitch).
  useEffect(() => {
    if (!apart) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) setApart(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [apart])
  // The lightbox is portalled into the scaled stage (.slide-inner), above header and footer.
  const anchor = useRef<HTMLSpanElement>(null)
  const [stage, setStage] = useState<Element | null>(null)
  useEffect(() => setStage(anchor.current?.closest('.slide-inner') ?? null), [])

  // The charms fly from where they hang on the key ring to their card, one after the other.
  const ringBoxes = useRef<(HTMLDivElement | null)[]>([])
  const cardBoxes = useRef<(HTMLDivElement | null)[]>([])
  useLayoutEffect(() => {
    if (!apart || reduce) return
    const scale = (anchor.current?.closest('.slide-inner')?.getBoundingClientRect().width ?? 1600) / 1600
    cardBoxes.current.forEach((card, i) => {
      const ring = ringBoxes.current[i]
      if (!card || !ring) return
      const a = ring.getBoundingClientRect()
      const b = card.getBoundingClientRect()
      const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / scale
      const dy = (a.top + a.height / 2 - (b.top + b.height / 2)) / scale
      ring.style.visibility = 'hidden'
      animate(
        card,
        { x: [dx, 0], y: [dy, 0], scale: [a.width / b.width, 1], rotate: [i % 2 ? -14 : 14, 0] },
        { type: 'spring', stiffness: 64, damping: 11, delay: 0.05 + i * 0.07 },
      )
    })
  }, [apart, reduce])

  const active = open == null ? null : PRODUCTS[open]

  return (
    <Slide
      n={6}
      kicker="Die Lösung"
      title="oth.view arbeitet methodisch."
      lead="Ein Schlüsselbund für OSCAR: vier Methoden, zielgesichert eingesetzt."
      titleSpan={12}
      chrome={chrome}
      inverse={!apart}
      // The key ring starts on a red stage; it contracts onto the ring once the ring comes apart.
      background={
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-signal"
          initial={false}
          animate={{ clipPath: apart ? 'circle(0% at 46% 40%)' : 'circle(150% at 46% 40%)' }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] }}
        />
      }
    >
      {/* Cards side by side with gap-x-5 (skill): 2 × 2 = col-span-6 each, 4 in a row = col-span-3 each. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className={`grid-12 min-h-0 flex-1 gap-x-5 gap-y-5 ${four ? '' : 'grid-rows-2'}`}>
          {PRODUCTS.map(({ method, product, kind, charm, charmAlt }, i) => (
            <motion.button
              key={method}
              type="button"
              tabIndex={apart ? 0 : -1}
              onClick={() => setOpen(i)}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`group relative flex min-h-0 cursor-pointer text-left focus-visible:outline-none ${four ? 'col-span-3 flex-col' : 'col-span-6 flex-row'}`}
            >
              {/* The panel and the text come in once the charms have left the ring. */}
              <motion.span
                aria-hidden="true"
                className={`absolute inset-0 ${SURFACE} transition-shadow duration-300 group-focus-visible:ring-2 group-focus-visible:ring-signal group-focus-visible:ring-offset-2`}
                initial={false}
                animate={{ clipPath: apart ? 'inset(0% 0% 0% 0% round 12px)' : 'inset(0% 0% 100% 0% round 12px)' }}
                transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: apart && !reduce ? 0.4 + i * 0.1 : 0 }}
              />
              {illustrations && (
                <div className={`relative shrink-0 ${four ? 'h-[200px] w-full' : 'w-[200px]'}`}>
                  {/* The charm hangs from the top edge of its card; the card cuts off its ring. While it
                      flies the clip is wide open, then it closes onto the card. */}
                  <motion.div
                    className="absolute inset-0 z-20 flex justify-center"
                    initial={false}
                    animate={{ clipPath: apart ? 'inset(0px round 12px 0px 0px 12px)' : 'inset(-900px round 12px 0px 0px 12px)' }}
                    transition={{ duration: 0.35, ease: EASE, delay: apart && !reduce ? 1.1 + i * 0.07 : 0 }}
                  >
                    <div className="-mt-[7%] h-[100%]" style={{ opacity: apart ? 1 : 0 }}>
                      <Charm
                        kind={kind}
                        src={charm}
                        alt={charmAlt}
                        hovered={hover === i}
                        className="h-full"
                        boxRef={(el) => {
                          cardBoxes.current[i] = el
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              )}
              <motion.div
                className={`relative flex min-w-0 flex-1 flex-col ${four ? 'px-[28px] pb-[28px] pt-[8px]' : 'py-[32px] pl-[8px] pr-[32px]'} ${illustrations ? '' : 'pl-[32px]'}`}
                initial={false}
                animate={apart ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
                transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: apart && !reduce ? 0.7 + i * 0.08 : 0 }}
              >
                <p className="text-balance text-headline text-ink">{method}</p>
                <p className="mt-auto max-w-[28ch] pt-[16px] text-pretty text-body text-mute">{product}</p>
              </motion.div>
            </motion.button>
          ))}
        </div>

      </div>

      {/* Lightbox. `fixed` resolves to the scaled 1600 × 900 stage (the transformed slide-inner), so it
          covers exactly the slide. The dialog sits on the 80px margin and uses the same 12 half-columns. */}
      <span ref={anchor} hidden />
      {/* The key ring on its rod is portalled into the stage, so it can use the whole slide, header and all. */}
      {stage &&
        createPortal(
          <AnimatePresence>
            {!apart && (
              <motion.div
                key="bund"
                className="fixed inset-0 z-30"
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 1.1 } }}
              >
                <Bund
                  charms={PRODUCTS.map((p) => ({ kind: p.kind, src: p.charm, alt: p.charmAlt, name: p.method }))}
                  boxes={ringBoxes}
                  onRelease={() => setApart(true)}
                />
                <motion.div
                  className="absolute bottom-[80px] left-[80px] flex items-center gap-[20px]"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <button
                    type="button"
                    onClick={() => setApart(true)}
                    className="cursor-pointer rounded-full bg-paper px-[24px] py-[12px] text-body text-ink transition-colors duration-300 ease-frame hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-signal"
                  >
                    Bund auflösen
                  </button>
                  <p className="text-body text-paper">Anstossen, anfassen, schleudern.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          stage,
        )}

      {stage &&
        createPortal(
          <AnimatePresence>
            {apart && !active && (
              <motion.button
                key="collect"
                type="button"
                onClick={() => setApart(false)}
                className="absolute bottom-[80px] left-[80px] z-30 cursor-pointer text-body text-mute transition-colors duration-300 ease-frame hover:text-ink focus-visible:text-ink focus-visible:outline-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                R · Bund wieder einsammeln
              </motion.button>
            )}
          </AnimatePresence>,
          stage,
        )}

      {stage &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                key="lightbox"
                className="fixed inset-0 z-50 grid place-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
              >
                <button
                  type="button"
                  aria-label="Schliessen"
                  onClick={() => setOpen(null)}
                  className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[12px]"
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={active.method}
                  className="relative grid-12 grid-rows-1 h-[740px] w-[1440px] overflow-hidden rounded-[12px] bg-paper"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                >
                  <div className="col-span-6 grid min-h-0 place-items-center bg-stone p-[48px]">
                    <MethodFlow method={active.flow} />
                  </div>
                  <div className="col-span-6 col-start-7 flex min-h-0 min-w-0 flex-col overflow-y-auto overscroll-contain py-[56px] pl-[56px] pr-[104px]">
                    <p className="text-body text-mute tabular-nums">
                      Methode 0{open! + 1} · {active.method}
                    </p>
                    <p className="mt-[16px] max-w-[18ch] text-balance text-headline text-ink">{active.claim}</p>
                    <p className="mt-[24px] max-w-[52ch] text-pretty text-body text-ink">{active.what}</p>
                    <p className="mt-[24px] text-body text-mute">So setzen wir sie ein</p>
                    <ol className="mt-[8px] max-w-[56ch]">
                      {active.steps.map((step, k) => (
                        <li key={step} className="grid grid-cols-[32px_1fr] border-t border-ink/10 py-[10px] text-body">
                          <span className="text-mute tabular-nums">{k + 1}</span>
                          <span className="text-pretty text-ink">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-auto border-t border-ink/10 pt-[20px]">
                      <p className="flex justify-between gap-[16px] text-body text-mute">
                        <span>Das Produkt für OSCAR</span>
                        <span>Pip-Karte: {active.card}</span>
                      </p>
                      <p className="mt-[8px] max-w-[30ch] text-pretty text-body text-ink">{active.product}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Schliessen"
                    onClick={() => setOpen(null)}
                    className="absolute right-[24px] top-[24px] grid size-[48px] cursor-pointer place-items-center rounded-full bg-ink/[0.06] text-ink transition-colors duration-300 ease-frame hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          stage,
        )}
    </Slide>
  )
}
