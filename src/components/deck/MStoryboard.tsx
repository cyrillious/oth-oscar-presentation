import { Slide } from './Slide'
import { SURFACE } from './ui'

export type MStoryboardProps = {
  /** Hook and twist beside the sketch. Off: the sketch spans the full width. */
  text?: boolean
  chrome?: boolean
}

/**
 * Janick's storyboard «Die Beifahrer-Panik»: redrawn as thick-marker doodles (six panels, same style as the Konkurrenz cards) on a stone panel, hook and twist
 * right of it. Transparent ink, so the panel shows through.
 */
export function MStoryboard({ text = true, chrome = true }: MStoryboardProps) {
  return (
    <Slide title="«Die Beifahrer-Panik»" chrome={chrome}>
      <div className="grid-12 min-h-0 flex-1 gap-y-5">
        <figure className={`${SURFACE} ${text ? 'col-span-8' : 'col-span-12'} grid min-h-0 place-items-center self-start p-[24px]`}>
          <img
            src="/images/storyboard/beifahrer-panik-doodle.webp"
            alt="Storyboard-Skizze in sechs Bildern: zwei Menschen im Auto, Handy mit Nachricht, verkrümelter Beifahrersitz, OSCAR-Schild, Einfahrt in die Waschstrasse, blitzblankes Auto."
            className="max-h-full w-full object-contain"
          />
        </figure>
        {text && (
          <div className="col-span-4 col-start-9 flex min-h-0 flex-col pl-4">
            <p className="text-body text-mute">Der Hook</p>
            <p className="mt-[12px] text-pretty text-body leading-[1.45] text-ink">
              Spontane Nachricht: «Holst du mich in 10 Min ab?», egal ob Bahnhof Zug, Luzern/Emmen oder Sihlbrugg. Blick auf den Beifahrersitz: Gipfeli-Krümel,
              Kaffeeflecken, Hundehaare.
            </p>
            <p className="mt-[32px] border-t border-ink/10 pt-[16px] text-body text-mute">Der Twist</p>
            <p className="mt-[12px] text-pretty text-body leading-[1.45] text-ink">
              Weil OSCAR überall auf der Route liegt, rettet der Wallet-Pass an der nächsten Schranke das Date in 8 Minuten.
            </p>
            <p className="mt-[32px] border-l-2 border-signal pl-[16px] text-pretty text-body leading-[1.45] text-ink">«Ich bin einfach ein sehr strukturierter Mensch.»</p>
          </div>
        )}
      </div>
    </Slide>
  )
}
