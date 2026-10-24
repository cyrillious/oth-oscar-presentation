import { COMPETITORS, FEARS, OSCAR, POINTS, type Coverage } from './competitors'

// Benchmark of the «OSCAR heute» slide: one aspect per tag, every aspect a few rows with one cell per
// company. All values come from the competitor research (snapshot 24.10.2026) in competitors.ts.

export type BenchCell = {
  /** Main text of the cell. */
  value: string
  /** One line under it, what exactly was found. */
  note?: string
  /** Points 0–2 shown as dots (fears only). */
  dots?: number
  /** Number set in text-headline. */
  big?: boolean
  /** Higher is better: decides «Vorn» and the rank. */
  score: number
}

export type BenchRow = {
  label: string
  /** Draw a bar scaled to the best value shown. */
  bar?: boolean
  cells: Record<string, BenchCell>
}

export type BenchAspect = {
  id: string
  label: string
  /** The one statement of the slide for this aspect. */
  title: string
  rows: BenchRow[]
  /** Legend of the dots, for the fears aspect. */
  legend?: boolean
}

export const COVERAGE_WORD: Record<Coverage, string> = { ja: 'Klar beantwortet', teils: 'Am Rand erwähnt', nein: 'Kein Thema' }

const IDS = [...COMPETITORS.map((c) => c.id), 'oscar']

/** Rows are written per company id; this fills the cells in the order of IDS. */
const cells = (f: (id: string) => BenchCell): Record<string, BenchCell> => Object.fromEntries(IDS.map((id) => [id, f(id)]))

const num = (s: string) => Number(s.replace(/[’']/g, ''))
const FOLLOWERS: Record<string, number> = {
  ...Object.fromEntries(COMPETITORS.map((c) => [c.id, num(c.profile.followers ?? '0')])),
  oscar: num(OSCAR.followers),
}
/** Sites per company. Migrol: «rund 70». */
const SITES: Record<string, number> = { happy: 5, autop: 8, migrol: 70, oscar: 3 }
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")

const byId = (table: Record<string, Omit<BenchCell, 'score'> & { score: number }>) => (id: string) => table[id]

export const ASPECTS: BenchAspect[] = [
  {
    id: 'aengste',
    label: 'Ängste beantwortet',
    title: 'Von fünf Ängsten beantwortet OSCAR heute eine klar: den Preis.',
    legend: true,
    rows: FEARS.map((f) => ({
      label: f.fear,
      cells: cells((id) => {
        const a = f.answers[id] ?? { c: 'nein' as Coverage, note: '' }
        return { value: COVERAGE_WORD[a.c], note: a.note, dots: POINTS[a.c], score: POINTS[a.c] }
      }),
    })),
  },
  {
    id: 'reichweite',
    label: 'Reichweite',
    title: 'OSCAR hat die kleinste Reichweite, pro Standort aber Mittelfeld.',
    rows: [
      {
        label: 'Follower auf Instagram',
        bar: true,
        cells: cells((id) => ({ value: fmt(FOLLOWERS[id]), big: true, score: FOLLOWERS[id] })),
      },
      {
        label: 'Follower je Standort',
        bar: true,
        cells: cells((id) => {
          const per = Math.round(FOLLOWERS[id] / SITES[id])
          return {
            value: fmt(per),
            big: true,
            note: id === 'migrol' ? 'bei rund 70 Anlagen' : `bei ${SITES[id]} Standorten`,
            score: per,
          }
        }),
      },
    ],
  },
  {
    id: 'aktivitaet',
    label: 'Aktivität',
    title: 'Aktiv ist vor allem Autop, Happy Car Wash schweigt seit 2020.',
    rows: [
      {
        label: 'Letzter Beitrag',
        cells: cells(
          byId({
            happy: { value: 'Nov. 2020', note: 'Seither kein Beitrag', score: 0 },
            autop: { value: '23.10.2026', note: '12 Reels seit April 2026', score: 3 },
            migrol: { value: 'Laufend', note: 'Car Wash: 1 von den letzten 12 Posts', score: 1 },
            oscar: { value: 'Aug. 2026', note: 'Vor rund zwei Monaten', score: 2 },
          }),
        ),
      },
    ],
  },
  {
    id: 'preis',
    label: 'Preismodell',
    title: 'Beim Preis ist OSCAR vorn: Fixpreis und Flatrate statt Rabattkarte.',
    rows: [
      {
        label: 'Wie der Preis gezeigt wird',
        cells: cells(
          byId({
            happy: { value: 'Bonuskarte', note: '«Happy Days»', score: 1 },
            autop: { value: 'Cash Card', note: 'Bis 25 % Rabatt', score: 1 },
            migrol: { value: 'Car Wash Card', note: 'Bis 20 % Rabatt', score: 1 },
            oscar: { value: 'Fixpreis', note: '«Kosten jederzeit im Griff»', score: 2 },
          }),
        ),
      },
      {
        label: 'Flatrate',
        cells: cells(
          byId({
            happy: { value: 'Keine', score: 0 },
            autop: { value: 'Keine', score: 0 },
            migrol: { value: 'Keine', score: 0 },
            oscar: { value: 'Unlimited', note: 'Ab 37.50 im Monat im Jahresabo', score: 2 },
          }),
        ),
      },
    ],
  },
  {
    id: 'standorte',
    label: 'Standorte',
    title: 'OSCAR ist lokal: 3 Standorte gegen 5, 8 und rund 70.',
    rows: [
      {
        label: 'Anlagen',
        bar: true,
        cells: cells(
          byId({
            happy: { value: '5', big: true, note: 'u. a. Hünenberg und Root', score: 5 },
            autop: { value: '8', big: true, note: 'Der nächste in Richterswil', score: 8 },
            migrol: { value: '70', big: true, note: 'Rund 70 in der Schweiz', score: 70 },
            oscar: { value: '3', big: true, note: 'Heute', score: 3 },
          }),
        ),
      },
    ],
  },
]

/**
 * Points of one company in one row, 0 to 2. Fears carry their own points (dots). Every other row scales its
 * values over all companies, so the points do not move when a competitor is taken off the table.
 */
export function pointsOf(row: BenchRow, id: string): number {
  const cell = row.cells[id]
  if (cell.dots != null) return cell.dots
  const s = IDS.map((x) => row.cells[x].score)
  const min = Math.min(...s)
  const max = Math.max(...s)
  return max === min ? 1 : Math.round((2 * (cell.score - min)) / (max - min))
}

export const totalPoints = (aspect: BenchAspect, id: string) => aspect.rows.reduce((sum, r) => sum + pointsOf(r, id), 0)
export const maxPoints = (aspect: BenchAspect) => aspect.rows.length * 2
