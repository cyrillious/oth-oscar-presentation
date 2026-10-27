import { useEffect, useState } from 'react'
import { Slide } from './Slide'
import { Tag } from './ui'

export type HeroIdee = 'aelpler' | 'ursprung'

export type MHeroFilmProps = {
  /** Which image film idea the slide shows (Janick, slides 8 and 9). */
  idee?: HeroIdee
  /** Index of the slogan that is picked when the slide loads (0–2). */
  slogan?: number
  /** Rough marker sketch of the film under the title. */
  sketch?: boolean
  chrome?: boolean
}

type Idea = {
  nr: string
  name: string
  visuals: string
  vibe: string[]
  slogans: string[]
  sketch: string
  sketchAlt: string
}

const IDEAS: Record<HeroIdee, Idea> = {
  aelpler: {
    nr: '1',
    name: 'Der Älpler',
    visuals:
      'Ein Auto fährt durch eine epische, dreckige Alpenlandschaft und wird immer schmutziger. Auf einem Hof warten zwei OSCAR-Mitarbeiter in Älpler-Tracht. Mit Holzeimer, altem Lappen, Naturschwamm und handgeschnitztem Holzschild waschen sie das Auto mit grösster Hingabe.',
    vibe: ['Humorvoll', 'Heimatverbunden', 'Unerwarteter Kontrast'],
    slogans: ['So rein wie unsere Berge.', 'Schweizer Tradition. Modernes Finish.', 'Aus Liebe zum Detail. Seit heute.'],
    sketch: '/images/hero-sketch/aelpler.webp',
    sketchAlt: 'Skizze: Zwei Männer in Tracht waschen mit Holzeimer und Schwamm ein dreckiges Auto vor Bergen.',
  },
  ursprung: {
    nr: '2',
    name: 'Der Ursprung',
    visuals:
      'Eine Zeitreise: Der kleine Oscar ist schon als Kind besessen vom Autowaschen und baut eine winzige, detailverliebte Waschstrasse für seine Spielzeugautos. Harter Schnitt in die Gegenwart: Der erwachsene Oscar steht vor der riesigen, modernen Anlage. Dieselbe Hingabe, nur etwas grösser.',
    vibe: ['Emotional', 'Inspirierend', 'Storytelling mit Herz'],
    slogans: ['Grosse Träume beginnen im Kleinen.', 'Schon immer besessen von Sauberkeit.', 'Die Leidenschaft wächst. Das Ergebnis glänzt.'],
    sketch: '/images/hero-sketch/ursprung.webp',
    sketchAlt: 'Skizze: Ein Junge wäscht Spielzeugautos in einer Mini-Waschstrasse, daneben steht er als Erwachsener vor einer grossen Anlage.',
  },
}

/**
 * Hero content, one image film idea per slide. Left of the axis: the film's name and a marker sketch of it.
 * Right of it: what we see, the vibe, and three slogan options to pick from. The picked slogan is the slide's
 * one signal accent (red bar), so the room can choose live.
 */
export function MHeroFilm({ idee = 'aelpler', slogan = 0, sketch = true, chrome = true }: MHeroFilmProps) {
  const idea = IDEAS[idee]
  const [pick, setPick] = useState(slogan)
  useEffect(() => setPick(slogan), [slogan, idee])

  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 pt-[40px]">
        <div className="col-span-6 flex min-h-0 flex-col pr-4">
          <p className="text-body text-mute">Hero Content · Imagefilm {idea.nr}</p>
          <h2 className="mt-[16px] text-balance text-display text-ink">{idea.name}</h2>
          {sketch && (
            <img
              src={idea.sketch}
              alt={idea.sketchAlt}
              className="mt-[24px] min-h-0 w-full max-w-[600px] flex-1 object-contain object-left-top"
            />
          )}
        </div>
        <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
          <p className="text-body text-mute">Das Bild</p>
          <p className="mt-[8px] max-w-[46ch] text-pretty text-body text-ink">{idea.visuals}</p>
          <div className="mt-[20px] flex flex-wrap gap-[8px]">
            {idea.vibe.map((v) => (
              <Tag key={v}>{v}</Tag>
            ))}
          </div>
          <p className="mt-auto text-body text-mute">Slogan wählen</p>
          <div role="radiogroup" aria-label="Slogan" className="mt-[8px] border-b border-ink/10">
            {idea.slogans.map((s, i) => {
              const on = i === pick
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPick(i)}
                  className={`relative block w-full cursor-pointer border-t border-ink/10 py-[14px] pl-[20px] text-left text-body transition-colors duration-300 ease-frame focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal ${on ? 'text-ink' : 'text-mute hover:text-ink'}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-[12px] left-0 w-[2px] origin-top bg-signal transition-transform duration-300 ease-frame ${on ? 'scale-y-100' : 'scale-y-0'}`}
                  />
                  «{s} OSCAR.»
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Slide>
  )
}
