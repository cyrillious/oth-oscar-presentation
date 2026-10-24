import { Slide } from './Slide'
import { Box, BoxRecommended } from './ui'

export type S12RegelnProps = {
  /** Frame the legal box in red. */
  highlightLegal?: boolean
  chrome?: boolean
}

const GROUPS: { label: string; rules: string[]; legal?: boolean }[] = [
  {
    label: 'Ton',
    rules: ['Ton vor Bild, mit Ansteckmikrofon', 'Voice-over separat aufnehmen', 'Keine KI-Stimme und kein Avatar'],
  },
  {
    label: 'Bild und Text',
    rules: ['«Raw», aber sauber geschnitten', 'Immer Untertitel', 'CTA immer auch als Text im Bild'],
  },
  {
    label: 'Recht',
    legal: true,
    rules: ['Kennzeichen und Gesichter nur mit Einwilligung, sonst unkenntlich (nDSG)', 'Nur lizenzierte Musik'],
  },
]

// Three cards à col-span-4 with the skill's 20px gutter. The one signal accent is the ring on «Recht».
export function S12Regeln({ highlightLegal = true, chrome = true }: S12RegelnProps) {
  return (
    <Slide n={12} kicker="Produktionsregeln" title="Roh im Look. Sauber im Handwerk." chrome={chrome}>
      <div className="grid-12 flex-1 gap-x-5">
        {GROUPS.map((g) => {
          const Wrap = g.legal && highlightLegal ? BoxRecommended : Box
          return (
            <Wrap key={g.label} className="col-span-4 flex flex-col">
              <h3 className="text-balance text-headline text-ink">{g.label}</h3>
              <ul className="mt-[32px] flex flex-col">
                {g.rules.map((r) => (
                  <li key={r} className="text-pretty border-t border-ink/10 py-[16px] text-body text-ink">
                    {r}
                  </li>
                ))}
              </ul>
            </Wrap>
          )
        })}
      </div>
    </Slide>
  )
}
