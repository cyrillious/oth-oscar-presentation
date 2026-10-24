import { Slide } from './Slide'
import { SURFACE } from './ui'

export type MStoryboardProps = {
  /** Hook and twist beside the sketch. Off: the sketch spans the full width. */
  text?: boolean
  chrome?: boolean
}

/**
 * Janick's storyboard «Die Beifahrer-Panik»: the hand sketch (six panels) on a stone panel, hook and twist
 * right of it. The sketch is multiplied onto the panel so its white paper disappears.
 */
export function MStoryboard({ text = true, chrome = true }: MStoryboardProps) {
  return (
    <Slide title="«Die Beifahrer-Panik»" chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 gap-y-5">
        <figure className={`${SURFACE} ${text ? 'col-span-8' : 'col-span-12'} grid min-h-0 place-items-center self-start p-[24px]`}>
          <img
            src="/images/storyboard/beifahrer-panik.webp"
            alt="Storyboard-Skizze in sechs Bildern: zwei Menschen am Tisch, Handy mit Nachricht, verkrümelter Beifahrersitz, OSCAR-Schild, Einfahrt in die Waschstrasse, blitzblankes Auto."
            className="max-h-full w-full object-contain mix-blend-multiply"
          />
        </figure>
        {text && (
          <div className="col-span-4 col-start-9 flex min-h-0 flex-col pl-4">
            <p className="text-body text-mute">Der Hook</p>
            <p className="mt-[8px] text-pretty text-body text-ink">
              Spontane Nachricht: «Holst du mich in 10 Min ab?», egal ob Bahnhof Zug, Luzern/Emmen oder Sihlbrugg. Blick auf den Beifahrersitz: Gipfeli-Krümel,
              Kaffeeflecken, Hundehaare.
            </p>
            <p className="mt-[24px] border-t border-ink/10 pt-[12px] text-body text-mute">Der Twist</p>
            <p className="mt-[8px] text-pretty text-body text-ink">
              Weil OSCAR überall auf der Route liegt, rettet der Wallet-Pass an der nächsten Schranke das Date in 8 Minuten.
            </p>
            <p className="mt-[24px] border-l-2 border-signal pl-[16px] text-pretty text-body text-ink">«Ich bin einfach ein sehr strukturierter Mensch.»</p>
          </div>
        )}
      </div>
    </Slide>
  )
}
