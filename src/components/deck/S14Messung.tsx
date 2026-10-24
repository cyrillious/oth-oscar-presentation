import { Slide } from './Slide'
import { Box, SIGNAL_RING } from './ui'

export type S14MessungProps = {
  /** Funnel from hook rate to subscription across the top. */
  funnel?: boolean
  chrome?: boolean
}

const FUNNEL = ['Hook-Rate (3 Sek.)', 'Wiedergabe bis zum Ende', 'Saves und Shares', 'Profilbesuche und Link-Klicks', 'Abo-Abschlüsse']

const GROUPS = [
  { label: 'Pro Reel', items: ['Hook-Rate (3 Sek.)', 'Wiedergabe bis zum Ende', 'Saves', 'Shares'] },
  { label: 'Pro Monat', items: ['Profilbesuche', 'Link-Klicks', 'Abo-Abschlüsse via UTM in GA4 des Shops'] },
  { label: 'Report', items: ['Monatlich', '1 Seite', 'Was lief, was fliegt raus, was testen wir als Nächstes'] },
]

// Chain and cards share one grid (col-span-2 steps, col-span-4 cards, 20px gutter), so the
// goal «Abo-Abschlüsse» sits exactly above «Report». Its signal ring is the slide's one accent.
export function S14Messung({ funnel = true, chrome = true }: S14MessungProps) {
  return (
    <Slide n={14} kicker="Messung" title="Jedes Reel wird gemessen. Jeder Abschluss wird zugeordnet." chrome={chrome}>
      <div className="flex flex-1 flex-col gap-y-[32px]">
        {funnel && (
          <ol className="relative grid-12 gap-x-5">
            {/* Hairline that threads the steps into one chain. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
            {FUNNEL.map((f, i) => {
              const last = i === FUNNEL.length - 1
              return (
                <li
                  key={f}
                  className={`relative flex h-[72px] items-center justify-center rounded-full px-[20px] text-center ${
                    last
                      ? `col-span-4 bg-paper text-body text-ink ${SIGNAL_RING}`
                      : 'col-span-2 text-balance border border-ink/15 bg-paper text-body text-ink'
                  }`}
                >
                  {f}
                </li>
              )
            })}
          </ol>
        )}
        <div className="grid-12 flex-1 gap-x-5">
          {GROUPS.map((g) => (
            <Box key={g.label} className="col-span-4 flex flex-col">
              <h3 className="text-headline text-ink">{g.label}</h3>
              <ul className="mt-[24px] flex flex-col gap-y-[10px]">
                {g.items.map((it) => (
                  <li key={it} className="flex items-baseline gap-x-[16px] text-pretty text-body text-ink">
                    <span aria-hidden="true" className="size-[6px] shrink-0 -translate-y-[6px] rounded-full bg-ink/40" />
                    {it}
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </div>
      </div>
    </Slide>
  )
}
