import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Slide } from './Slide'
import { Pill, SIGNAL_RING, SURFACE } from './ui'
import { COMPETITORS, POST_PAGES, RESEARCH_DATE } from './competitors'

export type MPostsProps = {
  /** Which set of posts: Happy Car Wash, or Autop part 1 and 2. */
  page?: 'happy' | 'autop-1' | 'autop-2'
  /** Post on screen when the slide loads. Click a tag to switch. */
  post?: '1' | '2' | '3'
  chrome?: boolean
}

/** ease-frame of the skill as a motion curve. */
const EASE = [0.14, 0.71, 0.16, 0.99] as const

/**
 * Micro analysis: one competitor post on a phone on the axis (half-columns 6–7), what it does well
 * on the left (col 1–4), what it misses and our answer on the right (col 9–12). One free half-column
 * on each side of the phone. «So machen wir es» carries the slide's one signal ring.
 */
export function MPosts({ page = 'happy', post = '1', chrome = true }: MPostsProps) {
  const p = POST_PAGES.find((x) => x.id === page) ?? POST_PAGES[0]
  const c = COMPETITORS.find((x) => x.id === p.competitor)
  const [i, setI] = useState(Number(post) - 1)
  useEffect(() => setI(Number(post) - 1), [post, page])
  const cur = p.posts[i] ?? p.posts[0]
  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.3, ease: EASE },
  }

  return (
    <MotionConfig reducedMotion="user">
      <Slide
        kicker={`Post für Post · ${c?.name ?? ''}`}
        title={p.title}
        source={`instagram.com/${c?.profile.handle ?? ''} · Stand ${RESEARCH_DATE}`}
        chrome={chrome}
      >
        <div className="grid-12 min-h-0 flex-1">
          <div className="col-span-4 row-start-1 flex min-h-0 flex-col items-end text-right">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`good-${cur.img}`} {...fade}>
                <p className="text-body text-mute">Das macht es gut</p>
                <div className="mt-[12px] flex flex-col gap-y-[12px]">
                  {cur.good.map((g) => (
                    <p key={g} className="ml-auto max-w-[22ch] text-balance text-body text-ink">
                      {g}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto flex w-[184px] flex-col gap-y-[8px]" role="group" aria-label="Post wählen">
              {p.posts.map((x, k) => (
                <Pill key={x.img} selected={k === i} onClick={() => setI(k)} className="justify-between">
                  <span className="tabular-nums">{x.date}</span>
                  <span className={k === i ? 'text-paper/50' : 'text-mute'}>{x.format}</span>
                </Pill>
              ))}
            </div>
          </div>

          <div className="col-span-2 col-start-6 row-start-1 min-h-0">
            <Phone img={cur.img} handle={c?.profile.handle ?? ''} caption={cur.shows} avatar={c?.profile.avatar} />
          </div>

          <div className="col-span-4 col-start-9 row-start-1 min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`bad-${cur.img}`} {...fade} className="flex h-full flex-col">
                <p className="text-body text-mute">Das fehlt</p>
                <div className="mt-[12px] flex flex-col gap-y-[12px]">
                  {cur.bad.map((b) => (
                    <p key={b} className="max-w-[24ch] text-balance text-body text-ink">
                      {b}
                    </p>
                  ))}
                </div>
                <div className={`mt-auto px-[24px] py-[20px] ${SURFACE} ${SIGNAL_RING}`}>
                  <p className="text-body text-mute">So machen wir es · {cur.method}</p>
                  <p className="mt-[8px] text-pretty text-body text-ink">{cur.move}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Slide>
    </MotionConfig>
  )
}

/**
 * Phone with the post as a reel: blurred fill behind, the full frame on top, handle and caption at the bottom.
 * The screen is foreign content (Instagram); the device keeps its rounded shape and soft shadow.
 */
function Phone({ img, handle, caption, avatar }: { img: string; handle: string; caption: string; avatar?: string }) {
  return (
    <div className="mx-auto h-full max-h-[520px] w-[240px] rounded-[40px] bg-ink p-[8px] shadow-[0_40px_80px_-40px_color-mix(in_srgb,var(--color-ink)_55%,transparent)]">
      <div className="relative size-full overflow-hidden rounded-[32px] bg-ink">
        <AnimatePresence initial={false}>
          <motion.div
            key={img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <img src={img} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-[24px]" />
            <img src={img} alt={caption} className="absolute inset-0 size-full object-contain" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/60 to-transparent px-[16px] pb-[20px] pt-[64px] text-paper">
          <div className="flex items-center gap-[8px]">
            {avatar && <img src={avatar} alt="" className="size-[28px] rounded-full bg-paper object-cover" />}
            <span className="truncate text-body">{handle}</span>
          </div>
          <p className="mt-[8px] line-clamp-3 text-pretty text-body text-paper/75">{caption}</p>
        </div>
      </div>
    </div>
  )
}
