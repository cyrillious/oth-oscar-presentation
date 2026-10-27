import { Slide } from './Slide'

export type MVisionProps = {
  /** iPhone mockup of the OSCAR Unlimited page left of the axis. */
  mockup?: boolean
  chrome?: boolean
}

/** The UX measures: every touchpoint of the customer journey, thought through. */
const MEASURES = [
  { name: 'OSCAR Carwash App', text: 'Abo, Wallet-Pass, Schranke: alles in einer App.' },
  { name: 'Dashboard', text: 'Die ganze Customer Journey auf einen Blick.' },
]

/** The two poles of the brand and what carries each. */
const POLES = [
  { pole: 'Seriös', carrier: 'Der Auftritt', text: 'App, Website, Dashboard.' },
  { pole: 'Nahbar', carrier: 'Die Videos', text: 'Oscar authentisch und persönlich.' },
]

/** How each pole strengthens the other: one arrow in each direction. */
const EFFECTS = [
  { dir: 'right', text: 'macht die Videos glaubwürdig' },
  { dir: 'left', text: 'macht die Marke nahbar' },
] as const

/** Hairline arrow in one direction, for the interplay between the poles. */
function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      className={`text-ink ${dir === 'left' ? '-scale-x-100' : ''}`}
    >
      <path d="M0 6h198" vectorEffect="non-scaling-stroke" />
      <path d="M192 1l6 5-6 5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * Janick's slide 12: what we deliver beyond the videos. The Unlimited page as iPhone mockup on wet paint
 * (gipfeli stack, see mockups) left of the axis; right of it the customer experience, thought through in every
 * aspect (app, dashboard), and under it the interplay of the two poles as a diagram: the appearance (app,
 * website, dashboard) stands for seriös, the videos for nahbar, and each pole lifts the other.
 * The one signal accent is the word «Nahbar»: that is where the videos come in.
 */
export function MVision({ mockup = true, chrome = true }: MVisionProps) {
  return (
    <Slide title="Das liefern wir." titleSpan={12} chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        {mockup && (
          <figure className="col-span-6 min-h-0 overflow-hidden rounded-[12px] bg-stone">
            <img
              src="/images/mockups/16x9/unlimited-tarif-16x9.webp"
              alt="Abo-Seite OSCAR Unlimited auf dem iPhone: Silber ab CHF 37.50 pro Monat, iPhone auf nassem Lack"
              className="size-full object-cover object-[49%_50%]"
            />
          </figure>
        )}
        <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
          {/* Core statement and the two UX measures. */}
          <p className="text-body text-mute">Customer Experience</p>
          <p className="mt-[8px] text-balance text-headline text-ink">In allen Aspekten mitgedacht.</p>
          <dl className="mt-[20px] border-b border-ink/10">
            {MEASURES.map((m) => (
              <div key={m.name} className="grid grid-cols-[220px_1fr] border-t border-ink/10 py-[12px] text-body">
                <dt className="text-ink">{m.name}</dt>
                <dd className="text-pretty text-mute">{m.text}</dd>
              </div>
            ))}
          </dl>

          {/* The interplay as a diagram: two poles, one arrow each way between them. */}
          <div className="mt-auto">
            <p className="text-body text-mute">Wechselwirkung</p>
            <div className="mt-[12px] grid grid-cols-[180px_1fr_180px] gap-x-[16px]">
              {POLES.map((p, i) => (
                <div key={p.pole} className={i === 0 ? 'col-start-1 row-start-1' : 'col-start-3 row-start-1 text-right'}>
                  <p className={`text-headline ${i === 1 ? 'text-signal' : 'text-ink'}`}>{p.pole}</p>
                  <p className="mt-[8px] text-body text-ink">{p.carrier}</p>
                  <p className="text-pretty text-body text-mute">{p.text}</p>
                </div>
              ))}
              <div className="col-start-2 row-start-1 flex flex-col justify-center gap-y-[20px] pt-[12px]">
                {EFFECTS.map((e) => (
                  <div key={e.dir}>
                    <p className="whitespace-nowrap text-center text-body text-mute">{e.text}</p>
                    <div className="mt-[6px]">
                      <Arrow dir={e.dir} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}
