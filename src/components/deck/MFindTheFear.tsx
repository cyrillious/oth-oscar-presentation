import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Slide } from './Slide'
import { Dots, Pill } from './ui'
import { COMPETITORS, RESEARCH_DATE } from './competitors'
import { ASPECTS, COVERAGE_WORD, maxPoints, pointsOf, totalPoints, type BenchCell, type BenchRow } from './benchmark'

export type MFindTheFearProps = {
  /** Aspect shown when the slide loads. The tags switch it live. */
  aspect?: 'aengste' | 'reichweite' | 'aktivitaet' | 'preis' | 'standorte'
  /** Extra column for OSCAR today. */
  oscar?: boolean
  chrome?: boolean
}

/** ease-frame of the oth-view-design skill. */
const EASE = [0.14, 0.71, 0.16, 0.99] as const

type Col = { id: string; name: string }

const scoreOf = (row: BenchRow, id: string) => (row.cells[id] ? pointsOf(row, id) : 0)

/** Clearly ahead / behind: at the top (bottom) of the row and not tied with most of the others. */
function standing(row: BenchRow, ids: string[], id: string): 'best' | 'worst' | null {
  const s = ids.map((x) => scoreOf(row, x))
  const max = Math.max(...s)
  const min = Math.min(...s)
  const mine = scoreOf(row, id)
  if (max === min) return null
  const ties = ids.filter((x) => x !== id && scoreOf(row, x) === mine).length
  if (ties * 2 >= ids.length - 1) return null
  return mine === max ? 'best' : mine === min ? 'worst' : null
}

