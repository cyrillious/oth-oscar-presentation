import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Slide } from './Slide'
import { Pill } from './ui'

export type MSkriptsProps = {
  /** Script shown first (1–3). Click a pill to switch. */
  concept?: 1 | 2 | 3
  chrome?: boolean
}

type Script = {
  short: string
  kind: string
  title: string
  hook: string
  twist: string
  /** The closing line, spoken to camera. */
  line: string
  /** Rough marker sketch of the scene (Higgsfield, styled on Janick's storyboard). */
  sketch: string
  alt: string
}

const SCRIPTS: Script[] = [
  {
    short: 'Date',
    kind: 'Konzept 1 · Die Last-Minute-Rettung (Man in a Hole)',
    title: '«Das Date in letzter Sekunde»',
    hook: 'Eine spontane Nachricht: «Holst du mich in 10 Minuten ab?», ob am Bahnhof Zug, in Emmen oder Sihlbrugg. Ein Blick auf den Beifahrersitz: Kaffeeflecken, Gipfeli-Krümel, Hundehaare. Panik!',
    twist: 'Zum Glück liegt OSCAR auf dem Weg. Der Wallet-Pass öffnet die Schranke, und in 3 Minuten ist der Wagen blitzblank. Dein cooles Fazit zum Date:',
    line: '«Ich bin einfach ein sehr strukturierter Mensch.»',
    sketch: '/images/skript-sketch/date.webp',
    alt: 'Skizze: Person im Auto hält erschrocken das Handy hoch, auf dem Beifahrersitz Krümel und Hundeknochen.',
  },
  {
    short: 'Spa',
    kind: 'Konzept 2 · Die kleine Auszeit (Rolls Royce Moment)',
    title: '«Das günstigste Spa der Zentralschweiz»',
    hook: 'Warum fahren Abo-Kunden dreimal pro Woche zu OSCAR nach Emmen, Zug oder Sihlbrugg? Nicht wegen ein bisschen Schmutz, sondern weil es die einzige legale Auszeit vom Alltag ist.',
    twist: 'Draussen Pendler-Stau und E-Mail-Chaos. Drinnen legt sich weisser Schaum über die Scheibe, die Welt wird leise. Dein Moment der Ruhe:',
    line: '«Das günstigste Spa der Zentralschweiz.»',
    sketch: '/images/skript-sketch/spa.webp',
    alt: 'Skizze: Auto voller Schaumwolken, drinnen döst eine Person mit geschlossenen Augen.',
  },
  {
    short: 'Samichlaus',
    kind: 'Konzept 3 · Die Weihnachts-Aktion',
    title: '«Die Weihnachts-Auszeit»',
    hook: 'Streusalz an der Scheibe, Tannennadeln auf dem Sitz, Geschenke-Stress im Nacken. Warum fährt der Samichlaus in Emmen, Zug und Sihlbrugg plötzlich rechts ran? Auf dem Handy wartet der beste Deal des Jahres: die OSCAR Weihnachts-Aktion.',
    twist: 'Das Apple Wallet öffnet die Schranke. Unter dem Schaumteppich wird es still, er atmet durch. Guetzli-Krümel und Nadeln verschwinden im Gratis-Sauger. Vor dem spiegelblanken Kombi zwinkert er:',
    line: '«Für dich selbst oder als Geschenkkarte: Man muss auch mal an sich selber denken!»',
    sketch: '/images/skript-sketch/samichlaus.webp',
    alt: 'Skizze: Samichlaus neben glänzendem Auto, zwinkert mit Daumen hoch, daneben ein Geschenk.',
  },
]

const EASE = [0.14, 0.71, 0.16, 0.99] as const

/**
 * The three scripts in short: pills pick one, its title and a rough marker sketch of the scene left of the axis
 * (directly on the paper, no panel), hook, twist and closing line right of it.
 * Signal red: the concept line and the rule on the closing line.
 */
export function MSkripts({ concept = 1, chrome = true }: MSkriptsProps) {
  const [active, setActive] = useState(concept - 1)
  const reduce = useReducedMotion()
  const s = SCRIPTS[active] ?? SCRIPTS[0]

  return (
    <Slide title="Skripts, kurz gefasst." chrome={chrome}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 gap-[12px]">
          {SCRIPTS.map((x, i) => (
            <Pill key={x.short} selected={i === active} onClick={() => setActive(i)} layoutId="skript-pill">
              <span className="tabular-nums text-current/60">0{i + 1}</span>
              {x.short}
            </Pill>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="grid-12 mt-[40px] min-h-0 flex-1"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          >
            <article className="col-span-5 flex min-h-0 flex-col overflow-hidden pr-4">
              <p className="text-pretty text-body text-signal">{s.kind}</p>
              <p className="mt-[8px] text-balance text-headline text-ink">{s.title}</p>
              <div className="flex min-h-0 flex-1 items-end justify-center pt-[24px]">
                <img src={s.sketch} alt={s.alt} className="max-h-full w-full max-w-[360px] object-contain object-bottom" />
              </div>
            </article>
            <div className="col-span-6 col-start-7 flex min-h-0 flex-col pl-4">
              <p className="text-body text-mute">Der Einstieg (Hook)</p>
              <p className="mt-[8px] text-pretty text-body text-ink">{s.hook}</p>
              <p className="mt-[24px] border-t border-ink/10 pt-[12px] text-body text-mute">Die Wendung (Twist)</p>
              <p className="mt-[8px] text-pretty text-body text-ink">{s.twist}</p>
              <p className="mt-[24px] border-l-2 border-signal pl-[16px] text-pretty text-body text-ink">{s.line}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Slide>
  )
}
