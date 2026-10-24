// Source: oth-view src/components/GridLines.tsx (snapshot 2026-10-24). Needs the `frame` utility from theme.css.
// On a slide: <GridLines position="absolute" allLines /> as the first child of the `slide` element.
// `allLines` is the only addition: a scaled 1600px stage must not drop its inner lines on a narrow window.

type GridLinesProps = {
  /** Fixed to the viewport (page overlay), sticky (viewport-high, survives a transformed
   *  parent such as the shrinking page sheet) or absolute inside its parent (slide, canvas preview). */
  position?: 'fixed' | 'sticky' | 'absolute'
  /** Inner lines fade out towards top and bottom, like studioacht.ch. */
  fade?: boolean
  /** Colour of the central axis. */
  axis?: 'signal' | 'ink' | 'none'
  /** Overall line strength. */
  tone?: 'subtle' | 'strong'
  /** Show the inner lines at every viewport width (slides). The website hides them below md. */
  allLines?: boolean
}

const LINE_POSITIONS = [0, 1, 2, 3, 4, 5, 6]

export function GridLines({
  position = 'fixed',
  fade = true,
  axis = 'signal',
  tone = 'subtle',
  allLines = false,
}: GridLinesProps) {
  const alpha = tone === 'strong' ? 0.16 : 0.045
  // Lines take the text colour, so they invert along with a page that turns dark.
  const tint = (a: number) => `color-mix(in srgb, currentColor ${a * 100}%, transparent)`
  const outer = tint(alpha * 0.6)
  const inner = tint(alpha)
  const axisColor =
    axis === 'signal'
      ? `rgba(227, 6, 19, ${tone === 'strong' ? 0.4 : 0.22})`
      : axis === 'ink'
        ? tint(alpha * 1.6)
        : inner

  const paint = (color: string) =>
    fade ? `linear-gradient(180deg, transparent 0%, ${color} 18%, ${color} 82%, transparent 100%)` : color

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none z-0 ${
        position === 'sticky' ? 'sticky top-0 -mb-[100svh] h-svh w-full' : `${position} inset-0`
      }`}
    >
      <div className="frame relative h-full">
        <div className="relative h-full">
          {LINE_POSITIONS.map((i) => {
            const isOuter = i === 0 || i === 6
            const isAxis = i === 3
            return (
              <span
                key={i}
                className={`absolute inset-y-0 w-px ${allLines || isOuter || isAxis ? 'block' : 'hidden md:block'}`}
                style={{
                  left: `calc(${(i / 6) * 100}% - ${i === 6 ? 1 : 0}px)`,
                  background: isOuter ? outer : paint(isAxis ? axisColor : inner),
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
