import { Slide } from './Slide'
import { Tag } from './ui'

export type A2RedaktionsplanProps = {
  /** Name the channels every reel runs on (once, as a tag above the plan). */
  channels?: boolean
  chrome?: boolean
}

const PLAN = [
  { w: 1, reel: '«POV: Erste Salzwoche, und an der Tür klebt schon die Kruste.»', pillar: 'Saison & Pflege', hook: 'POV Saison' },
  { w: 1, reel: '«Wir stoppen hier nicht die Zeit.»', pillar: 'Standort & Community', hook: 'Saugen' },
  { w: 2, reel: '«Wasch dein Auto im Winter NICHT wie im Sommer.»', pillar: 'Saison & Pflege', hook: 'Gegenthese' },
  { w: 2, reel: 'Die Textil-Lappen zum Anfassen', pillar: 'Hinter der Anlage', hook: 'Einwand «Kratzer?»' },
  { w: 3, reel: '«2 Wäschen im Monat, und das Abo hat sich bezahlt.»', pillar: 'Unlimited-Alltag', hook: 'Rechnung' },
  { w: 3, reel: 'Bis 150 Autos pro Stunde: ein Samstag in Emmen', pillar: 'Hinter der Anlage', hook: 'Einwand «Warten?»' },
  { w: 4, reel: '«Warum dein Auto 2 Tage nach der Wäsche wieder dreckig ist …»', pillar: 'Unlimited-Alltag', hook: 'Rätsel' },
  { w: 4, reel: 'Sonntag, 10 Uhr: Die ersten Autos in Zug', pillar: 'Standort & Community', hook: 'Sonntag' },
]

// Columns on half-column edges: Woche 1 · Reel 5 (ends on the axis) | Säule 3 · Hook 3.
const COL = {
  w: 'col-span-1 pr-4',
  reel: 'col-span-5 pr-[20px]',
  pillar: 'col-span-3 pl-4 pr-[20px]',
  hook: 'col-span-3',
}

/** Every reel runs on all of them, so they are named once instead of repeated per row. */
const CHANNELS = 'Instagram · TikTok · YouTube · Bildschirme vor Ort'

export function A2Redaktionsplan({ channels = true, chrome = true }: A2RedaktionsplanProps) {
  return (
    <Slide n="Anhang A13" kicker="Anhang" title="Redaktionsplan für 4 Wochen" chrome={chrome}>
      <div className="mb-[24px] flex items-center gap-[12px]">
        <Tag tone="red">Beispiel: November, Paket Standard</Tag>
        <Tag>8 Reels · 2 pro Woche</Tag>
        {channels && <Tag>{CHANNELS}</Tag>}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="grid-12 pb-[12px] text-body text-mute">
          <span className={COL.w}>Woche</span>
          <span className={COL.reel}>Reel</span>
          <span className={COL.pillar}>Säule</span>
          <span className={COL.hook}>Hook</span>
        </div>
        <div className="flex flex-1 flex-col">
          {PLAN.map((p, i) => (
            <div
              key={i}
              className={`grid-12 flex-1 items-center border-t text-body ${i % 2 === 0 ? 'border-ink/10' : 'border-ink/[0.04]'}`}
            >
              <span className={`${COL.w} text-mute tabular-nums`}>{i % 2 === 0 ? `Woche ${p.w}` : ''}</span>
              <span className={`${COL.reel} text-pretty text-ink`}>{p.reel}</span>
              <span className={`${COL.pillar} text-ink`}>{p.pillar}</span>
              <span className={`${COL.hook} text-mute`}>{p.hook}</span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}
