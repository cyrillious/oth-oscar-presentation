import { Slide } from './Slide'

export type MTeamProps = {
  chrome?: boolean
}

const TEAM = [
  { name: 'Timo Haas', role: 'Administration, Foto- & Videograf-Assistenz', photo: '/images/team/timo-haas.webp' },
  { name: 'Severin Leuzinger', role: 'Co-Founder, Producer', photo: '/images/team/severin-leuzinger.webp' },
  { name: 'Janick Brändli', role: 'Founder, Director of Visuals', photo: '/images/team/janick-braendli.webp' },
  { name: 'Cyrill Wipfli', role: 'Design Engineer, Agentic Expert', photo: '/images/team/cyrill-wipfli.webp', zoom: 1.4 },
]

/** The last portrait (support) is set off from the core team by a hairline in the gap. Four equal portraits span the full 12 columns (left margin to right margin) and fill the full height of the slide. */
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
      <div className="group/team grid min-h-0 flex-1 grid-cols-4 gap-x-5">
        {TEAM.map((m, i) => (
          <Portrait key={m.name} {...m} support={i === TEAM.length - 1} />
        ))}
      </div>
    </Slide>
  )
}

function Portrait({ name, role, photo, support, zoom }: { name: string; role: string; photo: string; support: boolean; zoom?: number }) {
  return (
    <figure className={`group/card relative flex min-h-0 flex-col ${support ? 'before:absolute before:inset-y-0 before:-left-[10px] before:w-px before:bg-ink/30' : ''} transition-[opacity,filter,scale] duration-500 ease-frame motion-safe:group-has-[figure:hover]/team:not-hover:scale-[0.97] group-has-[figure:hover]/team:not-hover:opacity-55 group-has-[figure:hover]/team:not-hover:grayscale`}>
      <div className="min-h-0 flex-1 overflow-hidden bg-stone">
        {/* Portraits are 2:3, outpainted with Higgsfield (FLUX.2 Pro Outpaint) so every head has ~11% headroom. Top-anchored: zoom grows downward, heads never get clipped. */}
        {/* zoom: static enlargement from the top edge, so a full-length photo is cropped at the hips like the others. */}
        <div className="size-full origin-top" style={zoom ? { scale: zoom } : undefined}>
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
