import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { OthViewLogo, Slide } from './Slide'
import { Pill } from './ui'
import { COMPETITORS, MORE_COMPETITORS, POST_PAGES, RESEARCH_DATE, type Post } from './competitors'

type CompetitorId = 'happy' | 'autop' | 'migrol' | 'avia' | 'waschman' | 'soft'

export type MKonkurrenzProps = {
  /** Competitor selected when the slide loads. Click a tag to switch. */
  competitor?: CompetitorId
  chrome?: boolean
}

type View = 'web' | 'insta'

/** Label on the switch bar where the full name is too long for six pills in one row. */
const LABEL: Record<string, string> = { happy: 'Happy', autop: 'Autop' }

/** The three researched competitors first, then the rest of the positioning map. */
const LIST = [
  ...COMPETITORS.map((c) => ({ id: c.id, name: c.name, label: LABEL[c.id] ?? c.name, handle: c.profile.handle, source: c.source, site: c.site })),
  ...MORE_COMPETITORS,
]

/** ease-frame of the skill as a motion curve. */
const EASE = [0.14, 0.71, 0.16, 0.99] as const

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M6 4h8v8M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Competitor analysis: the live website or Instagram profile fills the whole stage. A floating tag bar switches competitor and view. */
export function MKonkurrenz({ competitor = 'happy', chrome = true }: MKonkurrenzProps) {
  const [sel, setSel] = useState<string>(competitor)
  useEffect(() => setSel(competitor), [competitor])

  const c = LIST.find((x) => x.id === sel) ?? LIST[0]
  const [view, setView] = useState<View>(c.site.embed ? 'web' : 'insta')
  const [loaded, setLoaded] = useState(false)
  // A new competitor starts on its website, or on Instagram when the site forbids frames.
  useEffect(() => {
    setView(c.site.embed ? 'web' : 'insta')
    setLoaded(false)
  }, [c.id, c.site.embed])

  const insta = `https://www.instagram.com/${c.handle}/`
  const href = view === 'web' ? c.site.url : insta
  const src = view === 'web' ? c.site.url : `${insta}embed/`
  const posts = POST_PAGES.filter((p) => p.competitor === c.id).flatMap((p) => p.posts)

  const stage = (
    <div className="absolute inset-0 bg-stone">
      {view === 'web' && !c.site.embed ? (
        <div className="grid size-full place-items-center px-[120px] pb-[96px] text-center">
          <div>
            <p className="text-balance text-headline text-ink">{c.site.label} lässt sich nicht einbetten.</p>
            <p className="mx-auto mt-[16px] max-w-[40ch] text-pretty text-body text-mute">
              Die Seite erlaubt keine Anzeige in einem Rahmen. Sie öffnet sich im Browser, oder wechsle auf Instagram.
            </p>
          </div>
        </div>
      ) : view === 'insta' && posts.length > 0 ? (
        <div className="absolute inset-x-0 top-0 bottom-[96px]">
          <PostGallery key={c.id} posts={posts} handle={c.handle} />
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center">
              <span className="size-[40px] animate-spin rounded-full border-[3px] border-ink/10 border-t-ink/60 motion-reduce:animate-none" aria-label="Lädt" />
            </div>
          )}
          {/* Website: the iframe is the whole 1600 × 900 stage, so a 100vh hero shows complete. */}
          <iframe
            key={src}
            src={src}
            title={`${c.name}, ${view === 'web' ? 'Website' : 'Instagram'}`}
            onLoad={() => setLoaded(true)}
            className={`bg-paper transition-opacity duration-300 ease-frame ${loaded ? 'opacity-100' : 'opacity-0'} ${
              view === 'insta' ? 'mx-auto block h-[calc(100%-96px)] w-full max-w-[600px]' : 'size-full'
            }`}
            referrerPolicy="no-referrer"
          />
        </>
      )}
    </div>
  )

  return (
    <MotionConfig reducedMotion="user">
      <Slide source={`${c.source} · Stand ${RESEARCH_DATE}`} chrome={false} lines={false} clickThrough background={stage}>
        {/* Floating switch bar over the frame. */}
        <div className="mt-auto -mb-[48px] flex shrink-0 justify-center">
          <div className="pointer-events-auto flex items-center gap-[12px] rounded-full bg-paper p-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
            {chrome && <OthViewLogo className="px-[12px] text-ink" />}
            {LIST.map((x) => (
              <Pill key={x.id} selected={sel === x.id} onClick={() => setSel(x.id)}>
                {x.label}
              </Pill>
            ))}
            <div className="flex rounded-full bg-ink/[0.06] p-[4px]" role="tablist" aria-label="Ansicht">
              {(['web', 'insta'] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => {
                    if (v === view) return
                    setLoaded(false)
                    setView(v)
                  }}
                  className={`flex h-[32px] cursor-pointer items-center rounded-full px-[18px] text-body transition-colors duration-300 ease-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    view === v ? 'bg-ink text-paper' : 'text-mute hover:text-ink'
                  }`}
                >
                  {v === 'web' ? 'Website' : 'Instagram'}
                </button>
              ))}
            </div>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[40px] shrink-0 items-center gap-[8px] rounded-full bg-ink/[0.06] px-[18px] text-body text-ink transition-colors duration-300 ease-frame hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              Im Browser öffnen {ARROW}
            </a>
          </div>
        </div>
      </Slide>
    </MotionConfig>
  )
}

/** Single posts shown large: the picked post on the left, its thumbnails in a column on the right. */
function PostGallery({ posts, handle }: { posts: Post[]; handle: string }) {
  const [i, setI] = useState(0)
  const cur = posts[i] ?? posts[0]
  return (
    <div className="absolute inset-0 flex gap-[32px] p-[32px]">
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-[12px] bg-ink">
        <AnimatePresence initial={false}>
          <motion.div
            key={cur.img}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <img src={cur.img} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-[32px]" />
            <img src={cur.img} alt={cur.shows} className="absolute inset-0 size-full object-contain" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent px-[24px] pb-[20px] pt-[64px] text-paper">
          <p className="text-body text-paper/60">
            {handle} · {cur.date} · {cur.format}
          </p>
          <p className="mt-[4px] max-w-[60ch] text-pretty text-body">{cur.shows}</p>
        </div>
      </div>
      <div className="flex w-[120px] shrink-0 flex-col gap-[12px] overflow-y-auto" role="group" aria-label="Post wählen">
        {posts.map((p, k) => (
          <button
            key={p.img}
            type="button"
            onClick={() => setI(k)}
            aria-pressed={k === i}
            aria-label={`${p.date}, ${p.format}`}
            className={`relative aspect-[4/5] w-full shrink-0 cursor-pointer overflow-hidden rounded-[8px] bg-ink transition-[opacity,scale] duration-300 ease-frame hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              k === i ? 'opacity-100 shadow-[0_0_0_2px_var(--color-ink)]' : 'opacity-55'
            }`}
          >
            <img src={p.img} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
