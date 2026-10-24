import { Slide } from './Slide'

export type MExpertsProps = {
  chrome?: boolean
}

type Mockup = { label: string; src: string; alt: string; tilt: number }

// Photo mockups in the style of gipfeli.ui8.dev: device on a real surface, portrait card 340 / 400 in a thin
// white frame, slightly tilted. Real OSCAR screenshots set onto the screens (see MockupStack).
const MOCKUPS: Mockup[] = [
  { label: 'Tarif wählen, mobil', src: '/images/mockups/unlimited-tarif-close.webp', alt: 'Tarifwahl Unlimited Silber auf dem Handy, Motorhaube mit Wasserperlen', tilt: -2 },
  { label: 'Bezahlen, mobil', src: '/images/mockups/unlimited-zahlung-close.webp', alt: 'Zahlung Jahresabo auf dem Handy, Schaum auf Asphalt', tilt: 2 },
]

// Appendix slide: the mockups carry it. Cyrill only as a byline top left (name, small round avatar, role),
// right two large photo mockups of the Unlimited abo flow on the phone.
// Desktop mockup exists too (/images/mockups/unlimited-desktop.webp), left out on purpose.
export function MExperts({ chrome = true }: MExpertsProps) {
  return (
    <Slide
      n={13}
      kicker="Zusätzliche Lösungen"
      title="Das ganze Erlebnis rund um die Marke."
      lead="Die Abo-Seite von OSCAR Unlimited auf dem Handy: Tarif wählen, bezahlen."
      titleSpan={12}
      chrome={chrome}
    >
      <div className="grid-12 min-h-0 flex-1 gap-x-5">
        <div className="col-span-3 self-start">
          <p className="flex items-center gap-[12px] text-body text-ink">
            Cyrill Wipfli
            <img
              src="/images/team/cyrill-wipfli.webp"
              alt=""
              className="size-[28px] rounded-full object-cover object-top shadow-[0_0_0_1px_rgb(17_17_17/0.08)]"
            />
          </p>
          <p className="mt-[4px] text-body text-mute">Swiss Design Engineer</p>
        </div>

        <div className="col-span-9 grid min-h-0 grid-cols-2 gap-x-5">
          {MOCKUPS.map((m) => (
            <figure key={m.label} className="flex min-h-0 flex-col items-center">
              <div className="relative min-h-0 w-full flex-1">
                <div className="absolute inset-y-0 left-1/2 aspect-[340/400] h-full -translate-x-1/2">
                  <div
                    className="size-full rounded-[22px] border border-ink/[0.08] bg-white p-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_24px_48px_-28px_rgb(17_17_17/0.35)]"
                    style={{ transform: `rotate(${m.tilt}deg)` }}
                  >
                    <img src={m.src} alt={m.alt} className="size-full rounded-[18px] object-cover" />
                  </div>
                </div>
              </div>
              <figcaption className="mt-[16px] text-body text-mute">{m.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Slide>
  )
}
