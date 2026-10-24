// Generated with the Redewerkstatt engine (redewerksttt.vercel.app/werkstatt):
// Vier-Ohren-Check, Muster-Vorschläge, Spannungsbogen and hints come from the tool itself.
// Speaker text follows the deck notes in deck.tsx; edit both together.

export type Ear = 'sache' | 'appell' | 'selbst' | 'beziehung'
export type Level = 0 | 1 | 2
export type DotColor = 'green' | 'orange' | 'pink' | 'blue' | 'yellow' | 'black' | 'navy'

export type PlanItem = {
  key: string
  kind: 'step' | 'bridge'
  patternId?: string | null
  patternName: string
  mark: string
  label: string
  text: string
  tension: number
  dot: DotColor
  depth: number
  block: number
  /** Matching slides in the main deck. */
  slides: string
}

export type Redeplan = {
  title: string
  audience: string
  core: string
  earlier: string[]
  ist: Record<Ear, Level>
  soll: Record<Ear, Level>
  check: 'erreicht' | 'nah' | 'offen'
  change: string | null
  tone: 'druck' | 'bitte' | null
  summary: string
  suggestions: { patternId: string; score: number; reason: string }[]
  stats: { steps: number; patterns: number; words: number; time: string; empty: number }
  hints: string[]
  items: PlanItem[]
  patterns: Record<string, { name: string; origin: string; description: string; when: string }>
}

