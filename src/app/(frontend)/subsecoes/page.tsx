import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { SubsectionsHeroSection } from '@/components/subsections/hero'
import { SubsectionsStatsSection } from '@/components/subsections/stats'
import { SubsectionsFilters } from '@/components/subsections/filters'
import { SubsectionsGridSection } from '@/components/subsections/grid'

import { Subsection } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Subseções | OAB/SC',
  description:
    'Encontre a OAB mais próxima de você. Presente em 54 cidades para fortalecer a advocacia.',
}

interface SubsectionsPageProps {
  searchParams: Promise<{
    search?: string
    region?: string
    page?: string
  }>
}

export default async function SubsectionsPage({ searchParams }: SubsectionsPageProps) {
  const { search = '', region = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)

  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = []

  if (search) {
    whereConditions.push({
      or: [{ title: { contains: search } }, { city: { contains: search } }],
    })
  }

  if (region) {
    whereConditions.push({
      region: { equals: Number.parseInt(region, 10) },
    })
  }

  const subsectionsResult = await payload.find({
    collection: 'subsections',
    limit: 9,
    page: currentPage,
    sort: 'title',
    depth: 1,
    select: {
      title: true,
      slug: true,
      region: true,
      street: true,
      district: true,
      city: true,
      phone: true,
      email: true,
    },
    ...(whereConditions.length > 0
      ? {
          where: {
            and: whereConditions,
          },
        }
      : {}),
  })

  const regionsResult = await payload.find({
    collection: 'subsection-regions',
    limit: 100,
    sort: 'title',
  })

  const totalSubsections = await payload.count({
    collection: 'subsections',
  })

  return (
    <main>
      <SubsectionsHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <SubsectionsStatsSection
            totalSubsections={totalSubsections.totalDocs}
            totalRegions={regionsResult.totalDocs}
          />

          <SubsectionsFilters
            regions={regionsResult.docs}
            currentSearch={search}
            currentRegion={region}
          />

          <SubsectionsGridSection
            subsections={subsectionsResult.docs as Subsection[]}
            totalDocs={subsectionsResult.totalDocs}
            totalPages={subsectionsResult.totalPages}
            currentPage={currentPage}
            hasNextPage={subsectionsResult.hasNextPage}
            hasPrevPage={subsectionsResult.hasPrevPage}
          />
        </div>
      </div>
    </main>
  )
}
