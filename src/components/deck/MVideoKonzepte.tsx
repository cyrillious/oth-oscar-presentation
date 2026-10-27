import { Fragment } from 'react'
import { Slide } from './Slide'

export type MVideoKonzepteProps = {
  chrome?: boolean
}

const CHAIN = ['Strategy', 'Wallet-Abo', 'Humor-Videos']

// Venn geometry in px, origin at the diagram's centre. Two circles on top, one below,
// so the stories read in order: top left, top right, bottom.
const R = 190
const W = 580
const H = 550
const OX = W / 2
const OY = 250

/** Circle centre (cx, cy), label centre (lx, ly) and label width (w), all in px. */
type Story = { text: string; cx: number; cy: number; lx: number; ly: number; w: number }

const STORIES: Story[] = [
  { text: 'Die Date-Rettung', cx: -91, cy: -52.5, lx: -172, ly: -150, w: 170 },
  { text: '3 Minuten Pause im Schaum', cx: 91, cy: -52.5, lx: 178, ly: -140, w: 140 },
  { text: 'Der Samichlaus krallt sich die Weihnachts-Aktion', cx: 0, cy: 105, lx: 0, ly: 200, w: 220 },
]

const pos = (x: number, y: number) => ({ left: `${((x + OX) / W) * 100}%`, top: `${((y + OY) / H) * 100}%` })

/**
 * A circle as drawn by hand with a marker: the radius drifts a little, the stroke starts at a random
 * angle and runs past its start (`overshoot`, in radians) instead of closing neatly. Same look as the
 * Higgsfield sketches on the slides before. `overshoot = 0` gives the closed shape for clipping.
 */
function handCircle(cx: number, cy: number, r: number, seed: number, overshoot = 0.45) {
  const n = 96
  const a0 = seed * 2.1
  const sweep = Math.PI * 2 + overshoot
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const ang = a0 + t * sweep
    const rr = r * (1 + 0.022 * Math.sin(2 * ang + seed) + 0.012 * Math.sin(3 * ang + seed * 3)) + t * 7
    pts.push(`${(cx + rr * Math.cos(ang)).toFixed(1)},${(cy + rr * Math.sin(ang)).toFixed(1)}`)
  }
  return `M${pts.join('L')}${overshoot === 0 ? 'Z' : ''}`
}

/**
 * The real value across all locations: the promise left of the axis (with the chain strategy, wallet
 * subscription, humour videos), right of it three overlapping circles, one per story. Where all three
 * meet sits the focus, the wallet subscription: the slide's one signal accent. The circles are drawn
 * like the marker sketches (wobbly, overshooting, ragged edge), the labels stay live text.
 */
export function MVideoKonzepte({ chrome = true }: MVideoKonzepteProps) {
  const [a, b, c] = STORIES
  return (
    <Slide title="Drei Story-Konzepte für alle Standorte." titleSpan={12} chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        <div className="col-span-5 flex flex-col">
          <p className="text-body text-mute">Der eigentliche Wert</p>
          <p className="mt-[8px] text-balance text-headline text-ink">«Wir verkaufen 3 Minuten Lebens-Kontrolle und Ruhe.»</p>
          <p className="mt-[24px] max-w-[40ch] text-pretty text-body text-mute">
            Drei Geschichten für alle Standorte, alle nach demselben Schema gebaut: Angst, Story, OSCAR, Relief. Sie zeigen
            nicht die Waschanlage, sondern den Alltagsmoment, den sie rettet. Wo sich alle drei überschneiden, steht immer
            dasselbe: das Abo im Wallet.
          </p>
          <div className="mt-auto flex items-center">
            {CHAIN.map((c, i) => (
              <Fragment key={c}>
                {i > 0 && <span aria-hidden="true" className="h-px w-[24px] shrink-0 bg-ink/30" />}
                <span className="inline-flex h-[40px] shrink-0 items-center rounded-full border border-ink/25 px-[18px] text-body text-ink">{c}</span>
              </Fragment>
            ))}
          </div>
        </div>

        <figure className="col-span-6 col-start-7 flex min-h-0 items-center justify-center">
          <div className="relative h-full max-h-[550px]" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`${-OX} ${-OY} ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
              <defs>
                {/* Ragged marker edge on every line and on the red fill. */}
                <filter id="vk-marker" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="3.5" />
                </filter>
                <clipPath id="vk-a">
                  <path d={handCircle(a.cx, a.cy, R, 1, 0)} />
                </clipPath>
                <clipPath id="vk-b">
                  <path d={handCircle(b.cx, b.cy, R, 2, 0)} />
                </clipPath>
              </defs>
              <g filter="url(#vk-marker)">
                <g clipPath="url(#vk-a)">
                  <path d={handCircle(c.cx, c.cy, R, 3, 0)} clipPath="url(#vk-b)" className="fill-signal" />
                </g>
                {STORIES.map((s, i) => (
                  <path
                    key={s.text}
                    d={handCircle(s.cx, s.cy, R, i + 1)}
                    fill="none"
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-ink"
                  />
                ))}
              </g>
            </svg>

            {STORIES.map((s) => (
              <p
                key={s.text}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-balance text-center text-body text-ink"
                style={{ ...pos(s.lx, s.ly), width: s.w }}
              >
                {s.text}
              </p>
            ))}

            <figcaption
              className="absolute w-[160px] -translate-x-1/2 -translate-y-1/2 text-center text-body leading-[1.2]"
              style={pos(0, 12)}
            >
              <span className="block text-paper/75">Fokus</span>
              <span className="block text-paper">Abo im Wallet</span>
            </figcaption>
          </div>
        </figure>
      </div>
    </Slide>
  )
}
