import type { InstaProfileData } from './InstaProfile'

// Competitor research for the «Find the Fear» and competitor slides.
// Numbers are a snapshot from the public profile pages on 24.10.2026: re-check them the day before the pitch.

export type Coverage = 'ja' | 'teils' | 'nein'

export type Competitor = {
  id: string
  name: string
  /** Shorter name where a column is too narrow for `name` (Find-the-Fear header). */
  short?: string
  /** Short line under the name: operator, sites, model. */
  meta: string
  /** Social presence in one line, shown in the Find-the-Fear header. */
  presence: string
  /** Sites in a few words, under the name on the benchmark row. */
  sites: string
  /** Activity on Instagram, right side of the benchmark row. */
  activity: string
  /** Statement title of the competitor slide. */
  title: string
  profile: InstaProfileData
  /** Optional full screenshot in /public/images/konkurrenz/. Replaces the rebuilt profile. */
  screenshot?: string
  /** Three big numbers on the competitor slide. */
  facts: { value: string; label: string }[]
  /** What OSCAR takes from it: one sentence. */
  lesson: string
  source: string
  /** Website for the lightbox on the competitor slide. */
  site: { url: string; label: string; /** False when the site forbids iframes (X-Frame-Options). */ embed: boolean }
}

export const RESEARCH_DATE = '24.10.2026'

export const COMPETITORS: Competitor[] = [
  {
    id: 'happy',
    name: 'Happy Car Wash',
    meta: 'CLEAN AG, Rotkreuz · 5 Anlagen, 24/7 offen, Self-Service und Portal · u. a. Hünenberg ZG, Root LU, Hochdorf LU',
    presence: '713 Follower · letzter Post 2020',
    sites: '5 Anlagen',
    activity: 'Letzter Post 2020',
    title: 'Happy Car Wash ist vor Ort, aber seit 2020 still.',
    profile: {
      handle: '_happy_car_wash_',
      name: 'Happy Car Wash',
      avatar: '/images/konkurrenz/happy-logo.png',
      posts: '61',
      followers: '713',
      following: '4',
      bio: ['Hünenberg · Root · Hochdorf · Nänikon · Kloten'],
      stale: 'Letzter Beitrag: 17.11.2020',
    },
    facts: [
      { value: '5', label: 'Anlagen, u. a. Hünenberg und Root' },
      { value: '713', label: 'Follower auf Instagram' },
      { value: '2020', label: 'letzter Beitrag' },
    ],
    lesson: 'Der direkte Konkurrent lässt das Feld leer.',
    source: 'instagram.com/_happy_car_wash_, happycarwash.com',
    site: { url: 'https://happycarwash.com/', label: 'happycarwash.com', embed: true },
  },
  {
    id: 'autop',
    name: 'Autop & Stützliwösch',
    short: 'Autop',
    meta: 'Waschstrassen und Self-Service an 8 Standorten · nächster in Richterswil, 15–20 km von Sihlbrugg',
    presence: '864 Follower · letzter Reel 23.10.2026',
    sites: '8 Standorte',
    activity: 'Letzter Reel 23.10.2026',
    title: 'Autop & Stützliwösch hat die Angst im Slogan, aber nicht in den Reels.',
    profile: {
      handle: 'autop_stuetzliwoesch',
      name: 'Autop & Stützliwösch',
      avatar: '/images/konkurrenz/autop-avatar.jpg',
      posts: '215',
      followers: '864',
      following: '769',
      bio: [],
    },
    facts: [
      { value: '8', label: 'Standorte, der nächste in Richterswil' },
      { value: '864', label: 'Follower auf Instagram' },
      { value: '12', label: 'Reels seit April 2026' },
    ],
    lesson: '«Autowäsche ohne Kratzer» steht nur auf der Website.',
    source: 'instagram.com/autop_stuetzliwoesch, autop.ch',
    site: { url: 'https://autop.ch/', label: 'autop.ch', embed: true },
  },
  {
    id: 'migrol',
    name: 'Migrol',
    meta: 'Rund 70 Car-Wash-Anlagen in der Schweiz, eine an der Chollerstrasse in Zug',
    presence: "3'381 Follower · Car Wash ist Nebenthema",
    sites: 'Rund 70 Anlagen',
    activity: 'Car Wash ist Nebenthema',
    title: 'Migrol: gross und aktiv, aber Car Wash ist nur ein Thema unter vielen.',
    profile: {
      handle: 'migrol_ag',
      name: 'Migrol',
      avatar: '/images/konkurrenz/migrol-avatar.jpg',
      posts: '443',
      followers: "3'381",
      following: '58',
      bio: [],
    },
    facts: [
      { value: '70', label: 'Car-Wash-Anlagen in der Schweiz' },
      { value: "3'381", label: 'Follower auf Instagram' },
      { value: '1', label: 'Car-Wash-Post in den letzten 12' },
    ],
    lesson: 'Reichweite ohne Fokus. Car Wash bleibt Nebensache.',
    source: 'instagram.com/migrol_ag, migrol.ch',
    site: { url: 'https://www.migrol.ch/de/rund-ums-fahrzeug/waschanlagen/', label: 'migrol.ch', embed: false },
  },
]

