import { Slide } from './Slide'
import { SURFACE, Tag } from './ui'

export type S11KanaeleProps = {
  /** Screenshot of the Abo page in a phone frame on the right. */
  screenshot?: boolean
  chrome?: boolean
}

const CHANNELS: { name: string; note: string; tag?: string; accent?: boolean }[] = [
  { name: 'Instagram Reels', note: '9:16, mit Ton und Untertiteln' },
  { name: 'TikTok', note: 'Gleicher Schnitt, eigene Hook-Variante' },
  { name: 'YouTube Shorts', note: 'Gleicher Schnitt' },
  // The one signal accent: the screens on site are the channel OSCAR already owns and does not use.
  { name: '30 Bildschirme vor Ort', note: 'Stumm, mit Untertiteln', tag: 'Bisher ungenutzt', accent: true },
  { name: 'Abo-Seite der Webseite', note: 'Reels neben dem Beitreten-Button', tag: 'Neu' },
]

// grid-12 with gap-x-5: dark «1 Drehtag» card over 3 half-columns, channel list over 7,
// phone over 2 (without the phone the list takes 9).
export function S11Kanaele({ screenshot = true, chrome = true }: S11KanaeleProps) {
  return (
    <Slide n={11} kicker="Ein Dreh, fünf Kanäle" title="Ein Drehtag füllt fünf Kanäle." chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 gap-x-5">
        <div className="col-span-3 flex flex-col justify-end rounded-[12px] bg-ink p-[32px] text-paper">
          <p className="text-display">1</p>
          <p className="mt-[8px] text-headline">Drehtag</p>
          <p className="mt-[16px] text-pretty text-body text-paper/50">
            <span className="whitespace-nowrap">8–12 Clips</span> plus <span className="whitespace-nowrap">B-Roll-Bank</span>, geschnitten für jeden Kanal.
          </p>
        </div>

        <div className={`${SURFACE} flex flex-col px-[32px] py-[8px] ${screenshot ? 'col-span-7' : 'col-span-9'}`}>
          {CHANNELS.map((c, i) => (
            <div key={c.name} className={`flex flex-1 items-center gap-[24px] ${i > 0 ? 'border-t border-ink/10' : ''}`}>
              <div className="flex-1">
                <p className="text-headline text-ink">{c.name}</p>
                <p className="mt-[2px] text-body text-mute">{c.note}</p>
              </div>
              {c.tag && <Tag tone={c.accent ? 'red' : 'grey'}>{c.tag}</Tag>}
            </div>
          ))}
        </div>

        {screenshot && (
          <div className="col-span-2 flex min-h-0 justify-end">
            <div className="relative h-full" style={{ aspectRatio: '860 / 1920' }}>
              <div className="absolute inset-0 rounded-[32px] bg-ink p-[6px] shadow-[0_24px_48px_-28px_rgb(17_17_17/0.4)]">
                <div className="relative size-full overflow-hidden rounded-[26px] bg-stone">
                  <img
                    src="/images/abo-mobile.png"
                    alt="Abo-Seite OSCAR Unlimited auf dem Handy"
                    className="absolute top-0 h-full max-w-none"
                    style={{ width: '162.8%', left: '-31.4%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Slide>
  )
}
