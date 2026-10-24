import { createFileRoute } from '@tanstack/react-router'
import { DeckPresenter } from '#/components/deck/DeckPresenter'

export const Route = createFileRoute('/praesentieren')({
  head: () => ({ meta: [{ title: 'Präsentieren · OSCAR Social Media Pitch' }] }),
  component: PresentPage,
})

function PresentPage() {
  return <DeckPresenter />
}
