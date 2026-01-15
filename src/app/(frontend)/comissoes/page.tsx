import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { CommissionsHeroSection } from '@/components/commissions/hero'
import { CommissionsStatsSection } from '@/components/commissions/stats'
import { CommissionsFiltersSection } from '@/components/commissions/filters'
import { CommissionsGridSection } from '@/components/commissions/grid'

import type { Commission, CommissionArea } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Comissões | OAB/SC',
  description: 'Acesso completo a todas as comissões temáticas da OAB Santa Catarina.',
}

interface CommissionsPageProps {
  searchParams: Promise<{
    search?: string
    area?: string
    page?: string
  }>
}

export default async function CommissionsPage({ searchParams }: CommissionsPageProps) {
  const { search = '', area = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)

  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = []

  if (search) {
    whereConditions.push({
      or: [{ title: { contains: search } }, { about: { contains: search } }],
    })
  }

  if (area) {
    whereConditions.push({
      area: { equals: area },
    })
  }

  const commissionsResult = await payload.find({
    collection: 'commissions',
    limit: 9,
    page: currentPage,
    sort: 'title',
    depth: 1,
    ...(whereConditions.length > 0
      ? {
          where: {
            and: whereConditions,
          },
        }
      : {}),
  })

  const areasResult = await payload.find({
    collection: 'commission-areas',
    limit: 100,
    sort: 'title',
  })

  const totalCommissions = await payload.count({
    collection: 'commissions',
  })

  const totalMembers = await payload.count({
    collection: 'commission-members',
  })

  return (
    <main>
      <CommissionsHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <CommissionsStatsSection
            totalCommissions={totalCommissions.totalDocs}
            totalMembers={totalMembers.totalDocs}
            totalAreas={areasResult.totalDocs}
          />

          <CommissionsFiltersSection
            areas={areasResult.docs as CommissionArea[]}
            currentSearch={search}
            currentArea={area}
          />

          <CommissionsGridSection
            commissions={commissionsResult.docs as Commission[]}
            totalDocs={commissionsResult.totalDocs}
            totalPages={commissionsResult.totalPages}
            currentPage={currentPage}
            hasNextPage={commissionsResult.hasNextPage}
            hasPrevPage={commissionsResult.hasPrevPage}
          />
        </div>
      </div>
    </main>
  )
}