/** Competitors from the positioning map that only show up in the live frame of the competitor slide (no research sheet of their own). */
export type LiveCompetitor = {
  id: string
  name: string
  /** Label on the switch bar. */
  label: string
  /** Instagram handle without the @. */
  handle: string
  source: string
  site: Competitor['site']
}

export const MORE_COMPETITORS: LiveCompetitor[] = [
  {
    id: 'avia',
    name: 'AVIA / Schätzle',
    label: 'AVIA',
    handle: 'schaetzle_ag_luzern',
    source: 'instagram.com/schaetzle_ag_luzern, schaetzle.ch',
    site: { url: 'https://schaetzle.ch/privatkunden/car-wash/', label: 'schaetzle.ch', embed: false },
  },
  {
    id: 'waschman',
    name: 'Waschman',
    label: 'Waschman',
    handle: 'waschman.ch',
    source: 'instagram.com/waschman.ch, waschman.ch',
    site: { url: 'https://waschman.ch/', label: 'waschman.ch', embed: true },
  },
  {
    id: 'soft',
    name: 'Soft Car Wash',
    label: 'Soft',
    handle: 'softcarwash_ch',
    source: 'instagram.com/softcarwash_ch, softcarwash.ch',
    site: { url: 'https://softcarwash.ch/', label: 'softcarwash.ch', embed: true },
  },
]

/** Competitors that get their own slide, in deck order. */
export const FEATURED = ['happy', 'autop'] as const

export const OSCAR_PRESENCE = '317 Follower · letzter Post Aug. 2026'

/** OSCAR as the benchmark row on the competitor slide. */
export const OSCAR = {
  id: 'oscar',
  name: 'OSCAR wash',
  avatar: '/images/konkurrenz/oscar-avatar.jpg',
  sites: '3 Standorte',
  followers: '317',
  activity: 'Letzter Post Aug. 2026',
}

export type Fear = {
  fear: string
  /** Per competitor id plus «oscar»: coverage and a short note how they answer it. */
  answers: Record<string, { c: Coverage; note: string }>
}

export const FEARS: Fear[] = [
  {
    fear: '«Gibt das Kratzer?»',
    answers: {
      happy: { c: 'teils', note: 'Nur Website: «verhindert Mikrokratzer»' },
      autop: { c: 'ja', note: 'Slogan «Autowäsche ohne Kratzer»' },
      migrol: { c: 'teils', note: '«Schonende Textilwäsche»' },
      oscar: { c: 'teils', note: '«Schnell und schonend», nicht auf Social Media' },
    },
  },
  {
    fear: '«Zahle ich zu viel?»',
    answers: {
      happy: { c: 'teils', note: 'Bonuskarte, «Happy Days»' },
      autop: { c: 'teils', note: 'Cash Card bis 25 % Rabatt' },
      migrol: { c: 'teils', note: 'Car Wash Card bis 20 % Rabatt' },
      oscar: { c: 'ja', note: 'Fixpreis: «Kosten jederzeit im Griff»' },
    },
  },
  {
    fear: '«Muss ich warten?»',
    answers: {
      happy: { c: 'teils', note: 'Nur Website: «keine Wartezeiten»' },
      autop: { c: 'nein', note: '' },
      migrol: { c: 'nein', note: '' },
      oscar: { c: 'teils', note: '«Ohne Wartezeiten an der Kasse»' },
    },
  },
  {
    fear: '«Ist es danach wirklich sauber?»',
    answers: {
      happy: { c: 'teils', note: '«Streifenfreies Finish»' },
      autop: { c: 'nein', note: '' },
      migrol: { c: 'teils', note: '«Absolut sauberes Waschergebnis»' },
      oscar: { c: 'nein', note: '' },
    },
  },
  {
    fear: '«Ist das schlecht für die Umwelt?»',
    answers: {
      happy: { c: 'teils', note: '«Wasserschonend»' },
      autop: { c: 'ja', note: '«Nur rund 40 Liter Frischwasser»' },
      migrol: { c: 'ja', note: 'Weniger Belastung als zu Hause' },
      oscar: { c: 'nein', note: '' },
    },
  },
]

