import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Slide } from './Slide'
import { THEMES, TrailLayer, preloadTrail } from './TitleTrail'

export type S01TitelProps = {
  /** Which Unlimited card sits in front. */
  card?: 'silber' | 'gold' | 'black'
  /** Trail: «Make Carwashing … again.» with pictures along the cursor, a click turns the theme. Statement: one sentence, no cards. Split: text beside the stage. Centered: stage above centred text. */
  layout?: 'trail' | 'statement' | 'split' | 'centered'
  /** Theme the trail starts with (a click turns to the next). */
  theme?: 'sexy' | 'premium' | 'playful' | 'feel'
  /** Height of a trail picture in stage px. */
  trailSize?: number
  /** Distance the cursor travels before the next picture lands, in stage px. */
  trailGap?: number
  /** Sentence on the statement layout. */
  statement?: string
  /** Neighbour cards left and right, like the carousel on the Abo page. */
  neighbours?: boolean
  chrome?: boolean
}

const CARDS = ['silber', 'gold', 'black'] as const

function CardStage({ front, neighbours, size }: { front: (typeof CARDS)[number]; neighbours: boolean; size: number }) {
  const i = CARDS.indexOf(front)
  const left = CARDS[(i + 2) % 3]
  const right = CARDS[(i + 1) % 3]
  const side = (c: string, dir: -1 | 1) => (
    <img
      src={`/images/card-front-${c}.webp`}
      alt=""
      className="absolute left-1/2 top-1/2 opacity-90 blur-[5px]"
      style={{
        width: size,
        transform: `translate(-50%, -50%) translateX(${dir * size * 0.62}px) scale(0.72) rotateY(${-dir * 24}deg)`,
      }}
    />
  )
  return (
    <div className="relative size-full [perspective:1800px]">
      {neighbours && side(left, -1)}
      {neighbours && side(right, 1)}
      <img
        src={`/images/card-front-${front}.webp`}
        alt={`OSCAR Unlimited Karte ${front}`}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_40px_40px_rgba(0,0,0,0.22)]"
        style={{ width: size }}
      />
    </div>
  )
}

const EASE = [0.14, 0.71, 0.16, 0.99] as const

/** «Make Carwashing <word> again.» — the word is the one accent; it blurs out and the next one blurs in, «again.» glides after it. */
function Slogan({ word }: { word: string }) {
  const reduce = useReducedMotion()
  const blur = reduce ? {} : { y: '45%', filter: 'blur(16px)' }
  const blurOut = reduce ? {} : { y: '-45%', filter: 'blur(16px)' }
  return (
    <h1 className="col-span-12 select-none text-display text-ink">
      <span className="block">Make Carwashing</span>
      <span className="relative block" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            className="inline-block text-signal"
            initial={{ opacity: 0, ...blur }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, ...blurOut }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
          >
            {word}
          </motion.span>
        </AnimatePresence>{' '}
        <motion.span layout="position" className="inline-block" transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}>
          again.
        </motion.span>
      </span>
    </h1>
  )
}

function UnlimitedSwitch() {
  return (
    <span className="inline-flex h-[48px] items-center gap-[14px] rounded-full bg-ink/[0.06] pl-[20px] pr-[4px] text-body text-ink">
      Unlimited
      <span className="relative h-[40px] w-[66px] rounded-full bg-signal">
        <span className="absolute right-[3px] top-[3px] size-[34px] rounded-full bg-paper shadow-[0_2px_6px_rgba(17,17,17,0.15)]" />
      </span>
    </span>
  )
}

export function S01Titel({
  card = 'silber',
  layout = 'trail',
  theme = 'sexy',
  trailSize = 300,
  trailGap = 150,
  statement = 'Autowaschen wieder sexy.',
  neighbours = true,
  chrome = true,
}: S01TitelProps) {
  const start = Math.max(0, THEMES.findIndex((t) => t.key === theme))
  const [turn, setTurn] = useState(start)
  useEffect(() => setTurn(start), [start])
  useEffect(() => preloadTrail(), [])

  if (layout === 'trail') {
    const current = THEMES[turn % THEMES.length]
    return (
      <Slide
        n={1}
        tone="white"
        chrome={chrome}
        background={<TrailLayer images={current.images} onNext={() => setTurn((n) => (n + 1) % THEMES.length)} size={trailSize} gap={trailGap} />}
      >
        <div className="grid-12 flex-1 cursor-pointer content-end">
          <Slogan word={current.word} />
          <p className="col-span-6 col-start-7 mt-[40px] pl-4 text-right text-body text-mute">Markenauftritt für OSCAR Carwash.</p>
          {/* Keyboard: Enter on the focused button is a click, which the stage hears like any other. */}
          <button type="button" className="sr-only">
            Thema wechseln
          </button>
        </div>
      </Slide>
    )
  }

  // Skill layout 1 «Titel»: the display line sits at the bottom of the grid, the context small and grey.
  if (layout === 'statement') {
    return (
      <Slide n={1} tone="white" chrome={chrome}>
        <div className="grid-12 flex-1 content-end">
          <h1 className="col-span-12 text-balance text-display text-ink">{statement}</h1>
          <p className="col-span-6 col-start-7 mt-[40px] pl-4 text-body text-mute">Markenauftritt für OSCAR Carwash.</p>
        </div>
      </Slide>
    )
  }

  if (layout === 'centered') {
    return (
      <Slide n={1} tone="white" chrome={chrome}>
        <div className="grid-12 flex-1 grid-rows-[1fr_auto]">
          <div className="relative col-span-6 col-start-4">
            <CardStage front={card} neighbours={neighbours} size={360} />
          </div>
          <h1 className="col-span-12 mt-[24px] text-display text-ink">{statement}</h1>
          <p className="col-span-6 col-start-7 mt-[24px] pl-4 text-body text-mute">Markenauftritt für OSCAR Carwash.</p>
        </div>
      </Slide>
    )
  }

  return (
    <Slide n={1} tone="white" chrome={chrome}>
      <div className="grid-12 flex-1">
        <div className="col-span-6 flex flex-col justify-end pr-4">
          <h1 className="text-balance text-display text-ink">{statement}</h1>
          <p className="mt-[32px] text-body text-mute">Markenauftritt für OSCAR Carwash.</p>
        </div>
        <div className="relative col-span-6 col-start-7 overflow-hidden rounded-[12px] bg-stone">
          <div className="absolute left-[24px] top-[24px]">
            <UnlimitedSwitch />
          </div>
          <CardStage front={card} neighbours={neighbours} size={400} />
          <p className="absolute inset-x-0 bottom-[28px] text-center text-body text-mute">Jeden Tag waschen. Zum Fixpreis.</p>
        </div>
      </div>
    </Slide>
  )
}
