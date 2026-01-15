import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import { LegislationsHeroSection } from '@/components/legislations/hero'
import { LegislationsFilters } from '@/components/legislations/filters'
import { LegislationDownloadList } from '@/components/legislations/download-list'
import type { Legislation, LegislationsType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Legislações | OAB/SC',
  description:
    'Consulte e baixe as legislações, códigos, resoluções e demais documentos normativos da OAB/SC',
}

interface LegislacoesPageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    page?: string
  }>
}

export default async function LegislacoesPage({ searchParams }: LegislacoesPageProps) {
  const { search = '', type = '' } = await searchParams
  const allLegislations = await queryLegislations({ search, type })
  const types = await getLegislationTypes()

  return (
    <main className="bg-gray-50">
      <LegislationsHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <LegislationsFilters currentSearch={search} currentType={type} types={types} />
          <LegislationDownloadList legislations={allLegislations} />
        </div>
      </div>
    </main>
  )
}

const getLegislationTypes = cache(async (): Promise<LegislationsType[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'legislations-types',
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  return result.docs as LegislationsType[]
})

const queryLegislations = cache(
  async ({ search, type }: { search: string; type: string }): Promise<Legislation[]> => {
    const payload = await getPayload({ config: configPromise })

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push({
        title: { contains: search },
      })
    }

    if (type) {
      whereConditions.push({
        type: { equals: type },
      })
    }

    const queryOptions: any = {
      collection: 'legislations',
      limit: 1000,
      depth: 2,
      sort: '-createdAt',
      pagination: false,
    }

    if (whereConditions.length > 0) {
      queryOptions.where = {
        and: whereConditions,
      }
    }

    const result = await payload.find(queryOptions)

    return result.docs as Legislation[]
  },
)