export const REDEPLAN: Redeplan = {
  "title": "OSCAR · Social Media Content Production",
  "audience": "Geschäftsleitung OSCAR, Pitch, rund 15 Minuten",
  "core": "Ich schlage vor, dass OSCAR jetzt die Ängste an der Waschstrasse offen beantwortet, weil nur einer von 24 Posts in der Region das tut.",
  "earlier": [
    "Wer die Ängste an der Waschstrasse offen beantwortet, gewinnt die Abos, weil in der Region sonst niemand darüber spricht."
  ],
  "ist": {
    "sache": 1,
    "appell": 2,
    "selbst": 0,
    "beziehung": 0
  },
  "soll": {
    "sache": 1,
    "appell": 2,
    "selbst": 0,
    "beziehung": 0
  },
  "check": "erreicht",
  "change": "Appell von schwach zu stark (neu «Ich schlage vor» und «tut»).",
  "tone": "bitte",
  "summary": "Ausgerichtet auf dein Ziel: Appell stark. Klingt nach einer Forderung («Ich schlage vor»).",
  "suggestions": [
    {
      "patternId": "standpunkt",
      "score": 21,
      "reason": "Passt, weil der Appell stark sein soll."
    },
    {
      "patternId": "ist-soll-weg",
      "score": 21,
      "reason": "Passt, weil der Appell stark sein soll."
    },
    {
      "patternId": "aida",
      "score": 13,
      "reason": "Passt, weil der Appell stark sein soll."
    },
    {
      "patternId": "popp",
      "score": 13,
      "reason": "Passt, weil der Appell stark sein soll."
    },
    {
      "patternId": "klimax",
      "score": 9.5,
      "reason": "Passt, weil der Appell stark sein soll."
    }
  ],
  "stats": {
    "steps": 11,
    "patterns": 4,
    "words": 326,
    "time": "2:30",
    "empty": 0
  },
  "hints": [
    "Dein Höhepunkt liegt im letzten Drittel, bei Schritt 11."
  ],
  "items": [
    {
      "key": "b1:0",
      "kind": "step",
      "patternId": "ist-soll-weg",
      "patternName": "Ist, Soll, Weg",
      "mark": "1",
      "label": "Ist: das Problem heute",
      "text": "Wer zur Waschstrasse fährt, nimmt eine Angst mit: um den Lack, ums Geld, sich an der Einfahrt zu blamieren. Diese Ängste spricht kaum jemand aus, aber sie entscheiden, ob jemand ein Abo abschliesst. Und niemand in der Region antwortet darauf.",
      "tension": 2,
      "dot": "orange",
      "depth": 0,
      "block": 0,
      "slides": "1–2"
    },
    {
      "key": "b1e:0",
      "kind": "step",
      "patternId": "umgekehrter-trichter",
      "patternName": "Umgekehrter Trichter",
      "mark": "1",
      "label": "Ein einzelner, konkreter Fall",
      "text": "Happy Car Wash postet seit November 2020 nichts mehr. Autop zeigt Jubiläum, Tombola und abgefilmte Plakate. Ihr Slogan heisst «Autowäsche ohne Kratzer», in den Reels kommt er nie vor.",
      "tension": 2,
      "dot": "orange",
      "depth": 1,
      "block": 0,
      "slides": "3–7"
    },
    {
      "key": "b1e:1",
      "kind": "step",
      "patternId": "umgekehrter-trichter",
      "patternName": "Umgekehrter Trichter",
      "mark": "2",
      "label": "Das Muster dahinter",
      "text": "Das ist kein Einzelfall: Von 24 Posts spricht genau einer eine Angst an, und das defensiv.",
      "tension": 3,
      "dot": "pink",
      "depth": 1,
      "block": 0,
      "slides": "8"
    },
    {
      "key": "b1e:2",
      "kind": "step",
      "patternId": "umgekehrter-trichter",
      "patternName": "Umgekehrter Trichter",
      "mark": "3",
      "label": "Das grosse Ganze",
      "text": "Über alle Kanäle dasselbe Bild. Die Antworten stehen auf Webseiten, auf Social Media fast nie. Auch OSCAR sagt heute nichts zu Kratzern, Sauberkeit und Umwelt.",
      "tension": 4,
      "dot": "blue",
      "depth": 1,
      "block": 0,
      "slides": "9"
    },
    {
      "key": "b1:1",
      "kind": "step",
      "patternId": "ist-soll-weg",
      "patternName": "Ist, Soll, Weg",
      "mark": "2",
      "label": "Soll: das Ziel",
      "text": "Stellen wir uns vor, eine Waschanlage beantwortet diese Ängste als Erste offen. Sie steht in der Region allein da. Das soll OSCAR sein.",
      "tension": 4,
      "dot": "black",
      "depth": 0,
      "block": 0,
      "slides": "9–10"
    },
    {
      "key": "b1:2",
      "kind": "step",
      "patternId": "ist-soll-weg",
      "patternName": "Ist, Soll, Weg",
      "mark": "3",
      "label": "Weg: deine Massnahmen, Stufe für Stufe",
      "text": "Der Weg dahin: Wir verkaufen keine einzelnen Posts, sondern Methoden, die als Produkt bei OSCAR ankommen.",
      "tension": 3,
      "dot": "blue",
      "depth": 0,
      "block": 0,
      "slides": "10"
    },
    {
      "key": "b1w:0",
      "kind": "step",
      "patternId": "stern",
      "patternName": "Stern",
      "mark": "Mitte",
      "label": "Das Thema, um das sich alles dreht",
      "text": "Im Zentrum steht die Angst des Kunden. Jede Methode schaut von einer anderen Seite darauf.",
      "tension": 3,
      "dot": "black",
      "depth": 1,
      "block": 0,
      "slides": "10"
    },
    {
      "key": "b1w:1",
      "kind": "step",
      "patternId": "stern",
      "patternName": "Stern",
      "mark": "A–E",
      "label": "Blickwinkel, in beliebiger Reihenfolge",
      "text": "Weirding the Normal: den Alltag aus einem ungewohnten Winkel zeigen, für die ersten zwei Sekunden. Only Is Better Than Best: nur zeigen, was man nachrechnen kann, etwa die einzige echte Flatrate der Region. The True Competitor: Wir schlagen die Ausrede «ich wasche selbst», nicht die Anlage nebenan. The Real Product: Man will ein Auto, auf das man stolz ist, ohne Kratzer, Kosten und Warten.",
      "tension": 4,
      "dot": "orange",
      "depth": 1,
      "block": 0,
      "slides": "11–14"
    },
    {
      "key": "b2:bridge",
      "kind": "bridge",
      "patternId": null,
      "patternName": "Übergang",
      "mark": "—",
      "label": "Übergang",
      "text": "Bleibt die Frage: Wer macht das, und woran messen wir es?",
      "tension": 0,
      "dot": "black",
      "depth": 0,
      "block": 1,
      "slides": "15"
    },
    {
      "key": "b2:0",
      "kind": "step",
      "patternId": "klimax",
      "patternName": "Klimax",
      "mark": "1",
      "label": "Erstes Glied: noch klein",
      "text": "Wir sind oth.view: bewusst klein, damit wir schnell sind, und breit genug für Konzept, Foto, Film und Produktion.",
      "tension": 2,
      "dot": "yellow",
      "depth": 0,
      "block": 1,
      "slides": "15"
    },
    {
      "key": "b2:1",
      "kind": "step",
      "patternId": "klimax",
      "patternName": "Klimax",
      "mark": "2",
      "label": "Zweites Glied: stärker",
      "text": "Jeder Inhalt hat eine Aufgabe, von der Aufmerksamkeit bis zum Abschluss. Am Ende zählt das abgeschlossene Abo. Wenn OSCAR mehr will, schalten wir Experten für Anzeigen, Community oder die Bildschirme vor Ort dazu.",
      "tension": 3,
      "dot": "orange",
      "depth": 0,
      "block": 1,
      "slides": "16–17"
    },
    {
      "key": "b2:2",
      "kind": "step",
      "patternId": "klimax",
      "patternName": "Klimax",
      "mark": "3",
      "label": "Drittes Glied: am stärksten, hier sitzt die Botschaft",
      "text": "Wir starten mit einem Find-the-Fear-Workshop, dann ein Pilot über drei Monate in der Salz-Saison. Im Februar entscheiden wir gemeinsam anhand der Zahlen. Und die Angst an der Einfahrt wird zum Grund, warum man bei OSCAR bleibt.",
      "tension": 5,
      "dot": "black",
      "depth": 0,
      "block": 1,
      "slides": "18"
    }
  ],
  "patterns": {
    "ist-soll-weg": {
      "name": "Ist, Soll, Weg",
      "origin": "Problemlöse-Fünfsatz",
      "description": "Du zeigst, wo es heute hakt, wie es sein sollte, und schlägst den Weg dorthin vor. Die Lücke zwischen Ist und Soll macht deinen Vorschlag dringlich.",
      "when": "Anträge, Vorschläge, Veränderungen anstossen."
    },
    "umgekehrter-trichter": {
      "name": "Umgekehrter Trichter",
      "origin": "induktiv",
      "description": "Du beginnst mit einem einzelnen, konkreten Fall und zeigst dann, dass er für etwas Grösseres steht.",
      "when": "Wenn du mit einer Geschichte einsteigen willst."
    },
    "stern": {
      "name": "Stern",
      "origin": "topische Gliederung, Mindmap",
      "description": "Ein Thema in der Mitte, rundherum verschiedene Blickwinkel. Die Reihenfolge der Aspekte ist frei wählbar.",
      "when": "Überblick geben, komplexe Themen ordnen."
    },
    "klimax": {
      "name": "Klimax",
      "origin": "antike Stilfigur",
      "description": "Drei Glieder, jedes stärker als das vorherige. Das letzte trägt das meiste Gewicht, darum gehört deine Botschaft dorthin.",
      "when": "Schlusssätze, Höhepunkte, Aufrufe."
    }
  }
}
