import { FigWeird } from './weird/Figure'
import { FigOnly } from './only/Figure'
import { FigCompetitor } from './competitor/Figure'
import { FigRealProduct } from './realproduct/Figure'

const FIGURES = {
  weirding: FigWeird,
  only: FigOnly,
  competitor: FigCompetitor,
  realproduct: FigRealProduct,
} as const

export type FigureKey = keyof typeof FIGURES

/** The four Anatomy figures of the method slides, each in a stone panel the size of the slide's panel (760 × 640). */
export function FigureSheet({ show = 'alle', columns = '2' }: { show?: FigureKey | 'alle'; columns?: '1' | '2' }) {
  const keys = (show === 'alle' ? Object.keys(FIGURES) : [show]) as FigureKey[]
  return (
    <div className="grid gap-6 bg-paper p-8" style={{ gridTemplateColumns: `repeat(${keys.length > 1 ? Number(columns) : 1}, minmax(0, 760px))` }}>
      {keys.map((k) => {
        const Fig = FIGURES[k]
        return (
          <div key={k} className="relative aspect-[760/640] w-full overflow-hidden rounded-[12px] bg-stone">
            <Fig />
          </div>
        )
      })}
    </div>
  )
}
