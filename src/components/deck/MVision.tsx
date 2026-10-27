import { Slide } from './Slide'

export type MVisionProps = {
  /** iPhone mockup of the OSCAR Unlimited page left of the axis. */
  mockup?: boolean
  chrome?: boolean
}

/** The two poles of the brand: serious premium touchpoints and approachable humour. */
const POLES = [
  { pole: 'Seriös', label: 'Premium · App und Website', text: 'Apple-Marketing-Style: extrem clean, simpel, das beste UX der Branche.' },
  { pole: 'Nahbar', label: 'Humorvoll · Social Media', text: 'Sketche, in denen sich die Kundschaft wiedererkennt.' },
]

/** How each pole strengthens the other. */
const EFFECTS = [
  { from: 'Premium', to: 'Humor', text: 'Der Auftritt macht den Witz glaubwürdig. Die Sketche wirken nie billig.' },
  { from: 'Humor', to: 'Premium', text: 'Der Witz macht den Auftritt nahbar. Die Marke wirkt nie abgehoben.' },
]

/** Hairline with arrowheads on both ends: the tension between the two poles. */
function PoleArrow() {
  return (
    <svg width="64" height="12" viewBox="0 0 64 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="text-ink">
      <path d="M1 6h62M7 1 1 6l6 5M57 1l6 5-6 5" />
    </svg>
  )
}

/**
 * Janick's slide 12, thinking out of the box: OSCAR in one year. The Unlimited page as iPhone mockup on wet paint
 * (gipfeli stack, see mockups) left of the axis; right of it the brand as a field of tension: seriös (premium app
 * and website) against nahbar (humorous sketches), and how each pole lifts the other.
 * The closing line carries the slide's one signal accent (red bar).
 */
export function MVision({ mockup = true, chrome = true }: MVisionProps) {
  return (
    <Slide title="Thinking out of the Box: OSCAR in einem Jahr." titleSpan={12} chrome={chrome}>
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
          {/* The two poles, linked by a double arrow on the headline row. */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-[24px] border-t border-ink/10 pt-[16px]">
            {POLES.map((p, i) => (
              <div key={p.pole} className={i === 0 ? 'col-start-1' : 'col-start-3'} style={{ gridRow: 1 }}>
                <p className="text-body text-mute">{p.label}</p>
                <p className="mt-[8px] text-headline text-ink">{p.pole}</p>
                <p className="mt-[12px] text-pretty text-body text-mute">{p.text}</p>
              </div>
            ))}
            <div className="col-start-2 row-start-1 flex h-[84px] items-end pb-[16px]">
              <PoleArrow />
            </div>
          </div>

          {/* The interplay: each pole strengthens the other. */}
          <div className="mt-[32px] border-t border-ink/10 pt-[16px]">
            <p className="text-body text-mute">Wechselwirkung</p>
            <dl className="mt-[12px] grid grid-cols-[auto_1fr] gap-x-[24px] gap-y-[12px]">
              {EFFECTS.map((e) => (
                <div key={e.from} className="contents">
                  <dt className="whitespace-nowrap text-body text-ink">
                    {e.from} <span className="text-mute">→</span> {e.to}
                  </dt>
                  <dd className="text-pretty text-body text-mute">{e.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-auto border-l-2 border-signal pl-[16px] text-pretty text-body text-ink">
            Premium im Auftritt, nahbar im Feed. So wird Autowaschen doch noch sexy.
          </p>
        </div>
      </div>
    </Slide>
  )
}
