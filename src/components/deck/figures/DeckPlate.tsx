import type { ReactNode } from 'react'
import './deck-iso.css'

/**
 * Anatomy card for the method slides: fills the white illustration panel of `MethodLayout`.
 * Corners as in the kit's Plate: «Fig» top left, title top right, hint bottom left, live readout bottom right.
 * Live code writes the readout through `useReadout()` (it finds `.iso-plate [data-readout]`).
 */
export function DeckPlate({
  fig,
  title,
  hint,
  readout,
  children,
}: {
  fig: string
  title?: string
  hint?: string
  /** Resting readout, rendered on the server so it is right before hydration. */
  readout: string
  children: ReactNode
}) {
  return (
    <div className="iso deck-iso absolute inset-0" data-theme="light">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">
            {fig}
          </span>
          {title ? (
            <span className="iso-plate-corner" data-corner="title">
              {title}
            </span>
          ) : null}
          {hint ? (
            <span className="iso-plate-corner" data-corner="hint">
              {hint}
            </span>
          ) : null}
          <span className="iso-plate-corner" data-corner="readout" data-readout="">
            {readout}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
