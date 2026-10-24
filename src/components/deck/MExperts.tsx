import { Slide } from './Slide'

export type MExpertsProps = {
  chrome?: boolean
}

// Appendix slide: one iPhone mockup (paying for the annual abo, iPhone in car-wash foam) as a framed 16:9
// picture on paper, with whitespace all round. Photo: Higgsfield scene with the real OSCAR screenshot
// (402×874 @3x, iOS status bar added) set onto the screen via scripts/mockup-composite.py. 4K source and the
// other mockups (desktop, tarif) live in /images/mockups/16x9/.
// The picture stands alone: no caption, no byline.
export function MExperts({ chrome = true }: MExpertsProps) {
  return (
    <Slide n={13} kicker="Zusätzliche Lösungen" chrome={chrome} lines={false}>
      <div className="flex min-h-0 flex-1 justify-center">
        <figure className="relative aspect-video h-full overflow-hidden rounded-[24px] bg-stone">
          <img
            src="/images/mockups/16x9/unlimited-zahlung-iphone-16x9.webp"
            alt="Abo-Seite OSCAR Unlimited auf dem iPhone: Zahlung mit dem Jahresabo zuoberst, iPhone im Schaum auf nassem Asphalt"
            className="absolute inset-0 size-full object-cover"
          />
        </figure>
      </div>
    </Slide>
  )
}
