import { Ph } from './ui'

export type InstaProfileData = {
  handle: string
  name: string
  /** Avatar image; falls back to initials on a tinted disc. */
  avatar?: string
  initials?: string
  /** Avatar tint behind the initials. */
  tint?: string
  posts?: string
  followers?: string
  following?: string
  bio: string[]
  link?: string
  /** Up to 9 grid images. Missing tiles render as grey placeholders. */
  grid?: string[]
  /** Chip over the post grid, e.g. «Letzter Beitrag: 17.11.2020». */
  stale?: string
}

export type InstaProfileProps = {
  profile: InstaProfileData
  /** Full screenshot of the profile. Replaces the rebuilt profile when set. */
  screenshot?: string
  /** Post grid under the header. */
  showGrid?: boolean
  className?: string
}

/**
 * Instagram profile, rebuilt in a phone frame for the competitor slides. Numbers come from the research date in the source line.
 * The screen is foreign content and may look like Instagram (link blue); the frame and the text sizes follow the deck's tokens.
 */
export function InstaProfile({ profile, screenshot, showGrid = true, className = '' }: InstaProfileProps) {
  const p = profile
  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-[48px] bg-paper p-[12px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-ink)_10%,transparent),0_30px_60px_-30px_color-mix(in_srgb,var(--color-ink)_35%,transparent)] ${className}`}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[36px] bg-paper shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-ink)_6%,transparent)]">
        {screenshot ? (
          <img src={screenshot} alt={`Instagram-Profil ${p.handle}`} className="absolute inset-0 size-full object-cover object-top" />
        ) : (
          <>
            <div className="flex h-[64px] shrink-0 items-center justify-center border-b border-ink/10 text-body text-ink">
              {p.handle}
            </div>
            <div className="shrink-0 px-[28px] pt-[24px]">
              <div className="flex items-center gap-[28px]">
                <div className="grid size-[112px] shrink-0 place-items-center overflow-hidden rounded-full p-[4px] shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]">
                  {p.avatar ? (
                    <img src={p.avatar} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <span
                      className="grid size-full place-items-center rounded-full text-headline text-paper"
                      style={{ background: p.tint ?? 'var(--color-ink)' }}
                    >
                      {p.initials ?? p.name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="grid flex-1 grid-cols-3 text-center">
                  {[
                    [p.posts, 'Beiträge'],
                    [p.followers, 'Follower'],
                    [p.following, 'Gefolgt'],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <p className="text-body text-ink tabular-nums">{v ?? <Ph>?</Ph>}</p>
                      <p className="mt-[4px] text-body text-mute">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-[20px] text-body text-ink">{p.name}</p>
              {p.bio.map((b) => (
                <p key={b} className="text-body text-ink">
                  {b}
                </p>
              ))}
              {p.link && <p className="text-body text-[#00376b]">{p.link}</p>}
            </div>
            {showGrid && (
              <div className="relative mt-[20px] flex min-h-0 flex-1 flex-col">
                {p.stale && (
                  <span className="absolute left-1/2 top-[40%] z-10 flex h-[48px] -translate-x-1/2 items-center whitespace-nowrap rounded-full bg-ink px-[24px] text-body text-paper">
                    {p.stale}
                  </span>
                )}
                <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-[3px] border-t border-ink/10 pt-[3px]">
                  {Array.from({ length: 9 }, (_, i) => p.grid?.[i]).map((src, i) =>
                    src ? (
                      <img key={i} src={src} alt="" className="aspect-[4/5] w-full object-cover" />
                    ) : (
                      <div key={i} className={`aspect-[4/5] w-full ${i % 2 ? 'bg-ink/[0.06]' : 'bg-ink/[0.04]'}`} />
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
