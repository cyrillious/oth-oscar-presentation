import { Slide } from './Slide'
import { SURFACE, Tag } from './ui'

export type S06SaeulenProps = {
  /** Four columns in a row, or a 2 × 2 grid. */
  columns?: '4' | '2'
  chrome?: boolean
}

const PILLARS = [
  { title: 'Saison & Pflege', tags: ['Salz', 'Pollen', 'Insekten', 'Laub'] },
  { title: 'Hinter der Anlage', tags: ['Technik', 'Lappen', 'Team'] },
  { title: 'Unlimited-Alltag', tags: ['Abonnierende', 'Rechnung', 'Wallet'] },
  { title: 'Standort & Community', tags: ['Saugerplätze', 'Sonntag', 'Stammkunden'] },
]

// Four cards = col-span-3 each, two per row = col-span-6 each, 20px gap (gap-x-5). Numbers and
// tags stay ink/mute: the four pillars are equal, so the slide has no signal accent.
export function S06Saeulen({ columns = '4', chrome = true }: S06SaeulenProps) {
  const four = columns === '4'
  return (
    <Slide n={6} kicker="Content-Säulen" title="Vier Säulen. Damit uns die Themen nie ausgehen." chrome={chrome}>
      <div className={`grid-12 min-h-0 flex-1 gap-x-5 ${four ? '' : 'grid-rows-2 gap-y-5'}`}>
        {PILLARS.map((p, i) => (
          <div
            key={p.title}
            className={`${SURFACE} flex p-[32px] ${four ? 'col-span-3 flex-col' : 'col-span-6 flex-col justify-between'}`}
          >
            <span className="text-body text-mute tabular-nums">0{i + 1}</span>
            <p className="mt-[12px] text-balance text-headline text-ink">{p.title}</p>
            <div className="mt-auto flex flex-wrap gap-[8px] pt-[24px]">
              {p.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}
