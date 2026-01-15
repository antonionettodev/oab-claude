import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdjudicatingChamberHeroSection } from '@/components/adjudicating-chamber/hero'
import { AdjudicatingChamberTab } from '@/components/adjudicating-chamber/chamber-tab'
import type { AdjudicatingChamber, MembersAdjudicatingChamber } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Câmara Julgadora | OAB/SC',
  description: 'Conheça a composição das Câmaras Julgadoras da OAB/SC.',
}

export default async function CamaraJulgadoraPage() {
  const chambers = await queryChambers()
  const allMembers = await queryChamberMembers()
  const membersByChamber: Record<number, MembersAdjudicatingChamber[]> = {}

  allMembers.forEach((member) => {
    const chamberId =
      typeof member.adjudicatingChamber === 'object' && member.adjudicatingChamber
        ? member.adjudicatingChamber.id
        : typeof member.adjudicatingChamber === 'number'
          ? member.adjudicatingChamber
          : null

    if (chamberId) {
      if (!membersByChamber[chamberId]) {
        membersByChamber[chamberId] = []
      }
      membersByChamber[chamberId].push(member)
    }
  })

  return (
    <main>
      <AdjudicatingChamberHeroSection />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AdjudicatingChamberTab chambers={chambers} membersByChamber={membersByChamber} />
      </div>
    </main>
  )
}

const queryChambers = cache(async (): Promise<AdjudicatingChamber[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'adjudicating-chamber',
    limit: 100,
    depth: 0,
    pagination: false,
    sort: 'title',
  })
  return result.docs as AdjudicatingChamber[]
})

const queryChamberMembers = cache(async (): Promise<MembersAdjudicatingChamber[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'members-adjudicating-chamber',
    limit: 1000,
    depth: 1,
    pagination: false,
    sort: 'title',
  })
  return result.docs as MembersAdjudicatingChamber[]
})
