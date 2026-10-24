import { createFileRoute } from '@tanstack/react-router'
import { MockupStack } from '#/components/mockups/MockupStack'

export const Route = createFileRoute('/mockups')({
  component: MockupsPage,
})

function MockupsPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper p-[40px]">
      <MockupStack />
    </main>
  )
}
