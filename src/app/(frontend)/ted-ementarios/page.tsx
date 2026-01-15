import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TedCouncilDigestsHeroSection } from '@/components/ted-council-digests/hero'
import { TedCouncilDigestsFilters } from '@/components/ted-council-digests/filters'
import { DigestList } from '@/components/ted-council-digests/digest-list'
import { TedCouncilDigestsPagination } from '@/components/ted-council-digests/pagination'
import type { TedCouncilDigest } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ementários - TED | OAB/SC',
  description: 'Consulte as ementas e acórdãos do Tribunal de Ética e Disciplina da OAB/SC.',
}

interface TedEmentariosPageProps {
  searchParams: Promise<{
    search?: string
    yearStart?: string
    yearEnd?: string
    page?: string
  }>
}

export default async function TedEmentariosPage({ searchParams }: TedEmentariosPageProps) {
  const { search = '', yearStart = '', yearEnd = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)

  const availableYears = await getAvailableYears()
  const digestsResult = await queryDigests({
    search,
    yearStart,
    yearEnd,
    page: currentPage,
  })

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <TedCouncilDigestsHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <TedCouncilDigestsFilters
            currentSearch={search}
            currentYearStart={yearStart}
            currentYearEnd={yearEnd}
            availableYears={availableYears}
          />
          <DigestList digests={digestsResult.docs} searchTerm={search} />
          {digestsResult.totalPages > 1 && (
            <TedCouncilDigestsPagination
              currentPage={currentPage}
              totalPages={digestsResult.totalPages}
              hasNextPage={digestsResult.hasNextPage}
              hasPrevPage={digestsResult.hasPrevPage}
            />
          )}
        </div>
      </div>
    </main>
  )
}

const getAvailableYears = cache(async (): Promise<number[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'ted-council-digests',
    limit: 1000,
    depth: 0,
    pagination: false,
    select: {
      year: true,
    },
  })

  const years = new Set<number>()
  result.docs.forEach((doc) => {
    if (doc.year) {
      years.add(doc.year)
    }
  })

  return Array.from(years).sort((a, b) => b - a)
})

const queryDigests = cache(
  async ({
    search,
    yearStart,
    yearEnd,
    page,
  }: {
    search: string
    yearStart: string
    yearEnd: string
    page: number
  }): Promise<{
    docs: TedCouncilDigest[]
    totalDocs: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }> => {
    const payload = await getPayload({ config: configPromise })

    const whereConditions: any[] = []

    // Busca por texto (processo, acórdão ou informações)
    if (search) {
      whereConditions.push({
        or: [
          {
            processNumber: {
              contains: search,
            },
          },
          {
            acordaoNumber: {
              contains: search,
            },
          },
          {
            information: {
              contains: search,
            },
          },
        ],
      })
    }

    // Filtro por ano
    if (yearStart && yearEnd) {
      whereConditions.push({
        year: {
          greater_than_equal: Number.parseInt(yearStart, 10),
          less_than_equal: Number.parseInt(yearEnd, 10),
        },
      })
    } else if (yearStart) {
      whereConditions.push({
        year: {
          greater_than_equal: Number.parseInt(yearStart, 10),
        },
      })
    } else if (yearEnd) {
      whereConditions.push({
        year: {
          less_than_equal: Number.parseInt(yearEnd, 10),
        },
      })
    }

    const result = await payload.find({
      collection: 'ted-council-digests',
      limit: 3,
      page,
      depth: 0,
      sort: '-year',
      ...(whereConditions.length > 0
        ? {
            where: {
              and: whereConditions,
            },
          }
        : {}),
    })

    return {
      docs: result.docs as TedCouncilDigest[],
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  },
)
