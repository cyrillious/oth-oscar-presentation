import { Slide } from './Slide'
import { SIGNAL_RING, SURFACE, Tag } from './ui'

export type S15PaketeProps = {
  /** Package with the signal ring and the «Empfohlen» tag: the slide's one red accent. */
  recommended?: 'Start' | 'Standard' | 'Pro'
  /** Dark pilot box as fourth column. */
  pilot?: boolean
  chrome?: boolean
}

const PACKAGES = [
  { name: 'Start', price: "2'500–3'500", scope: ['4 Reels pro Monat'] },
  { name: 'Standard', price: "4'500–6'000", scope: ['8 Reels pro Monat', 'Versionen für die Bildschirme vor Ort'] },
  { name: 'Pro', price: "7'000–9'000", scope: ['12 Reels pro Monat', 'Community-Betreuung', 'Workshop pro Quartal'] },
] as const

const ALWAYS = ['Drehtag', 'Schnitt', 'Planung', 'Report']

export function S15Pakete({ recommended = 'Standard', pilot = true, chrome = true }: S15PaketeProps) {
  // Three cards = col-span-4 each; with the pilot box four cards = col-span-3 each. gap-x-5 between.
  const span = pilot ? 'col-span-3' : 'col-span-4'
  return (
    <Slide n={15} tone="white" kicker="Pakete" title="Drei Pakete. Wir empfehlen Standard." chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 gap-x-5">
        {PACKAGES.map((p) => {
          const rec = p.name === recommended
          return (
            <div key={p.name} className={`${span} flex min-h-0 flex-col p-[32px] ${SURFACE} ${rec ? SIGNAL_RING : ''}`}>
              <div className="flex h-[44px] items-center justify-between gap-[12px]">
                <p className="text-headline text-ink">{p.name}</p>
                {rec && <Tag>Empfohlen</Tag>}
              </div>
              <p className="mt-[24px] text-body text-mute">CHF</p>
              <p className="mt-[4px] whitespace-nowrap text-headline text-ink tabular-nums">{p.price}</p>
              <p className="mt-[4px] text-body text-mute">pro Monat · Richtwert</p>
              <ul className="mt-[24px] flex flex-col border-t border-ink/10">
                {p.scope.map((s) => (
                  <li key={s} className="text-pretty border-b border-ink/10 py-[10px] text-body text-ink">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-[20px] text-body text-mute">Inkl. {ALWAYS.join(', ')}</p>
            </div>
          )
        })}

        {pilot && (
          <div className={`${span} flex min-h-0 flex-col rounded-[12px] bg-ink p-[32px] text-paper`}>
            <Tag tone="dark" className="self-start">Nächster Schritt</Tag>
            <p className="mt-[24px] text-headline">Pilot: 3 Monate</p>
            <p className="mt-[12px] max-w-[24ch] text-pretty text-body text-paper/50">November bis Januar, in der Salz-Saison.</p>
            <p className="mt-[24px] border-t border-paper/10 pt-[16px] text-body text-paper">Danach Entscheid anhand der KPIs.</p>
            <span className="mt-auto inline-flex h-[48px] items-center justify-center rounded-full bg-paper px-[24px] text-body text-ink">
              Pilot starten
            </span>
          </div>
        )}
      </div>
    </Slide>
  )
}
