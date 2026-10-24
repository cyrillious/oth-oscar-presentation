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
}

const SCRIPTS: Script[] = [
  {
    short: 'Date',
    kind: 'Konzept 1 · Die Last-Minute-Rettung (Man in a Hole)',
    title: '«Das Date in letzter Sekunde»',
    hook: 'Eine spontane Nachricht auf dem Handy: «Holst du mich in 10 Minuten ab?», egal ob am Bahnhof Zug, in Emmen oder Sihlbrugg. Du schaust auf den Beifahrersitz und siehst das Chaos: Kaffeeflecken, Gipfeli-Krümel und Hundehaare. Panik bricht aus!',
    twist: 'Zum Glück liegt OSCAR direkt auf dem Weg. Dank dem Wallet-Pass öffnet sich die Schranke wie von Zauberhand, und der Wagen ist in nur 8 Minuten wieder blitzblank. Dein cooles Fazit zum Date:',
    line: '«Ich bin einfach ein sehr strukturierter Mensch.»',
  },
  {
    short: 'Spa',
    kind: 'Konzept 2 · Die kleine Auszeit (Rolls Royce Moment)',
    title: '«Das günstigste Spa der Zentralschweiz»',
    hook: 'Warum fahren Abo-Kunden eigentlich dreimal pro Woche zu OSCAR nach Emmen, Zug oder Sihlbrugg? Nicht nur wegen ein bisschen Schmutz, sondern weil es die einzige legale Auszeit vom stressigen Alltag ist!',
    twist: 'Draussen herrscht Pendler-Stau und E-Mail-Chaos. Drinnen legt sich weisser Schaum sanft über die Scheibe, die Welt draussen wird leise. Dein Moment der Ruhe:',
    line: '«Das günstigste Spa der Zentralschweiz.»',
  },
  {
    short: 'Samichlaus',
    kind: 'Konzept 3 · Die Weihnachts-Aktion',
    title: '«Die Weihnachts-Auszeit»',
    hook: 'Streusalz an der Scheibe, 500 Tannennadeln auf dem Sitz und Geschenke-Stress im Nacken. Warum fährt der Samichlaus in Emmen, Zug und Sihlbrugg plötzlich rechts ran? Weil er auf dem Handy den besten Deal des Jahres entdeckt: die OSCAR Weihnachts-Aktion.',
    twist: 'Dank dem Apple Wallet fliegt die Schranke sofort auf. Unter dem dichten Schaumteppich kehrt erst mal absolute Stille ein, und er atmet tief durch. Zum Schluss verschwinden die Guetzli-Krümel und Nadeln im Gratis-Sauger. Er steht vor dem spiegelblanken Kombi und zwinkert:',
    line: '«Für dich selbst oder als Geschenkkarte: Man muss auch mal an sich selber denken!»',
  },
]

const EASE = [0.14, 0.71, 0.16, 0.99] as const

/**
 * The three scripts in short: pills pick one, its title left of the axis, hook, twist and closing line right of it.
 * The closing line carries the slide's one signal accent (red rule).
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
            <div className="col-span-5">
              <p className="text-pretty text-body text-mute">{s.kind}</p>
              <p className="mt-[8px] text-balance text-headline text-ink">{s.title}</p>
            </div>
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
