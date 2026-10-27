import { Slide } from './Slide'

export type MMarkenauftrittProps = {
  /** iPhone mockup (OSCAR Unlimited in the foam) left of the axis. */
  mockup?: boolean
  chrome?: boolean
}

/** What we produce for the brand beyond the sketches. */
const ROWS = [
  { what: 'Video', text: 'Imagefilm, Anlage, Team: Bilder, die die Marke tragen.' },
  { what: 'Foto', text: 'Standorte, Produkte, Menschen, für Web, Print und Feed.' },
  { what: 'Web', text: 'Der Auftritt, auf dem alles zusammenkommt: Website und App.' },
]

/**
 * After the humour slide: the sketches are one part, the brand needs the other. Left of the axis the OSCAR
 * Unlimited page on the iPhone in the foam (gipfeli stack, see mockups); right of it the three things we also
 * produce for the brand: video, photo, web. The word «auch» carries the slide's one signal accent.
 */
export function MMarkenauftritt({ mockup = true, chrome = true }: MMarkenauftrittProps) {
  return (
    <Slide chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1">
        {mockup && (
          <figure className="col-span-6 min-h-0 overflow-hidden rounded-[12px] bg-stone">
            <img
              src="/images/mockups/16x9/unlimited-zahlung-iphone-16x9.webp"
              alt="Abo-Seite OSCAR Unlimited auf dem iPhone: Zahlung mit dem Jahresabo zuoberst, iPhone im Schaum auf nassem Asphalt"
              className="size-full object-cover"
            />
          </figure>
        )}
        <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
          <p className="text-body text-mute">Markenauftritt</p>
          <p className="mt-[8px] text-balance text-headline text-ink">
            Sketche holen die Aufmerksamkeit. Die Marke braucht <span className="text-signal">auch</span> den Rest.
          </p>
          <p className="mt-[24px] max-w-[40ch] text-pretty text-body text-mute">
            Für den Markenauftritt produzieren wir Video- und Fotocontent und bauen den Webauftritt, der dazu passt.
          </p>
          <dl className="mt-auto border-b border-ink/10">
            {ROWS.map((r) => (
              <div key={r.what} className="grid grid-cols-[120px_1fr] border-t border-ink/10 py-[14px] text-body">
                <dt className="text-ink">{r.what}</dt>
                <dd className="text-pretty text-mute">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Slide>
  )
}
