import { useEffect, useState } from 'react'
import { Slide } from './Slide'
import { RESEARCH_DATE } from './competitors'
import { OSCAR_ZIEL, byAnbieter, erzaehlenOf, fokusOf, quadrantOf, type AnbieterId } from './positionierung'
import { FigureCard, FigureGrid } from './figure'

export type MKostenProps = {
  /** Who takes the empty corner first: the competition (OSCAR waits) or OSCAR. Clicking the switch changes it live. */
  szenario?: 'ohne' | 'mit'
  chrome?: boolean
}

type Szenario = 'ohne' | 'mit'

type Step = { title: string; text: string }

/** Same three steps on both sides, so each row compares directly: OSCAR takes the empty corner first, or the competition does. */
const WITH: Step[] = [
  {
    title: 'OSCAR steht allein in der Ecke.',
    text: 'Fünf Massnahmen, von Alltags-Reels bis TikTok, heben OSCAR auf beiden Achsen auf rund 8 von 10 Punkten. Sonst steht dort niemand.',
  },
  {
    title: 'Wer die Angst auflöst, wird zur Antwort.',
    text: 'Ein Reel baut die Angst auf, etwa Vogeldreck vor dem Date, und das Unlimited-Abo löst sie auf. Die Kundschaft kommt ohne offene Frage an die Einfahrt.',
  },
  {
    title: 'Die Abos bleiben bei OSCAR.',
    text: 'Abos entstehen im November und Januar, in der Salz-Saison. Wer dann bei OSCAR abschliesst, wäscht den ganzen Winter hier.',
  },
]

const WITHOUT: Step[] = [
  {
    title: 'AVIA / Schätzle zieht ein.',
    text: 'AVIA hat in Luzern schon Menschen im Bild, Gewinnspiele und Vereine. Es fehlt nur der Erzählbogen: Ein paar Geschichten-Reels, und die Ecke gehört AVIA.',
  },
  {
    title: 'Wer nur Preise zeigt, bleibt austauschbar.',
    text: 'OSCAR hat 1 von 10 Punkten beim Kundenfokus und 2 beim Erzählen. Neben einer Marke mit Geschichten wirkt der Feed wie eine Preisliste.',
  },
  {
    title: 'Die Abos sind für ein Jahr weg.',
    text: 'Wer im Winter anderswo abschliesst, kommt frühestens nächsten Winter zurück.',
  },
]

/** The four cells of the positioning matrix, same two axes as the map in the appendix: how the content is told (rows) and who is in the centre (columns). */
const CELLS = [
  { col: 0, row: 0, label: 'Erzählt · Angebot' },
  { col: 1, row: 0, label: 'Erzählt · Kundschaft', target: true },
  { col: 0, row: 1, label: 'Grafiken · Angebot' },
  { col: 1, row: 1, label: 'Grafiken · Kundschaft' },
] as const

type Player = { id: AnbieterId; name: string; oscar?: boolean; at: Record<Szenario, [0 | 1, 0 | 1]> }

/** Cell of a provider from its points (Kundenfokus, Erzählen). */
const cellOf = (id: AnbieterId): [0 | 1, 0 | 1] => quadrantOf(fokusOf(byAnbieter(id)), erzaehlenOf(byAnbieter(id)))

/**
 * Where each provider stands, from the points of the analysis. Only OSCAR and AVIA move: the one who tells stories
 * first takes the top-right corner. OSCAR with the five measures reaches about 8 of 10 on both axes; AVIA already
 * has the customer focus (7) and only lacks the story, so it would climb on the second axis alone.
 */
const PLAYERS: Player[] = [
  { id: 'soft', name: 'Soft Car Wash', at: { ohne: cellOf('soft'), mit: cellOf('soft') } },
  { id: 'migrol', name: 'Migrol', at: { ohne: cellOf('migrol'), mit: cellOf('migrol') } },
  { id: 'avia', name: 'AVIA', at: { ohne: quadrantOf(fokusOf(byAnbieter('avia')), 8), mit: cellOf('avia') } },
  { id: 'waschman', name: 'Waschman', at: { ohne: cellOf('waschman'), mit: cellOf('waschman') } },
  { id: 'oscar', name: 'OSCAR', oscar: true, at: { ohne: cellOf('oscar'), mit: quadrantOf(...OSCAR_ZIEL) } },
]

