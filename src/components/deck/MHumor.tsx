import { Slide } from './Slide'

export type MHumorProps = {
  /** Rows that pair each fear with the sketch that carries it. */
  mapping?: boolean
  chrome?: boolean
}

const PAIRS = [
  { fear: 'Sozial', sketch: 'Die Beifahrer-Panik' },
  { fear: 'Finanziell', sketch: 'Das günstigste Spa der Zentralschweiz' },
  { fear: 'Zeit', sketch: 'Der Samichlaus auf Tour' },
]

/**
 * Janick's slide 6: the marketing strategy rests on humour. «Humor.» in display size left of the axis is the
 * slide's one signal accent; the reason (every joke holds some truth) right of it, and under it each fear paired
 * with the sketch that packs it.
 */
export function MHumor({ mapping = true, chrome = true }: MHumorProps) {
  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 content-start pt-[48px]">
        <div className="col-span-6">
          <p className="text-body text-mute">Unsere Marketingstrategie</p>
          <h2 className="mt-[16px] text-display text-signal">Humor.</h2>
        </div>
        <div className="col-span-6 col-start-7 pl-4">
          <p className="text-balance text-headline text-ink">In jedem Witz steckt ein bisschen Wahrheit.</p>
          <p className="mt-[24px] max-w-[42ch] text-pretty text-body text-mute">
            Ängste verpackt man am besten in Sketche: Man lacht, erkennt sich wieder, und OSCAR bleibt im Kopf.
          </p>
          {mapping && (
            <dl className="mt-[48px] border-b border-ink/10">
              {PAIRS.map((p) => (
                <div key={p.fear} className="grid grid-cols-[120px_1fr] border-t border-ink/10 py-[14px] text-body">
                  <dt className="text-mute">{p.fear}</dt>
                  <dd className="text-ink">«{p.sketch}»</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Slide>
  )
}
