import { Slide } from './Slide'
import { Tag } from './ui'

export type A1ShotlistProps = {
  /** Fill the template with the example reel, or show empty rows. */
  example?: boolean
  chrome?: boolean
}

const HEAD = ['Shot', 'Dauer', 'Bild', 'Ton', 'Text-Overlay', 'Hook-Variante', 'Freigabe']
const ROWS = [
  ['1 Hook', '0–2 s', 'Close-up: roter Saugschlauch, Hand an der Düse', 'Originalton Sauger', '«Wir stoppen hier nicht die Zeit.»', 'A: Saugen · B: Rechnung'],
  ['2 Problem', '2–7 s', 'Fussraum mit Krümeln und Laub', 'Voice-over', '«Fussraum voller Krümel? Kennen wir.»', '–'],
  ['3 Zeigen', '7–25 s', 'Einfahrt, Schaum, Textil-Lappen, Trocknen, Saugen', 'Anlagen-Sound', 'Untertitel', '–'],
  ['4 Beweis', '25–32 s', 'Vorher/Nachher Fussraum', 'Voice-over', '«Gratis nach jeder Wäsche, ohne Zeitlimit.»', '–'],
  ['5 CTA', '32–38 s', 'Saugerplätze Emmen, Totale', 'Voice-over', '«Unlimited abschliessen, Link im Profil»', '–'],
]

// Columns on half-column edges (1 · 1 · 3 · 1 | 3 · 2 · 1); «Ton» ends on the axis, «Text-Overlay»
// starts right of it with the 16px air. Appendix slide: cells in text-body.
const COLS = [
  'col-span-1 pr-4',
  'col-span-1 pr-4 text-mute tabular-nums',
  'col-span-3 pr-[20px]',
  'col-span-1 pr-4',
  'col-span-3 pl-4 pr-[20px]',
  'col-span-2 pr-[20px]',
  'col-span-1',
]

export function A1Shotlist({ example = true, chrome = true }: A1ShotlistProps) {
  return (
    <Slide n="Anhang A12" kicker="Anhang" title="Vorlage: Shotlist pro Reel" chrome={chrome}>
      <div className="mb-[24px] flex items-center gap-[12px]">
        {example && <Tag tone="red">Beispiel-Reel «Saugen»</Tag>}
        <Tag>9:16 · 38 Sekunden</Tag>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="grid-12 pb-[12px] text-body text-mute">
          {HEAD.map((h, j) => (
            <span key={h} className={COLS[j]}>
              {h}
            </span>
          ))}
        </div>
        <div className="flex flex-1 flex-col">
          {ROWS.map((r, i) => (
            <div key={i} className="grid-12 flex-1 items-center border-t border-ink/10 py-[12px] text-body text-ink">
              {(example ? r : [r[0], '', '', '', '', '']).map((c, j) => (
                <span key={j} className={`text-pretty ${COLS[j]}`}>
                  {c}
                </span>
              ))}
              <span className={COLS[6]}>
                <span className="block size-[24px] rounded-full border border-ink/25" aria-label="Freigabe offen" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}
