import { useContext, useEffect, useState } from 'react'
import { DeckNext, Slide } from './Slide'
import { THEMES, TrailLayer, type TrailTheme } from './TitleTrail'

export type MSloganProps = {
  /** Cycle Sexy, Premium, Playful on click before landing on Feel. Off: the slide stays on «Feel» (closing slide). */
  cycle?: boolean
  /** Height of a trail picture in stage px. */
  trailSize?: number
  /** Distance the cursor travels before the next picture lands, in stage px. */
  trailGap?: number
  chrome?: boolean
}

type Stage = { theme: TrailTheme; bg: string; mode: 'light' | 'dark' | 'red' }

const theme = (key: TrailTheme['key']) => THEMES.find((t) => t.key === key) ?? THEMES[0]

/** One stage grey per feeling, light to black and back; no colour on this slide. */
const STAGES: Stage[] = [
  { theme: theme('sexy'), bg: '#d9d9d9', mode: 'light' },
  { theme: theme('premium'), bg: '#111111', mode: 'dark' },
  { theme: theme('playful'), bg: '#f2f2f2', mode: 'light' },
  { theme: theme('feel'), bg: '#555555', mode: 'red' },
]
const LAST = STAGES.length - 1

/**
 * The campaign line: «Make Carwash <feeling> again.» centred in display size. A click turns the feeling
 * (Sexy, Premium, Playful), each on its own stage colour with its own pictures, and lands on «Feel» on the dark-grey stage;
 * the click after that goes to the next slide (on the canvas it starts over). The image trail follows the cursor
 * and fades away. With `cycle` off only the dark-grey «Feel» stage shows.
 */
export function MSlogan({ cycle = true, trailSize = 300, trailGap = 150, chrome = true }: MSloganProps) {
  const next = useContext(DeckNext)
  const [step, setStep] = useState(cycle ? 0 : LAST)
  const { theme: t, bg, mode } = STAGES[cycle ? step : LAST]

  useEffect(() => {
    for (const s of cycle ? STAGES : STAGES.slice(LAST)) for (const i of s.theme.images) new Image().src = i.src
  }, [cycle])

  const onNext = () => {
    if (cycle && step < LAST) setStep(step + 1)
    else if (next) next()
    else setStep(cycle ? 0 : LAST)
  }

  return (
    <Slide
      chrome={chrome}
      lines={false}
      tone={mode === 'dark' ? 'ink' : 'white'}
      inverse={mode === 'red'}
      background={
        <>
          <div aria-hidden="true" className="absolute inset-0 transition-colors duration-700 ease-frame" style={{ backgroundColor: bg }} />
          <div className="absolute inset-0 grayscale">
            <TrailLayer images={t.images} onNext={onNext} size={trailSize} gap={trailGap} />
          </div>
        </>
      }
    >
      <div className="grid-12 min-h-0 flex-1 content-center">
        <h2
          className={`col-span-12 select-none text-center text-display transition-colors duration-700 ease-frame ${mode === 'light' ? 'text-ink' : 'text-paper'}`}
        >
          <span className="block">Make Carwash</span>
          <span className="block">
            <span className={mode === 'light' ? 'text-ink/50' : 'text-paper/60'}>{t.word}</span> again.
          </span>
        </h2>
      </div>
    </Slide>
  )
}
