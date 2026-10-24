import { createFileRoute } from '@tanstack/react-router'
import { Redeplan } from '#/components/redeplan/Redeplan'

export const Route = createFileRoute('/redeplan')({
  head: () => ({ meta: [{ title: 'Redeplan · OSCAR Social Media Pitch' }] }),
  component: RedeplanPage,
})

function RedeplanPage() {
  return <Redeplan />
}
