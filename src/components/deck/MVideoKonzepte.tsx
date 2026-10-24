import { Fragment } from 'react'
import { Slide } from './Slide'

export type MVideoKonzepteProps = {
  chrome?: boolean
}

const CHAIN = ['Strategy', 'Wallet-Abo', 'Humor-Videos']

const STORIES = ['Die Date-Rettung', '8 Minuten Pause im Schaum', 'Der Samichlaus, der sich auf seiner Tour selbst die OSCAR Weihnachts-Aktion krallt']

/**
 * The real value across all locations: the promise left of the axis (with the chain strategy, wallet
 * subscription, humour videos), the three stories right of it. The closing line carries the slide's one signal accent.
 */
export function MVideoKonzepte({ chrome = true }: MVideoKonzepteProps) {
  return (
    <Slide title="Standortübergreifende Video-Konzepte: Serie, Hero, Comedy." titleSpan={12} chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        <div className="col-span-5 flex flex-col">
          <p className="text-body text-mute">Der eigentliche Wert</p>
          <p className="mt-[8px] text-balance text-headline text-ink">«Wir verkaufen 8 Minuten Lebens-Kontrolle und Ruhe.»</p>
          <div className="mt-auto flex items-center">
            {CHAIN.map((c, i) => (
              <Fragment key={c}>
                {i > 0 && <span aria-hidden="true" className="h-px w-[24px] shrink-0 bg-ink/30" />}
                <span className="inline-flex h-[40px] shrink-0 items-center rounded-full border border-ink/25 px-[18px] text-body text-ink">{c}</span>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="col-span-6 col-start-7 flex flex-col pl-4">
          <p className="text-body text-mute">Ob …</p>
          <ol className="mt-[8px]">
            {STORIES.map((s, i) => (
              <li key={s} className="grid grid-cols-[40px_1fr] items-baseline border-t border-ink/10 py-[16px]">
                <span className="text-body text-mute tabular-nums">0{i + 1}</span>
                <span className="text-pretty text-body text-ink">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-auto border-t border-ink/10 pt-[16px] text-balance text-headline text-signal">Das Abo im Wallet ist immer der Held.</p>
        </div>
      </div>
    </Slide>
  )
}