function Cell({ cell, row, ids, col, span, active, beforeOscar, grow, delay }: { cell: BenchCell; row: BenchRow; ids: string[]; col: Col; span: number; active: boolean; beforeOscar?: boolean; grow?: boolean; delay?: number }) {
  const oscar = col.id === 'oscar'
  // The stagger delay only belongs to the entrance; later tweens (a competitor removed) start at once.
  const [entered, setEntered] = useState(false)
  // Only the one clearly ahead is set in ink; the rest recedes, so a row reads at a glance.
  const tone = standing(row, ids, col.id) === 'best' ? 'text-ink' : 'text-mute'
  const top = Math.max(...ids.map((id) => row.cells[id]?.score ?? 0), 1)
  return (
    // The track opens and closes; the content keeps its final width and is revealed / clipped by this shell, so the text never re-wraps mid-tween.
    <div className={`min-w-0 overflow-hidden transition-opacity duration-300 ease-frame motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!active} inert={!active}>
      {/* The OSCAR panel bleeds 16px into the column before it, so that column keeps 16px more clear (bar and text stay off the panel). */}
      <div className={`flex flex-col items-start gap-[12px] py-[24px] ${beforeOscar ? 'pr-[32px]' : 'pr-[16px]'} ${tone}`} style={{ width: `calc(${span} / 12 * 100cqw)` }}>
        {cell.dots != null && <Dots shape="bar" value={cell.dots} max={2} size={22} />}
        {cell.big ? (
          <p className="text-headline">{cell.value}</p>
        ) : cell.dots == null ? (
          <p className="text-body">{cell.value}</p>
        ) : null}
        {row.bar && (
          <div className="h-[8px] w-full rounded-full bg-ink/10" aria-hidden="true">
            <motion.div
              className={`h-full rounded-full ${oscar ? 'bg-signal' : 'bg-current'}`}
              initial={grow ? { width: 0 } : false}
              animate={{ width: `${(cell.score / top) * 100}%` }}
              transition={{ duration: 0.7, ease: EASE, delay: grow && !entered ? delay : 0 }}
              onAnimationComplete={() => setEntered(true)}
            />
          </div>
        )}
        <p className="text-pretty text-body">{cell.note || (cell.dots != null ? cell.value : '')}</p>
      </div>
    </div>
  )
}

export function MFindTheFear({ aspect: aspectProp = 'aengste', oscar = true, chrome = true }: MFindTheFearProps) {
  const [aspectId, setAspectId] = useState<string>(aspectProp)
  useEffect(() => setAspectId(aspectProp), [aspectProp])
  const [removed, setRemoved] = useState<string[]>([])
  /** The table fades in on a tag change, not on load: the first paint (print, static build) is already settled. */
  const [switched, setSwitched] = useState(false)
  const aspect = ASPECTS.find((a) => a.id === aspectId) ?? ASPECTS[0]

  // Removed competitors stay in the grid as 0fr tracks, so the track list keeps its length and the browser can tween it.
  const cols: Col[] = [
    ...COMPETITORS.map((c) => ({ id: c.id, name: c.short ?? c.name })),
    ...(oscar ? [{ id: 'oscar', name: 'OSCAR heute' }] : []),
  ]
  const isActive = (id: string) => !removed.includes(id)
  const activeCols = cols.filter((c) => isActive(c.id))
  const ids = activeCols.map((c) => c.id)
  const n = Math.max(activeCols.length, 1)
  // Every column is a whole number of the slide's 12 half-columns, so its edge sits on a grid line:
  // each company gets `span`, the label column takes what is left. A column alone takes all the room beside the labels.
  const span = n === 1 ? 8 : Math.max(1, Math.min(4, Math.floor(10 / n)))
  const template = [`minmax(0, ${12 - n * span}fr)`, ...cols.map((c) => `minmax(0, ${isActive(c.id) ? span : 0}fr)`)].join(' ')
  // A removed column keeps the width it had, so it fades and closes without its text re-wrapping.
  const spans = useRef<Record<string, number>>({})
  for (const c of activeCols) spans.current[c.id] = span
  const spanOf = (id: string) => spans.current[id] ?? span
  const beforeOscarId = oscar ? activeCols.at(-2)?.id : undefined
  const gone = COMPETITORS.filter((c) => removed.includes(c.id))
  const gridMotion = 'transition-[grid-template-columns] duration-500 ease-frame motion-reduce:transition-none'

  return (
    <Slide n={3} scroll quietTitle kicker="OSCAR heute" title={<motion.span key={aspect.id} className="block" initial={switched ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>{aspect.title}</motion.span>} titleSpan={12} source={`Webseiten und Instagram-Profile, Stand ${RESEARCH_DATE}`} chrome={chrome}>
      <MotionConfig reducedMotion="user">
        {/* Tags: what to compare. Removed competitors wait behind the divider and come back with a click. */}
        <div className="flex shrink-0 flex-wrap items-center gap-[12px] pb-[24px]">
          {ASPECTS.map((a) => (
            <Pill key={a.id} layoutId="aspect-tag" selected={a.id === aspect.id} onClick={() => {
                setAspectId(a.id)
                setSwitched(true)
              }}>
              {a.label}
            </Pill>
          ))}
          {/* popLayout: a leaving tag leaves the flow at once, so the ones behind it glide into the gap. */}
          <AnimatePresence initial={false} mode="popLayout">
            {gone.length > 0 && (
              <motion.span
                key="divider"
                layout
                className="mx-[8px] h-[24px] w-px bg-ink/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                aria-hidden="true"
              />
            )}
            {gone.map((c) => (
              <motion.span
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Pill dashed onClick={() => setRemoved((r) => r.filter((x) => x !== c.id))}>
                  <span aria-hidden="true">+</span> {c.short ?? c.name}
                </Pill>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* The slide scrolls as a whole; the column header stays under the slide header. */}
        <div>
          <div className="relative pb-[40px]">
            {oscar && (
              <div
                className="absolute bottom-[40px] top-0 rounded-[12px] bg-stone transition-[left] duration-500 ease-frame motion-reduce:transition-none"
                // Bleeds 16px past the grid lines so the text inside still starts on them. Follows the OSCAR track as it moves.
                style={{ left: `calc(${((12 - span) / 12) * 100}% - 16px)`, right: -16 }}
                aria-hidden="true"
              />
            )}

            <div className={`sticky top-0 z-10 grid items-start bg-paper ${gridMotion}`} style={{ gridTemplateColumns: template }}>
              <span aria-hidden="true" />
              {cols.map((c) => (
                <div
                  key={c.id}
                  className={`group/head relative pb-[20px] pr-[12px] pt-[20px] ${c.id === 'oscar' ? '-mx-[16px] rounded-t-[12px] bg-stone px-[16px]' : `min-w-0 overflow-hidden transition-opacity duration-300 ease-frame motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${isActive(c.id) ? 'cursor-pointer opacity-100' : 'opacity-0'}`}`}
                  inert={c.id !== 'oscar' && !isActive(c.id)}
                  aria-hidden={c.id !== 'oscar' && !isActive(c.id)}
                  {...(c.id !== 'oscar' && {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `${c.name} entfernen`,
                    onClick: () => setRemoved((r) => [...r, c.id]),
                    onKeyDown: (e: KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setRemoved((r) => [...r, c.id])
                      }
                    },
                  })}
                >
                  <p className={`whitespace-nowrap pr-[64px] text-body ${c.id === 'oscar' ? 'text-signal' : 'text-ink'}`}>{c.name}</p>
                  <Dots
                    shape="bar"
                    value={totalPoints(aspect, c.id)}
                    max={maxPoints(aspect)}
                    tone={c.id === 'oscar' ? 'signal' : 'ink'}
                    size={maxPoints(aspect) > 4 ? 14 : 22}
                    className="mt-[12px] text-ink"
                  />
                  {c.id !== 'oscar' && (
                    <span
                      aria-hidden="true"
                      className="absolute right-[28px] top-[14px] grid size-[32px] place-items-center rounded-full bg-ink/[0.06] text-ink opacity-0 transition-[opacity,background-color,color] duration-300 ease-frame group-hover/head:bg-ink group-hover/head:text-paper group-hover/head:opacity-100 group-focus-visible/head:opacity-100"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 6h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Keyed by aspect: a tag click remounts the rows, which then rise in one after the other. */}
            <div key={aspect.id}>
            {activeCols.length === 0 ? (
              <p className="border-t border-ink/10 py-[28px] text-body text-mute">Alle Mitbewerber sind entfernt. Ein Klick auf einen Tag oben holt sie zurück.</p>
            ) : (
              aspect.rows.map((row, i) => (
                // Query container: the cells size their content against the row width (see Cell).
                <motion.div
                  key={row.label}
                  className={`relative grid items-start border-t border-ink/10 ${gridMotion}`}
                  style={{ gridTemplateColumns: template, containerType: 'inline-size' }}
                  initial={switched ? { opacity: 0, y: 14 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.07 }}
                >
                  <p className="text-balance py-[24px] pr-[24px] text-body text-ink">{row.label}</p>
                  {cols.map((c) => (
                    <Cell key={c.id} cell={row.cells[c.id]} row={row} ids={ids} col={c} span={spanOf(c.id)} active={isActive(c.id)} beforeOscar={c.id === beforeOscarId} grow={switched} delay={0.3 + i * 0.07} />
                  ))}
                </motion.div>
              ))
            )}

            {aspect.legend && (
              <div className="relative mt-[32px] flex gap-[40px]">
                {(['ja', 'teils', 'nein'] as const).map((k) => (
                  <span key={k} className="flex items-center gap-[10px] text-body text-mute">
                    <Dots shape="bar" value={k === 'ja' ? 2 : k === 'teils' ? 1 : 0} max={2} size={14} />
                    {COVERAGE_WORD[k]}
                  </span>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </MotionConfig>
    </Slide>
  )
}
