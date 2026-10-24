import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Slide } from './Slide'
import { RESEARCH_DATE } from './competitors'
import { FigureCard, FigureGrid } from './figure'
import { ANBIETER, OSCAR_ZIEL, erzaehlenOf, fokusOf, type Anbieter, type AnbieterId } from './positionierung'

export type MKonkurrenzMapProps = {
  /** Provider that is selected when the slide loads. Clicking a dot or a row selects live. */
  auswahl?: AnbieterId | 'keine'
  chrome?: boolean
}

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")

/** Dot area follows the Instagram followers; the largest (Migrol) is 18 % of the field. */
const MAX_FOLLOWERS = Math.max(...ANBIETER.map((a) => a.followers))
const sizePct = (a: Anbieter) => Math.max(5, 18 * Math.sqrt(a.followers / MAX_FOLLOWERS))

/** Row order: OSCAR first, the rest by followers. */
const ROWS = [...ANBIETER].sort((a, b) => (a.id === 'oscar' ? -1 : b.id === 'oscar' ? 1 : b.followers - a.followers))

const EASE = [0.14, 0.71, 0.16, 0.99] as const
const oscar = ANBIETER.find((a) => a.id === 'oscar')!

/**
 * Positioning matrix as a figure (grid field in a white card, dots, one line): x = who is in the centre (the plant
 * and the offer on the left, the customer and their situation on the right), y = how it is told (offer graphic at
 * the bottom, story with emotion on top). Dot area is the Instagram followers. The empty top-right quarter carries
 * the slide's one signal ring; the line is the way OSCAR can take. Right of the red axis the five providers with
 * their points; a click on a dot or a row opens what the feed shows.
 */
export function MKonkurrenzMap({ auswahl = 'keine', chrome = true }: MKonkurrenzMapProps) {
  const [sel, setSel] = useState<AnbieterId | null>(auswahl === 'keine' ? null : auswahl)
  useEffect(() => setSel(auswahl === 'keine' ? null : auswahl), [auswahl])
  const calm = useReducedMotion()

  const toggle = (id: AnbieterId) => setSel((s) => (s === id ? null : id))
  const pos = (x: number, y: number) => ({ left: `${x * 10}%`, top: `${(10 - y) * 10}%` })

  return (
    <Slide
      kicker="Konkurrenzanalyse"
      title="Kundschaft im Mittelpunkt und echte Geschichten: dort steht niemand."
      titleSpan={12}
      lead="OSCAR startet unten links, hat die Zutaten für oben rechts aber im Haus."
      source={`Instagram-Profile, je die rund zwölf neuesten Beiträge, Einschätzung ohne Engagement-Zahlen · Stand ${RESEARCH_DATE}`}
      chrome={chrome}
    >
      <div className="grid-12 min-h-0 flex-1">
        {/* Left of the red axis: the figure, square, with the axis names around it. */}
        <div className="col-span-6 min-h-0 pr-[24px]">
          <div className="grid aspect-square h-full grid-cols-[28px_1fr] grid-rows-[1fr_32px]">
            <p className="flex justify-between text-body text-mute [writing-mode:vertical-rl] rotate-180">
              <span>Angebotsgrafik</span>
              <span>Geschichte mit Emotion</span>
            </p>

            <FigureCard>
              <FigureGrid target>
                {/* Way OSCAR can take: from today's position to the 8 of 10 the five measures reach. */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full overflow-visible">
                  <motion.path
                    d={`M${fokusOf(oscar) * 10} ${(10 - erzaehlenOf(oscar)) * 10} L${OSCAR_ZIEL[0] * 10} ${(10 - OSCAR_ZIEL[1]) * 10}`}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={calm ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
                  />
                </svg>
                <motion.span
                  aria-hidden
                  className="absolute size-[28px] rounded-full border-[1.5px] border-ink bg-stone"
                  style={{ ...pos(...OSCAR_ZIEL), translate: '-50% -50%' }}
                  initial={calm ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
                />
                <span className="absolute text-body text-mute" style={{ ...pos(...OSCAR_ZIEL), translate: '24px -50%' }}>
                  Ziel
                </span>
                <span className="absolute right-[16px] top-[12px] text-body text-mute">Niemand</span>

                {ANBIETER.map((a, i) => {
                  const active = sel === a.id
                  const key = a.id === 'oscar'
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a.id)}
                      aria-pressed={active}
                      aria-label={`${a.name}: Kundenfokus ${fokusOf(a)}, Erzählen ${erzaehlenOf(a)}`}
                      className="group/dot absolute aspect-square focus-visible:outline-none"
                      style={{ ...pos(fokusOf(a), erzaehlenOf(a)), width: `${sizePct(a)}%`, translate: '-50% -50%' }}
                    >
                      <motion.span
                        className={`block size-full rounded-full transition-[background-color,box-shadow] duration-500 ease-frame group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-signal ${
                          key ? 'bg-ink' : 'border-[1.5px] border-ink bg-paper group-hover/dot:bg-ink/15'
                        } ${key || active ? 'shadow-[0_0_0_5px_var(--color-stone),0_0_0_6.5px_var(--color-ink)]' : ''}`}
                        initial={calm ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
                      />
                      <span className="absolute left-1/2 top-full mt-[12px] -translate-x-1/2 whitespace-nowrap text-body text-ink">{a.short}</span>
                    </button>
                  )
                })}
              </FigureGrid>
            </FigureCard>

            <span />
            <p className="flex justify-between text-body text-mute">
              <span>Anlage und Angebot</span>
              <span>Kundschaft und ihre Situation</span>
            </p>
          </div>
        </div>

        {/* Right of the axis: the five providers, a click opens what their feed shows. */}
        <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
          <div className="grid grid-cols-[1fr_128px_104px_88px] items-baseline border-b border-ink/10 pb-[12px] text-body text-mute">
            <span>Anbieter</span>
            <span>Kundenfokus</span>
            <span>Erzählen</span>
            <span>Follower</span>
          </div>
          {ROWS.map((a) => (
            <Row key={a.id} a={a} open={sel === a.id} dim={sel != null && sel !== a.id} onClick={() => toggle(a.id)} />
          ))}
          <p className="mt-[16px] text-body text-mute">Punkte von 0 bis 10. Happy Car Wash ist nicht bewertet: kein Social-Kanal verlinkt.</p>
        </div>
      </div>
    </Slide>
  )
}

function Row({ a, open, dim, onClick }: { a: Anbieter; open: boolean; dim: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`block w-full border-b border-ink/10 py-[12px] text-left transition-opacity duration-500 ease-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
        dim ? 'opacity-55 hover:opacity-100' : ''
      }`}
    >
      <span className="grid grid-cols-[1fr_128px_104px_88px] items-baseline text-body tabular-nums text-ink">
        <span>{a.id === 'oscar' ? 'OSCAR heute' : a.name}</span>
        <span>{fokusOf(a)}</span>
        <span>{erzaehlenOf(a)}</span>
        <span>{fmt(a.followers)}</span>
      </span>
      <span
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-frame ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        aria-hidden={!open}
      >
        <span className="block min-h-0 overflow-hidden">
          <span className="mt-[4px] block max-w-[52ch] text-pretty text-body text-mute">{a.feed}</span>
        </span>
      </span>
    </button>
  )
}
