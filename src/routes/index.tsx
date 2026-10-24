import { createFileRoute } from '@tanstack/react-router'
import { DeckOverview } from '#/components/deck/DeckOverview'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <DeckOverview />
}
