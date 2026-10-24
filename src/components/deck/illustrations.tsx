// Concept illustrations for the method slides.
// One style: ink line (3px, round), paper and light grey surfaces, signal red as the single accent.
// Colours come from the oth.view tokens (styles.css), so the drawings follow the deck palette.

const INK = 'var(--color-ink)'
const RED = 'var(--color-signal)'
const PAPER = 'var(--color-paper)'
const MUTE = 'var(--color-mute)'
/** Car windows. */
const GREY = 'var(--color-hairline)'
/** Dirt, dashed guides, far-off dots: mute, lighter. */
const MID = 'color-mix(in srgb, var(--color-mute) 55%, var(--color-paper))'
/** Quiet fill that stays visible on paper and on a stone panel (ink at 6%). */
const SOFT = 'color-mix(in srgb, var(--color-ink) 6%, transparent)'

type IlluProps = { className?: string }

const line = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Side view of a compact car, 260 × 100 in local units, wheels resting on y = 98. */
function Car({ x = 0, y = 0, s = 1, r = 0, body = PAPER, glass = GREY }: { x?: number; y?: number; s?: number; r?: number; body?: string; glass?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r} 130 60) scale(${s})`}>
      <path
        d="M14 70 C14 56 22 50 36 48 L74 44 C92 22 108 16 130 16 L160 16 C182 16 196 26 210 44 L226 48 C238 51 244 58 244 68 L244 74 C244 78 241 80 237 80 L20 80 C16 80 14 78 14 74 Z"
        fill={body}
        {...line}
      />
      <path d="M88 44 C99 30 110 24 128 24 L136 24 L136 44 Z" fill={glass} {...line} strokeWidth={2.5} />
      <path d="M146 24 L158 24 C174 24 186 30 197 44 L146 44 Z" fill={glass} {...line} strokeWidth={2.5} />
      <circle cx="66" cy="80" r="18" fill={INK} />
      <circle cx="66" cy="80" r="7" fill={PAPER} />
      <circle cx="194" cy="80" r="18" fill={INK} />
      <circle cx="194" cy="80" r="7" fill={PAPER} />
    </g>
  )
}

function Shadow({ cx, cy, rx = 110, ry = 8 }: { cx: number; cy: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={INK} opacity={0.06} />
}

/** Weirding the Normal: a row of identical cars, one breaks the pattern. */
export function IlluWeird({ className = '' }: IlluProps) {
  const cols = [40, 270, 500]
  const rows = [80, 280]
  return (
    <svg viewBox="0 0 760 460" className={className} aria-hidden="true">
      {rows.map((ry, ri) =>
        cols.map((cx, ci) => {
          const odd = ri === 0 && ci === 2
          return (
            <g key={`${ri}-${ci}`}>
              <Shadow cx={cx + 108} cy={ry + 86} rx={odd ? 70 : 96} ry={odd ? 6 : 8} />
              {odd ? (
                <>
                  <Car x={cx} y={ry - 44} s={0.84} r={-14} body={RED} glass="color-mix(in srgb, var(--color-signal) 15%, var(--color-paper))" />
                  <path d={`M${cx - 6} ${ry + 30} q-18 -10 -14 -34`} fill="none" {...line} strokeWidth={2.5} />
                  <path d={`M${cx - 26} ${ry + 46} q-20 -8 -20 -30`} fill="none" {...line} strokeWidth={2.5} opacity={0.4} />
                  <path d={`M${cx + 200} ${ry - 70} l10 -22 M${cx + 222} ${ry - 58} l20 -12 M${cx + 228} ${ry - 32} l22 2`} fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" />
                </>
              ) : (
                <Car x={cx} y={ry} s={0.84} />
              )}
            </g>
          )
        }),
      )}
    </svg>
  )
}

/** Only Is Better Than Best: near-equal bars all claiming «best», one shape on its own. */
export function IlluOnly({ className = '' }: IlluProps) {
  const bars = [214, 228, 220, 236]
  return (
    <svg viewBox="0 0 760 460" className={className} aria-hidden="true">
      <line x1="40" y1="380" x2="400" y2="380" {...line} />
      {bars.map((h, i) => (
        <g key={i}>
          <rect x={64 + i * 84} y={380 - h} width="58" height={h} rx="14" fill={i % 2 ? SOFT : PAPER} {...line} />
          <text x={93 + i * 84} y={380 - h - 20} textAnchor="middle" fontSize="20" fill={MUTE} fontFamily="inherit">
            Beste
          </text>
        </g>
      ))}
      <line x1="470" y1="70" x2="470" y2="400" stroke={MID} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />
      <Shadow cx={615} cy={384} rx={92} ry={9} />
      <path d="M545 380 L685 380 L668 330 L562 330 Z" fill={PAPER} {...line} />
      <circle cx="615" cy="232" r="88" fill={RED} />
      <circle cx="615" cy="232" r="88" fill="none" {...line} />
      <path d="M582 232 l22 22 l44 -48" fill="none" stroke={PAPER} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The True Competitor: not the next car wash, but the bucket at home and the dirty car. */
export function IlluCompetitor({ className = '' }: IlluProps) {
  return (
    <svg viewBox="0 0 760 460" className={className} aria-hidden="true">
      <Shadow cx={250} cy={378} rx={150} ry={10} />
      <Car x={100} y={240} s={1.12} />
      {[
        [150, 312, 16],
        [186, 320, 10],
        [238, 316, 13],
        [300, 322, 9],
        [330, 310, 14],
        [356, 318, 8],
        [214, 300, 7],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={MID} opacity={0.85} />
      ))}
      <path d="M160 214 q8 -14 0 -26 M196 206 q8 -14 0 -26" fill="none" stroke={MID} strokeWidth={3} strokeLinecap="round" />

      <Shadow cx={580} cy={384} rx={92} ry={9} />
      <path d="M512 248 C512 196 648 196 648 248" fill="none" {...line} />
      <path d="M500 256 L660 256 L640 380 L520 380 Z" fill={PAPER} {...line} />
      <ellipse cx="580" cy="256" rx="80" ry="12" fill={SOFT} {...line} />
      {[
        [548, 236, 13],
        [572, 226, 17],
        [602, 234, 12],
        [622, 244, 9],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={PAPER} {...line} strokeWidth={2.5} />
      ))}
      <g transform="rotate(-16 650 214)">
        <rect x="614" y="186" width="96" height="58" rx="18" fill={RED} />
        <rect x="614" y="186" width="96" height="58" rx="18" fill="none" {...line} />
        <circle cx="640" cy="206" r="4" fill={PAPER} opacity={0.7} />
        <circle cx="664" cy="222" r="4" fill={PAPER} opacity={0.7} />
        <circle cx="688" cy="204" r="4" fill={PAPER} opacity={0.7} />
      </g>
      <rect x="440" y="80" width="92" height="96" rx="16" fill={PAPER} {...line} />
      <path d="M440 108 L532 108" {...line} />
      <text x="486" y="154" textAnchor="middle" fontSize="34" fill={INK} fontFamily="inherit">Sa</text>
    </svg>
  )
}

/** The Real Product: the wash is the tip, the feeling and the fear sit below the waterline. */
export function IlluIceberg({ className = '' }: IlluProps) {
  return (
    <svg viewBox="0 0 760 500" className={className} aria-hidden="true">
      <rect x="0" y="150" width="760" height="350" rx="28" fill={SOFT} />
      <path d="M210 150 L548 150 L612 250 L586 368 L478 462 L300 470 L190 384 L158 262 Z" fill={PAPER} {...line} />
      <path d="M300 150 L356 58 L392 96 L414 74 L460 150" fill={PAPER} {...line} />
      <line x1="0" y1="150" x2="760" y2="150" stroke={INK} strokeWidth={3} strokeDasharray="14 10" strokeLinecap="round" />
      <text x="476" y="104" fontSize="24" fill={INK} fontFamily="inherit">Wäsche</text>
      {(
        [
          ['Stolz', 250, 228],
          ['Zeit', 430, 228],
          ['Sicherheit', 300, 306],
          ['Kein Risiko', 220, 388],
          ['Ruhe', 446, 388],
        ] as const
      ).map(([t, x, y]) => (
        <g key={t}>
          <circle cx={x} cy={y - 8} r="6" fill={RED} />
          <text x={x + 16} y={y} fontSize="24" fill={INK} fontFamily="inherit">
            {t}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Tofu Mofu Bofu: three funnel stages, a subscription card comes out at the bottom. */
/** `active` (0–2) fills one layer in ink; without it BOFU is the filled one. The one red is the lead dropping in. */
export function IlluFunnel({ className = '', active }: IlluProps & { active?: number }) {
  const hot = active ?? 2
  const fills = [hot === 0 ? INK : PAPER, hot === 1 ? INK : SOFT, hot === 2 ? INK : PAPER]
  const ink = (i: number) => (hot === i ? PAPER : INK)
  const fade = { className: 'motion-safe:transition-[fill] motion-safe:duration-500 motion-safe:ease-frame' }
  return (
    <svg viewBox="0 0 640 560" className={className} aria-hidden="true">
      {[
        [150, 30, 7],
        [230, 18, 6],
        [320, 36, 8],
        [410, 14, 6],
        [480, 32, 7],
        [270, 52, 5],
        [380, 56, 5],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i === 2 ? RED : MID} />
      ))}
      <path d="M80 90 L560 90 L494 210 L146 210 Z" fill={fills[0]} {...fade} {...line} />
      <path d="M146 210 L494 210 L428 330 L212 330 Z" fill={fills[1]} {...fade} {...line} />
      <path d="M212 330 L428 330 L370 430 L270 430 Z" fill={fills[2]} {...fade} />
      <path d="M212 330 L428 330 L370 430 L270 430 Z" fill="none" {...line} />
      <text x="320" y="160" textAnchor="middle" fontSize="30" fill={ink(0)} {...fade} fontFamily="inherit" letterSpacing="2">TOFU</text>
      <text x="320" y="280" textAnchor="middle" fontSize="30" fill={ink(1)} {...fade} fontFamily="inherit" letterSpacing="2">MOFU</text>
      <text x="320" y="392" textAnchor="middle" fontSize="30" fill={ink(2)} {...fade} fontFamily="inherit" letterSpacing="2">BOFU</text>
      <g transform="rotate(-6 320 494)">
        <rect x="262" y="458" width="116" height="72" rx="12" fill={INK} />
        <rect x="276" y="474" width="34" height="24" rx="5" fill={MID} />
        <rect x="276" y="508" width="70" height="6" rx="3" fill={PAPER} opacity={0.5} />
      </g>
    </svg>
  )
}

/** Team & Perspective: a viewfinder framing the car. */
export function IlluView({ className = '' }: IlluProps) {
  const c = (x: number, y: number, dx: number, dy: number) => `M${x} ${y + dy * 46} L${x} ${y} L${x + dx * 46} ${y}`
  return (
    <svg viewBox="0 0 760 460" className={className} aria-hidden="true">
      <path d={[c(60, 50, 1, 1), c(700, 50, -1, 1), c(60, 410, 1, -1), c(700, 410, -1, -1)].join(' ')} fill="none" {...line} strokeWidth={4} />
      <circle cx="104" cy="94" r="10" fill={RED} />
      <text x="124" y="102" fontSize="22" fill={INK} fontFamily="inherit" letterSpacing="1">REC</text>
      <text x="656" y="102" textAnchor="end" fontSize="22" fill={MUTE} fontFamily="inherit">9:16</text>
      <Shadow cx={380} cy={330} rx={160} ry={11} />
      <Car x={210} y={176} s={1.3} />
      <text x="380" y="392" textAnchor="middle" fontSize="22" fill={MUTE} fontFamily="inherit">oth.view</text>
    </svg>
  )
}

export const ILLUSTRATIONS = {
  weird: IlluWeird,
  only: IlluOnly,
  competitor: IlluCompetitor,
  iceberg: IlluIceberg,
  funnel: IlluFunnel,
  view: IlluView,
} as const

export type IllustrationKey = keyof typeof ILLUSTRATIONS

/** All illustrations on one sheet, for review on the canvas. */
export function IllustrationSheet({ show = 'alle' }: { show?: IllustrationKey | 'alle' }) {
  const keys = (show === 'alle' ? Object.keys(ILLUSTRATIONS) : [show]) as IllustrationKey[]
  return (
    <div className={`grid gap-5 bg-paper p-8 ${keys.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {keys.map((k) => {
        const Illu = ILLUSTRATIONS[k]
        return (
          <figure key={k} className="rounded-[12px] bg-stone p-8">
            <Illu className="mx-auto max-h-[420px] w-full" />
            <figcaption className="mt-4 text-body text-mute">{k}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
