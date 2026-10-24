// Positioning matrix of the social media competitor analysis (snapshot 24.10.2026), used by the map in the
// appendix and the «Kosten des Nichtstuns» slide. Scores are an estimate from the public posts, no login,
// no engagement numbers. Happy Car Wash is not rated: its website links no social channel.

export type AnbieterId = 'oscar' | 'migrol' | 'avia' | 'waschman' | 'soft'

export type Anbieter = {
  id: AnbieterId
  name: string
  /** Name on the matrix, where the full name is too long. */
  short: string
  /** Instagram followers on 24.10.2026. */
  followers: number
  /** Instagram posts. */
  posts: number
  /** Axis 1, 0–2 per criterion: people in the picture, problem or everyday situation, benefit over tech and price, join in, local ties. */
  fokus: [number, number, number, number, number]
  /** Axis 2, 0–2 per criterion: share of reels, narrative arc, personality, posts without price message, platform-fit formats. */
  erzaehlen: [number, number, number, number, number]
  /** What runs in the feed, one short line. */
  feed: string
}

export const ANBIETER: Anbieter[] = [
  {
    id: 'oscar',
    name: 'OSCAR wash',
    short: 'OSCAR',
    followers: 317,
    posts: 65,
    fokus: [0, 0, 0, 0, 1],
    erzaehlen: [1, 0, 1, 0, 0],
    feed: 'Aktionsgrafiken mit Preisen, Stelleninserat, eine Maskottchen-Figur. Kein TikTok, keine aktiven Meta-Ads.',
  },
  {
    id: 'migrol',
    name: 'Migrol',
    short: 'Migrol',
    followers: 3388,
    posts: 443,
    fokus: [1, 2, 2, 1, 0],
    erzaehlen: [1, 0, 0, 2, 1],
    feed: 'Ratgeber-Karussells, Fake-Warnungen, Neueröffnungen. Car Wash ist ein Thema unter vielen.',
  },
  {
    id: 'avia',
    name: 'AVIA / Schätzle',
    short: 'AVIA',
    followers: 747,
    posts: 366,
    fokus: [2, 0, 1, 2, 2],
    erzaehlen: [1, 0, 1, 1, 1],
    feed: 'Gewinnspiele, Events, Sponsoring (FCL, Vereinskarte), vereinzelt Car-Wash-Reels.',
  },
  {
    id: 'waschman',
    name: 'Waschman',
    short: 'Waschman',
    followers: 530,
    posts: 82,
    fokus: [0, 0, 2, 0, 0],
    erzaehlen: [1, 0, 0, 2, 1],
    feed: 'Ergebnisfotos und -videos aufbereiteter Autos, oft Premium-Marken. Ruhig, ohne Gesichter.',
  },
  {
    id: 'soft',
    name: 'Soft Car Wash',
    short: 'Soft Car Wash',
    followers: 244,
    posts: 21,
    fokus: [2, 1, 1, 1, 0],
    erzaehlen: [2, 1, 2, 1, 2],
    feed: 'Fast nur Reels mit wiederkehrenden Mitarbeitenden, Untertitel, Humor. In Zug und Luzern nicht vor Ort.',
  },
]

export const byAnbieter = (id: AnbieterId) => ANBIETER.find((a) => a.id === id)!

const sum = (a: number[]) => a.reduce((s, n) => s + n, 0)

/** Axis 1, 0–10: from the annex (0) to the customer and their situation (10). */
export const fokusOf = (a: Anbieter) => sum(a.fokus)
/** Axis 2, 0–10: from the offer graphic (0) to a story with emotion (10). */
export const erzaehlenOf = (a: Anbieter) => sum(a.erzaehlen)

/** Position OSCAR can realistically reach with the five measures of the analysis. */
export const OSCAR_ZIEL: [number, number] = [8, 8]

/** Quadrant of a point: right of 5 = customer in the centre, above 5 = story. A point on the line 5 counts as left / below. */
export const quadrantOf = (x: number, y: number): [0 | 1, 0 | 1] => [x > 5 ? 1 : 0, y > 5 ? 0 : 1]