/** Points per fear: each dot is one point. */
export const POINTS: Record<Coverage, number> = { ja: 2, teils: 1, nein: 0 }

/** Highest score across all fears. */
export const MAX_POINTS = FEARS.length * 2

/** Points across all fears for a competitor id or «oscar». */
export function fearScore(id: string) {
  return FEARS.reduce((sum, f) => sum + POINTS[f.answers[id]?.c ?? 'nein'], 0)
}

export type Method = 'Weirding the Normal' | 'Only Is Better Than Best' | 'The True Competitor' | 'The Real Product & Find the Fear'

/** How the post deals with the fear behind it. */
export type FearStatus = 'offen' | 'defensiv' | 'keine'

export type Post = {
  /** Cover frame in /public/images/konkurrenz/posts/. */
  img: string
  date: string
  format: 'Reel' | 'Video' | 'Bild'
  /** What the post shows, one short line. */
  shows: string
  /** Fear behind the post, in the customer's words. Empty when there is none. */
  fear?: string
  status: FearStatus
  method: Method
  /** How our method would answer it, one short line. */
  move: string
  /** What the post does well, one or two short lines. */
  good: string[]
  /** What it misses, one or two short lines. */
  bad: string[]
}

export type PostPage = {
  id: string
  competitor: string
  title: string
  posts: Post[]
}

