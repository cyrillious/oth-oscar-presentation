import { Slide } from './Slide'
import { Box, BoxRecommended, Label } from './ui'

export type S05KlischeesProps = {
  /** Cliché and twist side by side, or stacked. */
  arrangement?: 'split' | 'stacked'
  chrome?: boolean
}

const CLICHES = ['Schaum in Zeitlupe', 'Epische Musik']
const TWISTS = [
  { title: 'Echter Anlagen-Sound', text: 'Rauschen, Lappen, Gebläse. Ansteckmikrofon statt Musikbett.' },
  { title: 'Echte Menschen', text: 'Team und Stammkunden, nur mit Einwilligung vor der Kamera.' },
  { title: 'Echter Dreck', text: 'Salzkruste, Pollen, Insekten. Vorher zeigen, was nachher weg ist.' },
]

// Split: the cliché left of the axis (col-span-5, one free half-column), the twist right of it
// (col-start-7 col-span-6). Stacked: both full width. The twist box carries the one signal ring.
export function S05Klischees({ arrangement = 'split', chrome = true }: S05KlischeesProps) {
  const split = arrangement === 'split'
  return (
    <Slide
      n={5}
      kicker="Klischees, die wir vermeiden"
      title="Kein Schaum in Zeitlupe. Echter Sound, echte Menschen, echter Dreck."
      source="Pip-Karte: Category Clichés"
      chrome={chrome}
    >
      <div className={`grid-12 min-h-0 flex-1 ${split ? '' : 'grid-rows-[auto_1fr] gap-y-5'}`}>
        <Box className={split ? 'col-span-5 flex flex-col' : 'col-span-12 flex items-baseline gap-[48px] !py-[24px]'}>
          <Label className={split ? '' : 'w-[200px] shrink-0'}>Das Klischee der Branche</Label>
          <div className={split ? 'mt-[24px] flex flex-col gap-[16px]' : 'flex gap-[48px]'}>
            {CLICHES.map((c) => (
              <span key={c} className="text-headline text-mute line-through decoration-[2px]">
                {c}
              </span>
            ))}
          </div>
        </Box>
        <BoxRecommended className={`flex flex-col ${split ? 'col-span-6 col-start-7' : 'col-span-12'}`}>
          <Label>Unsere Wendung</Label>
          <div className={split ? 'mt-[24px] flex flex-1 flex-col justify-between' : 'mt-[24px] grid flex-1 grid-cols-3 gap-x-[32px]'}>
            {TWISTS.map((t) => (
              <div key={t.title}>
                <p className="text-balance text-headline text-ink">{t.title}</p>
                <p className="mt-[4px] text-pretty text-body text-mute">{t.text}</p>
              </div>
            ))}
          </div>
        </BoxRecommended>
      </div>
    </Slide>
  )
}
