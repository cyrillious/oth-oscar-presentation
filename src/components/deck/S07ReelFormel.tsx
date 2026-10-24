import { Slide } from './Slide'

export type S07ReelFormelProps = {
  /** 9:16 phone mock-up showing hook, subtitles and CTA on a real frame. */
  phone?: boolean
  chrome?: boolean
}

const TOTAL_S = 40
const BLOCKS = [
  { from: 0, to: 2, name: 'Hook', text: 'Das Ergebnis zuerst' },
  { from: 2, to: 7, name: 'Problem', text: 'Ein Satz in Alltagssprache' },
  { from: 7, to: 25, name: 'Zeigen', text: 'Einfahrt, Schaum, Textil-Lappen, Trocknen, Saugen' },
  { from: 25, to: 32, name: 'Beweis', text: 'Vorher/Nachher oder Zahl, z. B. «37.50 im Monat, jeden Tag waschen»' },
  { from: 32, to: 38, name: 'CTA', text: '«Unlimited abschliessen, Link im Profil» oder Standort mit Öffnungszeiten' },
]

/** The one signal accent: the hook's two seconds on the time bar. */
const ACCENT = 'Hook'

function Phone() {
  return (
    <div className="relative h-full" style={{ aspectRatio: '9 / 16' }}>
      <div className="absolute inset-0 rounded-[32px] bg-ink p-[6px] shadow-[0_24px_48px_-28px_rgb(17_17_17/0.45)]">
        <div className="relative size-full overflow-hidden rounded-[26px]">
        <img src="/images/sihlbrugg.jpg" alt="" className="absolute inset-0 size-full object-cover object-[30%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/60" />
        <p className="absolute inset-x-[20px] top-[36px] text-balance text-center text-body text-paper">Wir stoppen hier nicht die Zeit.</p>
        <div className="absolute inset-x-[16px] bottom-[64px] flex justify-center">
          <span className="rounded-[4px] bg-ink/70 px-[8px] py-[4px] text-center text-body text-paper">Gratis saugen nach jeder Wäsche.</span>
        </div>
        <div className="absolute inset-x-[16px] bottom-[20px] flex h-[32px] items-center justify-center rounded-full bg-paper text-body text-ink">
          Unlimited · Link im Profil
        </div>
        </div>
      </div>
    </div>
  )
}

// Skill layout 9 «Liste» as a timeline: rows with hairlines over half-columns 1–9
// (time · phase · description with bar), phone in half-columns 11–12.
export function S07ReelFormel({ phone = true, chrome = true }: S07ReelFormelProps) {
  return (
    <Slide
      n={7}
      kicker="Die Reel-Formel"
      title="Jedes Reel folgt derselben Formel. Höchstens 40 Sekunden."
      lead="9:16, 30–40 Sekunden. Kürzer ist besser."
      chrome={chrome}
    >
      <div className="grid-12 min-h-0 flex-1">
        <div className={`flex min-h-0 flex-col ${phone ? 'col-span-9' : 'col-span-12'}`}>
          {BLOCKS.map((b) => (
            <div key={b.name} className={`grid flex-1 items-center border-t border-ink/10 ${phone ? 'grid-cols-9' : 'grid-cols-12'}`}>
              <span className="col-span-1 text-body text-mute tabular-nums">
                {b.from}–{b.to} s
              </span>
              <span className="col-span-2 text-headline text-ink">{b.name}</span>
              <div className={phone ? 'col-span-6' : 'col-span-9'}>
                <p className="text-pretty text-body text-ink/75">{b.text}</p>
                <div className="relative mt-[8px] h-[6px] rounded-full bg-ink/[0.06]">
                  <span
                    className={`absolute top-0 h-full rounded-full ${b.name === ACCENT ? 'bg-signal' : 'bg-ink'}`}
                    style={{ left: `${(b.from / TOTAL_S) * 100}%`, width: `${((b.to - b.from) / TOTAL_S) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {phone && (
          <div className="col-span-2 col-start-11 flex min-h-0 justify-end">
            <Phone />
          </div>
        )}
      </div>
    </Slide>
  )
}
