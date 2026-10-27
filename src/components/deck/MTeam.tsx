import { Slide } from './Slide'

export type MTeamProps = {
  chrome?: boolean
}

/**
 * zoom / lift bring the three heads to the same size and height (Janick is the reference: head top at 12 %,
 * eyes at 26 % and chin at 40 % of the photo). zoom scales from the top edge, lift then moves the photo up by
 * that share of its own height — measured on the gridded contact sheet, not guessed.
 */
const TEAM = [
  { name: 'Severin Leuzinger', role: 'Co-Founder, Producer', photo: '/images/team/severin-leuzinger.webp', zoom: 1.38, lift: 13 },
  { name: 'Janick Brändli', role: 'Founder, Director of Visuals', photo: '/images/team/janick-braendli.webp' },
  { name: 'Cyrill Wipfli', role: 'Design Engineer, Agentic Expert', photo: '/images/team/cyrill-wipfli.webp', zoom: 1.5, lift: 1.5 },
]

/** The last portrait (support) is set off from the core team by a hairline in the gap. Three equal portraits span the full 12 columns (left margin to right margin) and fill the full height of the slide. */
export function MTeam({ chrome = true }: MTeamProps) {
  return (
    <Slide
      n={11}
      kicker="Team"
      title="Ein kleines Team, das alles selbst macht."
      lead="Mit eigenem Studio in Rotkreuz direkt vor Ort. Breit genug für Konzept, Fotografie, Film und Produktion."
      chrome={chrome}
    >
      {/* Hover one portrait: the photo zooms in slowly, the others step back (dim + desaturate + shrink). */}
      <div className="group/team grid min-h-0 flex-1 grid-cols-3 gap-x-5">
        {TEAM.map((m, i) => (
          <Portrait key={m.name} {...m} support={i === TEAM.length - 1} />
        ))}
      </div>
    </Slide>
  )
}

function Portrait({ name, role, photo, support, zoom = 1, lift = 0 }: { name: string; role: string; photo: string; support: boolean; zoom?: number; lift?: number }) {
  return (
    <figure className={`group/card relative flex min-h-0 flex-col ${support ? 'before:absolute before:inset-y-0 before:-left-[10px] before:w-px before:bg-ink/30' : ''} transition-[opacity,filter,scale] duration-500 ease-frame motion-safe:group-has-[figure:hover]/team:not-hover:scale-[0.97] group-has-[figure:hover]/team:not-hover:opacity-55 group-has-[figure:hover]/team:not-hover:grayscale`}>
      <div className="min-h-0 flex-1 overflow-hidden bg-stone">
        {/* Portraits are 2:3, outpainted with Higgsfield (FLUX.2 Pro Outpaint) so every head has ~11% headroom. Top-anchored: zoom grows downward, heads never get clipped. */}
        {/* The wrapper keeps the photo's 2:3 box (the column crops it at the bottom), so zoom and lift are shares of the photo itself: zoom enlarges from the top edge, lift moves it up. */}
        <div className="aspect-[2/3] w-full origin-top" style={{ scale: zoom, translate: `0 ${-lift}%` }}>
          <img
            src={photo}
            alt={name}
            className="size-full origin-top object-cover object-top transition-transform duration-700 ease-frame motion-safe:group-hover/card:scale-[1.05]"
          />
        </div>
      </div>
      <figcaption className="mt-[12px] shrink-0">
        <p className="text-body text-ink">{name}</p>
        <p className="mt-[2px] min-h-[2.6em] text-pretty text-body text-mute">{role}</p>
      </figcaption>
    </figure>
  )
}