const PAD = 24
const LABEL = 28
const CHIP = 36
const STEP_Y = 8

export function MKosten({ szenario: szenarioProp = 'ohne', chrome = true }: MKostenProps) {
  const [szenario, setSzenario] = useState<Szenario>(szenarioProp)
  useEffect(() => setSzenario(szenarioProp), [szenarioProp])

  return (
    <Slide
      kicker="Kosten des Nichtstuns"
      title="Wartet OSCAR, besetzt die Konkurrenz die leere Ecke und holt sich die Abos."
      titleSpan={12}
      lead="Heute verbindet niemand Kundenfokus mit Geschichten. Das Feld ist offen, aber nicht mehr lange."
      source={`Instagram-Profile, je die rund zwölf neuesten Beiträge · Abo-Preise OSCAR Silber · Stand ${RESEARCH_DATE}`}
      chrome={chrome}
    >
      <div className="grid-12 min-h-0 flex-1">
        {/* Left of the red axis: the competition matrix. The corner top right is the one the slide is about, it carries the signal ring. */}
        <div className="relative col-span-6 min-h-0 pr-[24px]">
          <FigureCard>
            <FigureGrid target>
              {CELLS.map((c) => (
                <p
                  key={c.label}
                  className="absolute text-body text-mute"
                  style={{ left: `calc(${c.col} * 50% + ${PAD}px)`, top: `calc(${c.row} * 50% + ${PAD}px)` }}
                >
                  {c.label}
                </p>
              ))}
              {PLAYERS.map((p) => {
                const [col, row] = p.at[szenario]
                // Players that share a cell stack under its label, in list order.
                const slot = PLAYERS.filter((q) => q.at[szenario][0] === col && q.at[szenario][1] === row).indexOf(p)
                return (
                  <span
                    key={p.id}
                    className={`absolute inline-flex items-center whitespace-nowrap rounded-full border-[1.5px] border-ink px-[16px] text-body transition-[left,top,background-color,color] duration-700 ease-frame motion-reduce:transition-none ${
                      p.oscar ? 'bg-ink text-paper' : 'bg-paper text-ink'
                    }`}
                    style={{
                      height: CHIP,
                      left: `calc(${col} * 50% + ${PAD}px)`,
                      top: `calc(${row} * 50% + ${PAD + LABEL + 12 + slot * (CHIP + STEP_Y)}px)`,
                    }}
                  >
                    {p.name}
                  </span>
                )
              })}
            </FigureGrid>
          </FigureCard>
        </div>

        {/* Right of the axis: switch the case, the three steps below follow. Both lists share one grid cell so the height stays put. */}
        <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
          <div role="group" aria-label="Szenario" className="flex gap-[8px]">
            <Switch active={szenario === 'mit'} onClick={() => setSzenario('mit')}>Mit Social Media</Switch>
            <Switch active={szenario === 'ohne'} onClick={() => setSzenario('ohne')}>Ohne Social Media</Switch>
          </div>
          <div className="mt-[24px] grid">
            <Steps steps={WITH} show={szenario === 'mit'} />
            <Steps steps={WITHOUT} show={szenario === 'ohne'} />
          </div>
        </div>
      </div>
    </Slide>
  )
}

function Switch({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-[36px] items-center rounded-full px-[16px] text-body transition-colors duration-500 ease-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
        active ? 'bg-ink text-paper' : 'bg-ink/[0.06] text-ink hover:bg-ink/10'
      }`}
    >
      {children}
    </button>
  )
}

function Steps({ steps, show }: { steps: Step[]; show: boolean }) {
  return (
    <ol
      aria-hidden={!show}
      className={`col-start-1 row-start-1 flex flex-col gap-[20px] transition-opacity ease-frame motion-reduce:transition-none ${
        show ? 'opacity-100 duration-500 delay-200' : 'pointer-events-none opacity-0 duration-200'
      }`}
    >
      {steps.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[40px_1fr] items-baseline">
          <span className="text-body tabular-nums text-mute">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <p className="text-balance text-body text-ink">{s.title}</p>
            <p className="mt-[4px] max-w-[60ch] text-pretty text-body text-mute">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
