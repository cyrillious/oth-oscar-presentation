import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Slide } from './Slide'
import { IlluFunnel } from './illustrations'
import { FigFunnel } from './figures/funnel/Figure'

type StageKey = 'TOFU' | 'MOFU' | 'BOFU'

export type MFunnelProps = {
  /** Anatomy figure (isometric, live) or the earlier flat drawing. */
  figur?: 'anatomie' | 'linie'
  illustration?: boolean
  chrome?: boolean
  /** Stage that is open when the slide loads. */
  open?: StageKey
}

const STAGES: { key: StageKey; name: string; content: string; kpi: string }[] = [
  {
    key: 'TOFU',
    name: 'Aufmerksamkeit',
    content: 'Weirding the Normal, Saison-Content',
    kpi: 'Hook-Rate, Reichweite',
  },
  {
    key: 'MOFU',
    name: 'Überlegung',
    content: 'Only-Beweise, Ängste nehmen, Rechnung gegen «mach ich selbst»',
    kpi: 'Saves, Shares, Profilbesuche',
  },
  {
    key: 'BOFU',
    name: 'Abschluss',
    content: 'Unlimited-Angebot im Reel, auf den Bildschirmen vor Ort und auf der Abo-Seite',
    kpi: 'Link-Klicks, Abo-Abschlüsse',
  },
]

/** ease-frame (styles.css): fast start, long soft settle. */
const EASE = [0.14, 0.71, 0.16, 0.99] as const

// Appendix slide on the grid: the figure in a stone panel left of the axis (as on the method
// slides), the stages right of it as a FAQ-style list (border-t, key small mute, name title).
// The one signal accent is the red lead (FigFunnel): it drops to the open stage and, at BOFU, on into
// the Abo dish. List and figure drive each other.
export function MFunnel({ figur = 'anatomie', illustration = true, chrome = true, open = 'TOFU' }: MFunnelProps) {
  const initial = Math.max(0, STAGES.findIndex((s) => s.key === open))
  const [active, setActive] = useState(initial)
  useEffect(() => setActive(initial), [initial])
  const reduce = useReducedMotion()

  return (
    <Slide n={11} kicker="Tofu · Mofu · Bofu" title="Jeder Inhalt hat eine Aufgabe im Funnel. Am Ende steht das Abo." chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        {illustration &&
          (figur === 'anatomie' ? (
            <div className="relative col-span-6 col-start-1 row-start-1 overflow-hidden rounded-[12px] bg-stone">
              <FigFunnel stage={active} onStage={setActive} />
            </div>
          ) : (
            <div className="col-span-6 col-start-1 row-start-1 grid min-h-0 place-items-center rounded-[12px] bg-stone p-[32px]">
              <IlluFunnel active={active} className="h-full max-h-full w-auto" />
            </div>
          ))}
        <div className="col-span-6 col-start-7 row-start-1 flex min-h-0 flex-col pl-4">
          <div className="border-b border-ink/10">
            {STAGES.map((s, i) => {
              const isOpen = i === active
              return (
                <div key={s.key} className="border-t border-ink/10">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setActive(i)}
                    className="grid w-full cursor-pointer grid-cols-[104px_1fr_auto] items-center py-[20px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                  >
                    <span className={`text-body transition-colors duration-300 ease-frame ${isOpen ? 'text-ink' : 'text-mute'}`}>{s.key}</span>
                    <span className="text-headline">{s.name}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      className={`text-mute motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-frame ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M4 7.5l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        {/* Columns start at 920 and 1280: half-column lines of the stage. */}
                        <div className="grid grid-cols-[360px_1fr] pb-[24px] pl-[104px]">
                          <div className="pr-[20px]">
                            <p className="text-body text-mute">Inhalte</p>
                            <p className="mt-[8px] text-pretty text-body">{s.content}</p>
                          </div>
                          <div>
                            <p className="text-body text-mute">Gemessen an</p>
                            <p className="mt-[8px] text-balance text-body">{s.kpi}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Slide>
  )
}
