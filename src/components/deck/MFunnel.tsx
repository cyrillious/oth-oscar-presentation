import { useEffect, useState } from 'react'
import { Slide } from './Slide'
import { IlluFunnel } from './illustrations'
import { FigFunnel } from './figures/funnel/Figure'
import { FigFunnelFlat } from './figures/funnel/Flat'
import { FigFunnelCircles } from './figures/funnel/Circles'

type StageKey = 'TOFU' | 'MOFU' | 'BOFU'

export type MFunnelProps = {
  /** Live figure as plain circles (kreise), the retort stand in front view (flach), the isometric Anatomy figure, or the earlier line drawing. */
  figur?: 'kreise' | 'flach' | 'anatomie' | 'linie'
  illustration?: boolean
  chrome?: boolean
  /** Stage that is open when the slide loads. */
  open?: StageKey
}

const STAGES: { key: StageKey; name: string; content: string; kpi: string }[] = [
  {
    key: 'TOFU',
    name: 'Aufmerksamkeit',
    content: 'Humorvolle Videos und Sketche, die eine Angst aufnehmen',
    kpi: 'Reichweite, Hook-Rate',
  },
  {
    key: 'MOFU',
    name: 'Mehrwert',
    content: 'Tipps und Tricks, zum Beispiel richtig saugen',
    kpi: 'Saves, Shares, Profilbesuche',
  },
  {
    key: 'BOFU',
    name: 'Vertrauen',
    content: 'Cleaner Content: die Waschanlage zeigen, das Markenimage stärken',
    kpi: 'Link-Klicks, Abo-Abschlüsse',
  },
]

// Main slide (Janick, slide 7) on the grid: the figure in a stone panel left of the axis (as on the method
// slides), the stages right of it as a FAQ-style list (border-t, key small mute, name title).
// The one signal accent is the red lead (FigFunnel): it drops to the open stage and, at BOFU, on into
// the Abo dish. List and figure drive each other.
export function MFunnel({ figur = 'kreise', illustration = true, chrome = true, open = 'TOFU' }: MFunnelProps) {
  const initial = Math.max(0, STAGES.findIndex((s) => s.key === open))
  const [active, setActive] = useState(initial)
  useEffect(() => setActive(initial), [initial])

  return (
    <Slide n={11} kicker="Tofu · Mofu · Bofu" title="Jeder Inhalt hat eine Aufgabe im Funnel. Am Ende steht das Abo." chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        {illustration &&
          (figur !== 'linie' ? (
            <div className="relative col-span-6 col-start-1 row-start-1 overflow-hidden rounded-[12px] bg-stone">
              {figur === 'kreise' ? (
                <FigFunnelCircles stage={active} onStage={setActive} />
              ) : figur === 'flach' ? (
                <FigFunnelFlat stage={active} onStage={setActive} />
              ) : (
                <FigFunnel stage={active} onStage={setActive} />
              )}
            </div>
          ) : (
            <div className="col-span-6 col-start-1 row-start-1 grid min-h-0 place-items-center rounded-[12px] bg-stone p-[32px]">
              <IlluFunnel active={active} className="h-full max-h-full w-auto" />
            </div>
          ))}
        <div className="col-span-6 col-start-7 row-start-1 flex min-h-0 flex-col pl-4">
          <p className="mb-[12px] text-body text-mute">Stufe anklicken</p>
          <div className="border-b border-ink/[0.07]">
            {STAGES.map((s, i) => {
              const isOpen = i === active
              return (
                <div key={s.key} className="border-t border-ink/[0.07]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setActive(i)}
                    className="group -mx-[12px] grid w-[calc(100%+24px)] cursor-pointer grid-cols-[92px_1fr_auto] items-center rounded-[8px] px-[12px] py-[18px] text-left transition-colors duration-300 ease-frame hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                  >
                    <span className="text-body text-mute">{s.key}</span>
                    {/* Closed stages step back in mute; the open one comes forward in ink. */}
                    <span
                      className={`text-headline transition-colors duration-500 ease-frame ${isOpen ? 'text-ink' : 'text-mute group-hover:text-ink/60'}`}
                    >
                      {s.name}
                    </span>
                    {/* Ringed chevron: a visible control on every row, so the list reads as clickable. Open: ink, turned. */}
                    <span
                      aria-hidden="true"
                      className={`grid size-[36px] place-items-center rounded-full border transition-colors duration-300 ease-frame ${isOpen ? 'border-ink bg-ink text-paper' : 'border-ink/25 text-ink group-hover:border-ink'}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform duration-[560ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  {/* All panels stay mounted; the open and the closing one animate their grid row on the same
                      curve and duration, so the list's total height barely moves while they trade places. */}
                  <div
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-[560ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {/* Content fades in once the row has begun to open, and out at once on close. */}
                      <div
                        className={`grid grid-cols-[360px_1fr] pb-[24px] pl-[104px] motion-reduce:transition-none ${isOpen ? 'opacity-100 transition-opacity delay-150 duration-[400ms] ease-out' : 'opacity-0 transition-opacity duration-150 ease-out'}`}
                      >
                        {/* Columns start at 920 and 1280: half-column lines of the stage. */}
                        <div className="pr-[20px]">
                          <p className="text-body text-mute">Inhalte</p>
                          <p className="mt-[8px] text-pretty text-body">{s.content}</p>
                        </div>
                        <div>
                          <p className="text-body text-mute">Gemessen an</p>
                          <p className="mt-[8px] text-balance text-body">{s.kpi}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Slide>
  )
}
