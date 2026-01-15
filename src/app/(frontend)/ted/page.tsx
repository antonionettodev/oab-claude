import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TedHeroSection } from '@/components/ted/hero'
import { TedTabs } from '@/components/ted/tabs'
import type { Composition, TedMember } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TED | OAB/SC',
  description: 'Tribunal de Ética e Disciplina da OAB/SC. Conheça o TED e sua composição.',
}

export default async function TedPage() {
  const compositions = await queryCompositions()
  const allMembers = await queryTedMembers()
  const membersByComposition: Record<number, TedMember[]> = {}

  // Organizar membros por composição
  allMembers.forEach((member) => {
    const compositionId =
      typeof member.composition === 'object' && member.composition
        ? member.composition.id
        : typeof member.composition === 'number'
          ? member.composition
          : null

    if (compositionId) {
      if (!membersByComposition[compositionId]) {
        membersByComposition[compositionId] = []
      }
      membersByComposition[compositionId].push(member)
    }
  })

  return (
    <main>
      <TedHeroSection />

      <TedTabs compositions={compositions} membersByComposition={membersByComposition} />
    </main>
  )
}

const queryCompositions = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'composition',
    limit: 100,
    depth: 0,
    pagination: false,
    sort: 'createdAt',
  })

  return result.docs as Composition[]
})

const queryTedMembers = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'ted-members',
    limit: 1000,
    depth: 1,
    pagination: false,
    sort: 'name',
  })

  return result.docs as TedMember[]
})