// Single posts, picked from the last 12 on each profile (snapshot 24.10.2026).
export const POST_PAGES: PostPage[] = [
  {
    id: 'happy',
    competitor: 'happy',
    title: 'Schöne Autos, aber keine Antwort auf eine Angst.',
    posts: [
      {
        img: '/images/konkurrenz/posts/happy-bmw-m4.jpg',
        date: '26.07.2019',
        format: 'Video',
        shows: 'BMW M4 fährt aus der Anlage, dazu 14 Hashtags.',
        fear: '«Gibt das Kratzer?»',
        status: 'offen',
        method: 'The Real Product & Find the Fear',
        move: 'Angst aussprechen, Textil-Lappen zeigen.',
        good: ['Echtes Auto, echte Anlage.'],
        bad: ['14 Hashtags statt einer Aussage.', 'Die Angst vor Kratzern bleibt offen.'],
      },
      {
        img: '/images/konkurrenz/posts/happy-pollen.jpg',
        date: '27.04.2020',
        format: 'Video',
        shows: 'Grafik zu Blütenstaub, auf Englisch.',
        fear: '«Ist es danach wirklich sauber?»',
        status: 'offen',
        method: 'The True Competitor',
        move: 'Zeigen, was Pollen auf dem Lack anrichten.',
        good: ['Anlass aus der Saison, klare Aufforderung.'],
        bad: ['Nur eine Grafik, auf Englisch.', 'Zeigt nicht, was Pollen am Lack anrichten.'],
      },
      {
        img: '/images/konkurrenz/posts/happy-handgel.jpg',
        date: '17.11.2020',
        format: 'Video',
        shows: 'Handgel am Automaten. Der letzte Beitrag bis heute.',
        status: 'keine',
        method: 'Weirding the Normal',
        move: 'Den Waschalltag zeigen, nicht das Sortiment.',
        good: ['Reagiert auf die Lage im Herbst 2020.'],
        bad: ['Zeigt Sortiment statt Wäsche.', 'Seither kein einziger Beitrag.'],
      },
    ],
  },
  {
    id: 'autop-1',
    competitor: 'autop',
    title: 'Autop filmt Plakate ab, statt den Moment zu zeigen.',
    posts: [
      {
        img: '/images/konkurrenz/posts/autop-richterswil.jpg',
        date: '23.10.2026',
        format: 'Reel',
        shows: 'Plakat: 20 Jahre Richterswil, ein Tag Gratis-Wäsche.',
        fear: '«Zahle ich zu viel?»',
        status: 'offen',
        method: 'Only Is Better Than Best',
        move: 'Flatrate vorrechnen: ab 37.50 im Monat.',
        good: ['Klarer Anlass mit Angebot: ein Tag gratis.'],
        bad: ['Abgefilmtes Plakat statt Moment vor Ort.'],
      },
      {
        img: '/images/konkurrenz/posts/autop-tombola.jpg',
        date: '19.08.2026',
        format: 'Reel',
        shows: 'Plakat: Tombola mit Preisen bis CHF 600.',
        status: 'keine',
        method: 'Weirding the Normal',
        move: 'Den Tag filmen, nicht das Plakat.',
        good: ['Gibt einen Grund vorbeizukommen.'],
        bad: ['Wieder nur ein abgefilmtes Plakat.'],
      },
      {
        img: '/images/konkurrenz/posts/autop-fotoshooting.jpg',
        date: '02.07.2026',
        format: 'Reel',
        shows: 'Plakat: Gratis-Fotoshooting für dich und dein Auto.',
        status: 'keine',
        method: 'The Real Product & Find the Fear',
        move: 'Trifft den Stolz aufs Auto. Das machen wir zur Serie.',
        good: ['Trifft den Stolz aufs Auto.'],
        bad: ['Zeigt das Plakat, nicht die Bilder vom Shooting.'],
      },
    ],
  },
  {
    id: 'autop-2',
    competitor: 'autop',
    title: 'Die Angst kommt vor, aber nur in der Defensive.',
    posts: [
      {
        img: '/images/konkurrenz/posts/autop-zeitung.jpg',
        date: '27.06.2026',
        format: 'Reel',
        shows: 'Zeitungsartikel zum Vorwurf Wasserverbrauch.',
        fear: '«Ist das schlecht für die Umwelt?»',
        status: 'defensiv',
        method: 'The Real Product & Find the Fear',
        move: 'Selbst ansprechen, mit belegter Zahl.',
        good: ['Nimmt die Frage nach der Umwelt auf.'],
        bad: ['Nur als Rechtfertigung auf einen Artikel.'],
      },
      {
        img: '/images/konkurrenz/posts/autop-selfwash.jpg',
        date: '26.04.2026',
        format: 'Reel',
        shows: 'Eine Frau schäumt ihr Auto in der SB-Box ein.',
        fear: '«Gibt das Kratzer?»',
        status: 'offen',
        method: 'The True Competitor',
        move: 'Gegen «mach ich selbst»: 5 Minuten Durchfahrt.',
        good: ['Echter Mensch, echte Handlung.'],
        bad: ['Zeigt das Selberwaschen, also die Ausrede, gegen die wir arbeiten.'],
      },
      {
        img: '/images/konkurrenz/posts/autop-letzipark.jpg',
        date: '28.04.2026',
        format: 'Reel',
        shows: 'Serie zum Abschied vom Letzipark. Tele Züri zieht nach.',
        status: 'keine',
        method: 'Weirding the Normal',
        move: 'Das Serien-Format übernehmen, für den Alltag.',
        good: ['Serie mit echten Menschen. Tele Züri zieht nach.'],
        bad: ['Ein einmaliger Anlass, kein Bezug zum Waschalltag.'],
      },
    ],
  },
]

/** Pattern across the last 12 posts of Happy Car Wash and Autop. */
export const MACRO = [
  { value: '1 von 24', label: 'Posts spricht eine Angst an, und zwar defensiv.' },
  { value: '4 von 12', label: 'Autop-Reels zeigen ein abgefilmtes Plakat oder einen Artikel.' },
  { value: '7 von 12', label: 'Autop-Reels haben nur Hashtags als Text.' },
]
