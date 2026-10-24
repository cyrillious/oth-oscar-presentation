import type { ComponentType } from 'react'
import { MSlogan } from './MSlogan'
import { MAengste } from './MAengste'
import { MFindTheFear } from './MFindTheFear'
import { MKonkurrenz } from './MKonkurrenz'
import { MSolution } from './MSolution'
import { MKosten } from './MKosten'
import { MStrategie } from './MStrategie'
import { MDifferenzierung } from './MDifferenzierung'
import { MDivider } from './MDivider'
import { MResultate } from './MResultate'
import { MTeam } from './MTeam'
import { MFunnel } from './MFunnel'
import { MExperts } from './MExperts'
import { MNextSteps } from './MNextSteps'
import { S08Hooks } from './S08Hooks'
import { S10Rhythmus } from './S10Rhythmus'

export type DeckSlide = {
  id: string
  label: string
  Component: ComponentType
  /** Speaker notes, 2 to 4 sentences. */
  notes: string
  appendix?: boolean
}

export const DECK: DeckSlide[] = [
  {
    id: 'slogan',
    label: 'Der Slogan',
    Component: MSlogan,
    notes:
      'Make Carwash Sexy again: Sonne, nasse Haut, Film, Waschen als Pin-up der Neunziger. Premium: rotes Blech, Schaum, Studiolicht, die Waschanlage als Kinoszene. Playful: Limonadenstand, Seifenblasen, Gartenschlauch. Pro Klick wechselt das Gefühl, mit der Maus kommen Bilder dazu. Am Ende steht Feel: Ein Waschgang ist Routine, kein Erlebnis. Wir bringen das Gefühl zurück: Vorfreude beim Einfahren, Erleichterung am Ende. Das ist die Linie für alles, was folgt.',
  },
  {
    id: 'problem',
    label: 'Das Problem: die Ängste',
    Component: MAengste,
    notes:
      'Wer zu Ihnen fährt, nimmt eine Angst mit: um den Lack, ums Geld, sich an der Einfahrt zu blamieren. Niemand spricht sie aus. Wer Angst hat, fragt nicht nach, er fährt einfach nicht hin oder wäscht selbst.',
  },
  {
    id: 'oscar-heute',
    label: 'Das Problem: OSCAR heute',
    Component: MFindTheFear,
    notes:
      'Beim Preis ist OSCAR klar, das ist Ihre Stärke. Zu Kratzern und Warten steht etwas auf der Webseite, auf Social Media nicht. Zu Sauberkeit und Umwelt sagt OSCAR heute nichts. Die Konkurrenz ist nicht besser: Von 24 Posts nimmt genau einer eine Angst auf. Das Feld ist offen.',
  },
  {
    id: 'kosten',
    label: 'Kosten des Nichtstuns',
    Component: MKosten,
    notes:
      'Links die Positionierungsmatrix: oben erzählt, unten Grafiken, links steht die Anlage im Mittelpunkt, rechts die Kundschaft. OSCAR steht heute unten links, die Ecke oben rechts ist leer. Der Schalter zeigt, wer sie besetzt: Wartet OSCAR, zieht AVIA / Schätzle ein, sonst OSCAR. Was passiert, wenn OSCAR wartet? AVIA hat in Luzern schon Menschen im Bild, Gewinnspiele und Vereine, es fehlt nur der Erzählbogen. Ein paar Geschichten-Reels, und die Ecke gehört AVIA. Dann wirkt OSCARs Feed wie eine Preisliste, und die Abos aus dem November und Januar gehen für ein Jahr an die Konkurrenz. Jedes davon fehlt mit 450 bis 540 Franken.',
  },
  {
    id: 'strategie',
    label: 'Die Strategie',
    Component: MStrategie,
    notes:
      'Unsere Strategie ist ein Film. Jeder Mensch hat Grundängste, und jede Marke geht auf eine davon ein. Unser Content erzählt eine Geschichte, die diese Angst aufbaut und dann auflöst. OSCAR spielt darin die Hauptrolle: mal als Held, mal als Helfer oder Insider, aber immer subtil in die Geschichte verpackt. Am Ende steht die Erleichterung, und OSCAR ist die Lösung.',
  },
  {
    id: 'differenzierung',
    label: 'Unsere Differenzierung',
    Component: MDifferenzierung,
    notes:
      'Unser Kern: OSCAR beantwortet die Ängste offen, als Einzige in der Region. In drei Schritten: die Angst nennen, mit Bildern beweisen, im selben Moment zum Abo führen. Jeder Schritt unterstützt den Abschluss, nicht nur die Reichweite.',
  },
  {
    id: 'loesung',
    label: 'Die Lösung',
    Component: MSolution,
    notes:
      'Unsere Antwort: Wir verkaufen keine einzelnen Posts, sondern vier Methoden, die als fertiges Produkt bei OSCAR ankommen. Jede schaut von einer anderen Seite auf die Angst. Ein Klick auf eine Karte erklärt die Methode: was sie ist, in drei Schritten, wie wir sie für OSCAR einsetzen, und welches Produkt dabei herauskommt.',
  },
  {
    id: 'so-gehts',
    label: 'So funktioniert es',
    Component: S10Rhythmus,
    notes:
      'Jeder Monat läuft gleich: Skripte, ein Drehtag, Schnitt, Publizieren mit Report. Aus einem Drehtag entstehen Versionen für Instagram, TikTok, Shorts, die Bildschirme vor Ort und die Abo-Seite. Für Sie heisst das: ein Drehtag im Betrieb und zwei Freigaben pro Monat. Den Rest machen wir.',
  },
  {
    id: 'resultate',
    label: 'Resultate',
    Component: MResultate,
    notes:
      'Die Rechnung ist einfach: Der Pilot kostet einen festen Betrag, ein Abo bringt 450 bis 540 Franken im Jahr. Dividiert ergibt das die Abos bis Break-even. Vor dem Pitch die Investition eintragen. Gemessen wird an den Abo-Abschlüssen, zugeordnet über UTM im Shop, mit einem Report pro Monat auf einer Seite.',
  },
  {
    id: 'team',
    label: 'Team',
    Component: MTeam,
    notes:
      'Das ist oth.view: Janick als Founder und Director of Visuals, Severin als Co-Founder und Producer, Henoch als Creative Director und Timo in Administration und Assistenz. Bewusst klein, damit wir schnell sind, und breit genug, um Konzept, Foto, Film und Produktion selbst abzudecken.',
  },
  {
    id: 'next-steps',
    label: 'Nächste Schritte',
    Component: MNextSteps,
    notes:
      'Wir starten mit einem Find-the-Fear-Workshop mit Ihrem Team. Danach Konzept, dann ein Pilot über drei Monate, genau über beide Abo-Peaks in der Salz-Saison. Im Februar entscheiden wir gemeinsam anhand der Abo-Zahlen. Den Workshop können wir heute festlegen.',
  },
  {
    id: 'slogan-ende',
    label: 'Der Slogan (Schluss)',
    Component: () => <MSlogan cycle={false} />,
    notes: 'Zum Schluss noch einmal die Linie: Make Carwash Feel again. Fragen, oder legen wir den Workshop gleich fest?',
  },
  {
    id: 'uebergang-konkurrenz',
    label: 'Übergang: Konkurrenz',
    Component: () => <MDivider title="Was macht die Konkurrenz?" lead="Zwei Waschanlagen aus der Region, live auf ihren Kanälen." />,
    appendix: true,
    notes:
      'Bevor wir zeigen, was wir anders machen, ein Blick auf die Konkurrenz: Was machen Happy Car Wash und Autop auf Instagram, und was lassen sie liegen?',
  },
  {
    id: 'konkurrenz',
    label: 'Konkurrenz: Happy Car Wash & Autop',
    Component: () => <MKonkurrenz competitor="happy" />,
    appendix: true,
    notes:
      'Happy Car Wash ist der direkte Konkurrent vor Ort, mit Anlagen in Hünenberg und Root. Auf Instagram ist seit November 2020 nichts mehr passiert, das Feld ist leer. Dann in der Leiste zu Autop & Stützliwösch: aktiv, der letzte Reel ist vom 23. Oktober. Der Slogan lautet «Autowäsche ohne Kratzer», sie kennen die Angst also genau. In den Reels taucht er aber nicht auf. Oben wechseln wir zwischen Website und Instagram, beides live. Dieselbe Leiste zeigt auch Migrol, AVIA, Waschman und Soft Car Wash, falls jemand fragt.',
  },
  {
    id: 'methoden',
    label: 'Die Methoden: Schlüsselbund',
    Component: MSolution,
    appendix: true,
    notes:
      'Wie machen wir es anders? Mit vier Methoden am Schlüsselbund. Jede schaut von einer anderen Seite auf die Angst und liefert ein fertiges Produkt. Ein Klick auf eine Karte erklärt die Methode: was sie ist, in drei Schritten, wie wir sie für OSCAR einsetzen, und welches Produkt dabei herauskommt.',
  },
  {
    id: 'funnel',
    label: 'Tofu Mofu Bofu',
    Component: MFunnel,
    appendix: true,
    notes:
      'Jeder Inhalt hat eine Aufgabe: oben Aufmerksamkeit, in der Mitte Vertrauen, unten der Abschluss. So wissen wir bei jedem Reel, woran wir es messen. Am Ende zählt das abgeschlossene Abo.',
  },
  {
    id: 'experts',
    label: 'Cyrill Wipfli: digitale Inhalte',
    Component: MExperts,
    appendix: true,
    notes:
      'Hier zählt mein Einsatz: Cyrill Wipfli, Experte für digitale Inhalte. Die Mockups zeigen die Abo-Seite von OSCAR Unlimited auf dem Handy: links die Tarifwahl, rechts das Bezahlen mit dem Jahresabo zuerst.',
  },
  {
    id: 'hooks',
    label: 'Ideen: Hook-Bank',
    Component: S08Hooks,
    appendix: true,
    notes:
      'Die ersten zwei Sekunden entscheiden, ob jemand weiterschaut. Darum testen wir fünf Hook-Typen gegeneinander und behalten, was die beste Hook-Rate bringt. Die Rechnung mit 2 Wäschen gilt für Silber und das Jahresabo, das sagen wir auch so.',
  },
]

/** Number of slides before the appendix. */
export const MAIN_COUNT = DECK.filter((s) => !s.appendix).length

/** Footer number for the slide at `index`: «03» in the main part, «Anhang A4» in the appendix. */
export function slideNumber(index: number): { n: number | string; total: number } {
  const s = DECK[index]
  if (!s.appendix) return { n: index + 1, total: MAIN_COUNT }
  const k = DECK.slice(0, index + 1).filter((d) => d.appendix).length
  return { n: `Anhang A${k}`, total: MAIN_COUNT }
}
