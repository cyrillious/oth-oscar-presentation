// Fig 02 · Only Is Better Than Best. The one model the drawing, the motion and the readout read from.
// Four gauge blocks wrung side by side on a carriage. Three «Beste» blocks differ by tenths of a millimetre;
// OSCAR's block carries a boss the others don't have. A dial indicator reads whatever sits under its plunger.

export type Block = { name: string; height: number; boss: number; oscar: boolean }

/** Heights in mm (1 world unit = 1 mm). */
export const BLOCKS: Block[] = [
  { name: 'Block 1', height: 14.0, boss: 0, oscar: false },
  { name: 'Block 2', height: 14.2, boss: 0, oscar: false },
  { name: 'Block 3', height: 14.1, boss: 0, oscar: false },
  { name: 'OSCAR', height: 14.0, boss: 8, oscar: true },
]

/** The dial is zeroed on block 1. One needle turn is 10 mm, one tick 0.2 mm. */
export const ZERO = BLOCKS[0].height
export const PER_TURN = 10
export const TICKS = 50

export const BLOCK_W = 15
export const BLOCK_D = 26
/** Block i spans local x from FIRST + i·BLOCK_W (wrung together, no gaps). */
export const FIRST = -30
export const centreOf = (index: number) => FIRST + BLOCK_W * index + BLOCK_W / 2

/** Boss on OSCAR's block, in the block's local plan. */
export const BOSS = { inset: 3, d: 14 }

export const DIAL: [number, number] = [0, 0]
export const TIP_R = 2.4

/** Carriage offset that puts block i under the plunger. */
export const STOPS = BLOCKS.map((_, index) => DIAL[0] - centreOf(index))
export const REACH: [number, number] = [STOPS[STOPS.length - 1] - 5, STOPS[0] + 5]

const topOf = (block: Block) => block.height + block.boss

/** Height under the plunger tip (relative to the carriage top) with the carriage at x. */
export function heightUnder(x: number) {
  let top = 0
  BLOCKS.forEach((block, index) => {
    const from = x + FIRST + BLOCK_W * index
    const to = from + BLOCK_W
    if (to > DIAL[0] - TIP_R && from < DIAL[0] + TIP_R) top = Math.max(top, block.height)
    if (block.boss) {
      const bFrom = from + BOSS.inset
      const bTo = to - BOSS.inset
      if (bTo > DIAL[0] - TIP_R && bFrom < DIAL[0] + TIP_R) top = Math.max(top, topOf(block))
    }
  })
  return top
}

/** True when the plunger tip overlaps OSCAR's boss (then the plunger is drawn over it). */
export function onBoss(x: number) {
  const index = BLOCKS.findIndex((block) => block.boss)
  const from = x + FIRST + BLOCK_W * index + BOSS.inset
  const to = from + BLOCK_W - BOSS.inset * 2
  return to > DIAL[0] - TIP_R - 0.5 && from < DIAL[0] + TIP_R + 0.5
}

/** Index of the block whose span holds the plunger axis. */
export function blockUnder(x: number) {
  const local = DIAL[0] - x - FIRST
  return Math.min(BLOCKS.length - 1, Math.max(0, Math.floor(local / BLOCK_W)))
}

const one = (value: number) => (Math.round(value * 10) / 10).toFixed(1)

/** Readout: which block, what the dial reads, and how far that is from block 1. */
export function readoutOf(x: number, reading: number) {
  const block = BLOCKS[blockUnder(x)]
  if (block.oscar) return `OSCAR · ${one(reading)} mm · nur hier`
  const delta = Math.round((reading - ZERO) * 10) / 10
  const sign = delta === 0 ? '±' : delta > 0 ? '+' : '−'
  return `${block.name} · ${one(reading)} mm · ${sign}${one(Math.abs(delta))}`
}

export const RESTING = readoutOf(STOPS[0], BLOCKS[0].height)
