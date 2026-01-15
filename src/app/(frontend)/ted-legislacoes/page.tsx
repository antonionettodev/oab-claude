import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import { TedLegislationsHeroSection } from '@/components/ted-legislations/hero'
import { TedLegislationsFilters } from '@/components/ted-legislations/filters'
import { TedLegislationDownloadList } from '@/components/ted-legislations/download-list'
import { itemsPerPage } from '@/components/ted-legislations/pagination'
import type { LegislationsTed, LegislationsTedType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Legislações TED | OAB/SC',
  description:
    'Consulte e baixe as legislações, códigos, resoluções e demais documentos normativos do Tribunal de Ética e Disciplina da OAB/SC',
}

interface TedLegislacoesPageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    page?: string
  }>
}

export default async function TedLegislacoesPage({ searchParams }: TedLegislacoesPageProps) {
  const { search = '', type = '' } = await searchParams
  const allLegislations = await queryLegislations({ search, type })
  const types = await getLegislationTypes()

  return (
    <main className="bg-gray-50">
      <TedLegislationsHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <TedLegislationsFilters currentSearch={search} currentType={type} types={types} />
          <TedLegislationDownloadList legislations={allLegislations} />
        </div>
      </div>
    </main>
  )
}

const getLegislationTypes = cache(async (): Promise<LegislationsTedType[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'legislations-ted-types',
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  return result.docs as LegislationsTedType[]
})

const queryLegislations = cache(
  async ({ search, type }: { search: string; type: string }): Promise<LegislationsTed[]> => {
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
      collection: 'legislations-ted',
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

    return result.docs as LegislationsTed[]
  },
)
