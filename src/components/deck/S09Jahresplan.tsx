import { Slide } from './Slide'
import { Ph } from './ui'

export type S09JahresplanProps = {
  /** Red bracket over November to January: the pilot. */
  pilot?: boolean
  /** Row with the subscription peaks (January, November). */
  peaks?: boolean
  chrome?: boolean
}

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

// One month per half-column. Start and span as literal classes so Tailwind sees them.
type Band = { cls: string; title: string; sub: string; dark?: boolean }
const BANDS: Band[] = [
  { cls: 'col-start-1 col-span-2', title: 'Salz', sub: 'und Unterboden', dark: true },
  { cls: 'col-start-3 col-span-3', title: 'Pollen', sub: 'März bis Mai' },
  { cls: 'col-start-6 col-span-3', title: 'Insekten und Ferien', sub: 'Juni bis August' },
  { cls: 'col-start-9 col-span-1', title: 'Laub', sub: 'Sep' },
  { cls: 'col-start-10 col-span-3', title: 'Salz und Unterboden', sub: 'Oktober bis Februar', dark: true },
]

// The 12 months sit exactly on the 12 half-columns. Season blocks are stone (winter ink), 20px
// apart (gap-x-5). The pilot bracket (November to January) is the slide's one signal accent;
// the subscription peaks are ink dots.
export function S09Jahresplan({ pilot = true, peaks = true, chrome = true }: S09JahresplanProps) {
  return (
    <Slide n={9} kicker="Jahresplan nach Saison" title="Das Wetter schreibt den Redaktionsplan." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* pilot bracket */}
        <div className="grid-12 h-[32px] gap-x-5">
          {pilot && (
            <>
              <div className="col-span-1 col-start-1 flex flex-col justify-end">
                <span className="text-body text-ink">bis Jan</span>
                <span className="mt-[6px] h-[3px] rounded-full bg-signal" />
              </div>
              <div className="col-span-2 col-start-11 flex flex-col justify-end">
                <span className="text-body text-ink">Pilot ab November</span>
                <span className="mt-[6px] h-[3px] rounded-full bg-signal" />
              </div>
            </>
          )}
        </div>

        {/* months */}
        <div className="mt-[12px] grid-12 gap-x-5">
          {MONTHS.map((m) => (
            <span key={m} className="text-body text-mute">
              {m}
            </span>
          ))}
        </div>

        {/* season blocks */}
        <div className="mt-[12px] grid-12 min-h-0 flex-1 gap-x-5">
          {BANDS.map((b) => (
            <div
              key={b.cls}
              className={`${b.cls} flex flex-col justify-end rounded-[12px] p-[20px] ${b.dark ? 'bg-ink text-paper' : 'bg-stone text-ink'}`}
            >
              <p className="text-balance text-body">{b.title}</p>
              <p className={`mt-[4px] text-body ${b.dark ? 'text-paper/50' : 'text-mute'}`}>{b.sub}</p>
            </div>
          ))}
        </div>

        {/* subscription peaks */}
        {peaks && (
          <div className="mt-[28px] flex flex-col gap-[12px]">
            <div className="grid-12">
              <div className="col-span-6 flex items-center gap-[12px]">
                <span className="size-[10px] shrink-0 rounded-full bg-ink" />
                <span className="text-body text-ink">Abo-Peak: Jahresabo im Januar</span>
              </div>
              <div className="col-span-6 col-start-7 flex items-center gap-[12px] justify-self-end">
                <span className="size-[10px] shrink-0 rounded-full bg-ink" />
                <span className="text-body text-ink">Abo-Peak: Wintereinstieg im November</span>
              </div>
            </div>
            <p className="text-body text-mute">
              Aktionen zu den Peaks: <Ph>Aktionen mit OSCAR klären</Ph>
            </p>
          </div>
        )}
      </div>
    </Slide>
  )
}
