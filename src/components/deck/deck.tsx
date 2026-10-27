import type { ComponentType } from 'react'
import { MSlogan } from './MSlogan'
import { MStatement } from './MStatement'
import { MStoryboard } from './MStoryboard'
import { MKonkurrenzVersagt } from './MKonkurrenzVersagt'
import { MVideoKonzepte } from './MVideoKonzepte'
import { MSkripts } from './MSkripts'
import { MDrehplan } from './MDrehplan'
import { MAengste } from './MAengste'
import { MSolution } from './MSolution'
import { MStrategie } from './MStrategie'
import { MTeam } from './MTeam'
import { MFunnel } from './MFunnel'
import { MExperts } from './MExperts'
import { MNextSteps } from './MNextSteps'
import { S10Rhythmus } from './S10Rhythmus'
import { MDreiAengste } from './MDreiAengste'
import { MHumor } from './MHumor'
import { MHeroFilm } from './MHeroFilm'
import { MAngebot } from './MAngebot'
import { MVision } from './MVision'
import { MShortLong } from './MShortLong'
import { MMarkenauftritt } from './MMarkenauftritt'
import { MEnde } from './MEnde'

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
    id: 'nicht-sexy',
    label: 'Autowaschen ist nicht sexy',
    Component: MStatement,
    notes:
      'Autowaschen ist nicht sexy. Niemand freut sich auf die Waschstrasse, sie ist eine Pflicht zwischen zwei Terminen. Genau da setzen wir an. Klick: Make Carwash Sexy again.',
  },
  {
    id: 'slogan',
    label: 'Der Slogan',
    Component: MSlogan,
    notes:
      'Make Carwash Sexy again. Ein Waschgang ist heute Routine, kein Erlebnis. Wir bringen das Gefühl zurück: Vorfreude beim Einfahren, Erleichterung am Ende. Das ist die Linie für alles, was folgt.',
  },
  {
    id: 'team',
    label: 'Team',
    Component: MTeam,
    notes:
      'Das ist oth.view: Janick als Founder und Director of Visuals, Severin als Co-Founder und Producer, Cyrill als Design Engineer für die digitalen Inhalte. Mit unserem Studio in Rotkreuz sind wir direkt vor Ort. Bewusst klein, damit wir schnell sind, und breit genug, um Konzept, Foto, Film und Produktion selbst abzudecken.',
  },
  {
    id: 'storyboard',
    label: 'Storyboard: Die Beifahrer-Panik',
    Component: MStoryboard,
    notes:
      'So sieht das aus: eine spontane Nachricht, «Holst du mich in 10 Minuten ab?». Blick auf den Beifahrersitz: Gipfeli-Krümel, Kaffeeflecken, Hundehaare. Weil OSCAR überall auf der Route liegt, öffnet der Wallet-Pass die Schranke, und das Date ist in 3 Minuten gerettet. «Ich bin einfach ein sehr strukturierter Mensch.»',
  },
  {
    id: 'find-the-fear',
    label: 'Find the Fear: soziale Scham',
    Component: MAengste,
    notes:
      'Dahinter steckt eine Angst. Menschen kaufen selten aus reinem Vernunftkalkül, sondern um eine Angst zu lindern, hier die Fear of Criticism. Niemand will, dass das Date, Kunden oder Kollegen in ein verkrümeltes, schmutziges Auto steigen. Und sie ist nur eine von vielen: um den Lack, ums Geld, sich an der Einfahrt zu blamieren. Niemand spricht sie aus, wer Angst hat, fährt einfach nicht hin oder wäscht selbst.',
  },
  {
    id: 'drei-aengste',
    label: 'Darum gehen Leute nicht in die Waschstrasse',
    Component: () => <MDreiAengste view="angst" />,
    notes:
      'Darum gehen Leute nicht in die Waschstrasse. Das Soziale: Niemand will, dass Dates, Kunden oder Kollegen in ein schmutziges Auto steigen, was denken die anderen? Das Finanzielle: Lohnt sich das Abo, wer rechnet, lässt es lieber bleiben. Und die Zeit: Keine Zeit heisst meist keine Motivation, Autowaschen rutscht ans Ende der Liste.',
  },
  {
    id: 'loesung-aengste',
    label: 'OSCAR spricht alle drei an',
    Component: () => <MDreiAengste view="loesung" />,
    notes:
      'OSCAR spricht alle drei an. Mit dem Abo ist das Auto immer vorzeigbar, keine Peinlichkeiten mehr. Ein fixer Preis gibt Kostensicherheit, Silber lohnt sich schon ab zwei Wäschen im Monat. Und in drei Minuten ist man durch, der Rest des Tages gehört dem Kunden.',
  },
  {
    id: 'konkurrenz-versagt',
    label: 'Warum die Konkurrenz versagt',
    Component: MKonkurrenzVersagt,
    notes:
      'Die Konkurrenz spricht diese Angst nirgends an. Entweder rein transaktionale Plakate mit Rabatt und Punkten, ohne Geschichte und ohne Emotion. Oder eines von zwei Klischees: der Technik-Erklärbär mit Bürsten, Osmose-Wasser und Preistabellen, oder der Auto-Poser mit Zeitlupen-Schaum auf dem schwarzen AMG und Trap-Beats.',
  },
  {
    id: 'humor',
    label: 'Marketingstrategie: Humor',
    Component: MHumor,
    notes:
      'Unser Marketing baut auf einem Grundpfeiler auf: Humor. In jedem Witz steckt ein bisschen Wahrheit. Ängste verpackt man am besten in Sketche: Man lacht, erkennt sich wieder, und OSCAR bleibt im Kopf. Jede der drei Ängste bekommt ihren Sketch.',
  },
  {
    id: 'markenauftritt',
    label: 'Markenauftritt: Video, Foto, Web',
    Component: MMarkenauftritt,
    notes:
      'Die Sketche holen die Aufmerksamkeit, die Marke braucht auch den Rest. Für den Markenauftritt produzieren wir Video- und Fotocontent: Imagefilm, Anlage, Team, Standorte. Und wir bauen den Webauftritt, auf dem alles zusammenkommt. Alles aus einer Hand, alles in einer Linie.',
  },
  {
    id: 'schema',
    label: 'Das Schema hinter den Geschichten',
    Component: MStrategie,
    notes:
      'Alle drei Geschichten folgen demselben Schema, gebaut wie ein Film. Sie beginnen bei einer Grundangst und bauen mit Humor Spannung auf. Dann kommt OSCAR ins Bild, mal als Held, mal als Helfer oder Insider, und löst die Spannung. Am Ende steht die Erleichterung, und die bleibt im Kopf.',
  },
  {
    id: 'funnel',
    label: 'Der Marketing-Funnel',
    Component: MFunnel,
    notes:
      'Jeder Inhalt hat eine Aufgabe. Oben, im ToFu, holen humorvolle Videos und Sketche Reichweite und Aufmerksamkeit. In der Mitte, im MoFu, geben Tipps und Tricks Mehrwert, zum Beispiel richtig saugen. Unten, im BoFu, zeigt cleaner Content die Waschanlage selbst: Er stärkt das Markenimage und baut Vertrauen auf, bis zum Abo.',
  },
  {
    id: 'video-konzepte',
    label: 'Drei Story-Konzepte für alle Standorte',
    Component: MVideoKonzepte,
    notes:
      'Unser Ansatz gilt für alle Standorte. Wir haben drei Geschichten gebaut, die alle demselben Schema folgen. Wir verkaufen 3 Minuten Lebens-Kontrolle und Ruhe, so lange dauert ein Waschgang: von der Strategie über das Wallet-Abo zu Humor-Videos. Ob Date-Rettung, 3 Minuten Pause im Schaum oder der Samichlaus, der sich auf seiner Tour selbst die Weihnachts-Aktion krallt: Das Abo im Wallet ist immer der Held.',
  },
  {
    id: 'skripts',
    label: 'Skripts, kurz gefasst',
    Component: MSkripts,
    notes:
      'Drei Skripts in der Kurzfassung, oben umschalten. Erstens das Date in letzter Sekunde, die Last-Minute-Rettung. Zweitens das günstigste Spa der Zentralschweiz, die kleine Auszeit im Schaum. Drittens die Weihnachts-Auszeit mit dem Samichlaus und der Geschenkkarte.',
  },
  {
    id: 'short-long',
    label: 'Übergang: Short Form, Long Form',
    Component: MShortLong,
    notes:
      'Bis hier Short Form: Sketche von 15 bis 60 Sekunden, zwei pro Woche, sie holen Aufmerksamkeit. Ab hier Long Form: der Imagefilm. Er verkauft nicht direkt, er baut Vertrauen auf. Wer OSCAR eine ganze Geschichte lang zuschaut, glaubt der Marke, und wer der Marke glaubt, löst das Abo.',
  },
  {
    id: 'hero-aelpler',
    label: 'Hero Content: Der Älpler',
    Component: () => <MHeroFilm idee="aelpler" />,
    notes:
      'Neben den Sketchen braucht es Hero Content, einen Imagefilm. Idee eins, der Älpler: Ein Auto fährt durch eine epische, dreckige Alpenlandschaft und wird immer schmutziger. Auf einem Hof warten zwei OSCAR-Mitarbeiter in Älpler-Tracht und waschen es mit Holzeimer, altem Lappen und Naturschwamm, mit grösster Hingabe. Humorvoll, heimatverbunden, ein unerwarteter Kontrast. Rechts die Slogan-Optionen, wir können live wählen.',
  },
  {
    id: 'hero-ursprung',
    label: 'Hero Content: Der Ursprung',
    Component: () => <MHeroFilm idee="ursprung" />,
    notes:
      'Idee zwei, der Ursprung: eine emotionale Zeitreise. Der kleine Oscar ist schon als Kind fasziniert vom Autowaschen und baut eine winzige Waschstrasse für seine Spielzeugautos. Harter Schnitt in die Gegenwart: Der erwachsene Oscar steht vor der riesigen, modernen Anlage. Dieselbe Hingabe, nur etwas grösser. Emotional, inspirierend, Storytelling mit Herz.',
  },
  {
    id: 'drehplan',
    label: 'Shorts Drehplan',
    Component: MDrehplan,
    notes:
      'Pro Konzept ein Drehtag, an einem Drehtag entstehen zwei bis vier Videos. Wir posten zwei Videos pro Woche plus ein paar Posts. Drei Drehtage ergeben also Stoff für drei bis sechs Wochen. Hochwertig, aber handmade: keine aalglatte Fernsehwerbung auf Social Media.',
  },
  {
    id: 'angebot',
    label: 'Das Angebot: Content-Abo',
    Component: MAngebot,
    notes:
      'Unser Angebot ist ein Content-Abo, so wie Ihr Wasch-Abo: eine monatliche Zahlung für eine feste Content-Lieferung, rund zwei Videos pro Woche plus ein paar Posts. Partnerschaftlich und massgeschneidert auf OSCAR. Je nach Umfang zwischen 3’000 und 7’000 Franken im Monat.',
  },
  {
    id: 'vision',
    label: 'Das liefern wir',
    Component: MVision,
    notes:
      'Das liefern wir: Customer Experience in allen Aspekten mitgedacht. Die UX-Massnahmen dazu sind die OSCAR Carwash App und ein Dashboard für die ganze Customer Journey. Die Wechselwirkung: Der Auftritt, App, Website, Dashboard, zeigt Seriosität. Die Videos sind nahbar und zeigen Oscar authentisch und persönlich. Das eine macht die Videos glaubwürdig, das andere macht die Marke nahbar.',
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
    Component: MSlogan,
    notes: 'Zum Schluss noch einmal die Linie: Make Carwash Sexy again.',
  },
  {
    id: 'ende',
    label: 'Let’s create something.',
    Component: MEnde,
    notes: 'Let’s create something. Fragen, oder legen wir den Workshop gleich fest?',
  },
  {
    id: 'loesung',
    label: 'Die Lösung',
    Component: MSolution,
    appendix: true,
    notes:
      'Unsere Antwort: Wir verkaufen keine einzelnen Posts, sondern vier Methoden, die als fertiges Produkt bei OSCAR ankommen. Jede schaut von einer anderen Seite auf die Angst. Ein Klick auf eine Karte erklärt die Methode: was sie ist, in drei Schritten, wie wir sie für OSCAR einsetzen, und welches Produkt dabei herauskommt.',
  },
  {
    id: 'so-gehts',
    label: 'So funktioniert es',
    Component: S10Rhythmus,
    appendix: true,
    notes:
      'Jeder Monat läuft gleich: Skripte, Dreh, Schnitt, Publizieren mit Report. Aus dem Dreh entstehen Versionen für alle Kanäle, von Instagram bis zur Abo-Seite. Für Sie heisst das: zwei bis drei Tage im Betrieb, um Videos zu produzieren, und zwei Freigaben pro Monat. Den Rest machen wir.',
  },
  {
    id: 'experts',
    label: 'Cyrill Wipfli: digitale Inhalte',
    Component: MExperts,
    appendix: true,
    notes:
      'Hier zählt mein Einsatz: Cyrill Wipfli, Experte für digitale Inhalte. Das Mockup zeigt die Abo-Seite von OSCAR Unlimited auf dem Handy: das Bezahlen, mit dem Jahresabo zuoberst und zwei Monaten geschenkt.',
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
