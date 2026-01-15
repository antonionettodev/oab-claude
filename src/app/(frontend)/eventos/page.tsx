import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { EventsHeroSection } from '@/components/events/hero'
import { EventsFilterPanel } from '@/components/events/filter-panel'
import { EventsGridSection } from '@/components/events/grid'
import { EventCalendar } from '@/components/events/calendar'
import { EventsCarousel } from '@/components/events/carousel'

import type { Event, Commission, Subsection } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Eventos | OAB/SC',
  description: 'Encontre cursos e eventos da OAB Santa Catarina.',
}

interface EventsPageProps {
  searchParams: Promise<{
    search?: string
    type?: string
    modality?: string
    status?: string
    commission?: string
    city?: string
    page?: string
  }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const {
    search = '',
    type = '',
    modality = '',
    status = '',
    commission = '',
    city = '',
    page = '1',
  } = await searchParams

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = []

  if (search) {
    whereConditions.push({
      or: [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } },
      ],
    })
  }

  if (type) {
    whereConditions.push({ type: { equals: type } })
  }

  if (modality) {
    whereConditions.push({ modality: { equals: modality } })
  }

  if (status) {
    whereConditions.push({ status: { equals: status } })
  }

  if (commission) {
    whereConditions.push({ commission: { equals: Number.parseInt(commission, 10) } })
  }

  const eventsResult = await payload.find({
    collection: 'events',
    limit: 9,
    page: currentPage,
    sort: '-startDate',
    depth: 2,
    select: {
      title: true,
      slug: true,
      type: true,
      modality: true,
      startDate: true,
      endDate: true,
      startTime: true,
      endTime: true,
      venue: true,
      description: true,
      status: true,
      featuredImage: true,
      commission: true,
      subsection: true,
      ticketTypes: true,
      hasCertificate: true,
    },
    ...(whereConditions.length > 0 ? { where: { and: whereConditions } } : {}),
  })

  const featuredEventsResult = await payload.find({
    collection: 'events',
    limit: 6,
    sort: '-startDate',
    depth: 2,
    where: {
      status: { equals: 'active' },
    },
  })

  const calendarEventsResult = await payload.find({
    collection: 'events',
    limit: 100,
    sort: 'startDate',
    depth: 1,
    select: {
      title: true,
      slug: true,
      startDate: true,
      status: true,
    },
  })

  const commissionsResult = await payload.find({
    collection: 'commissions',
    limit: 100,
    sort: 'title',
  })

  const subsectionsResult = await payload.find({
    collection: 'subsections',
    limit: 100,
    sort: 'title',
  })

  const currentSearchParams: Record<string, string> = {}
  if (search) currentSearchParams.search = search
  if (type) currentSearchParams.type = type
  if (modality) currentSearchParams.modality = modality
  if (status) currentSearchParams.status = status
  if (commission) currentSearchParams.commission = commission
  if (city) currentSearchParams.city = city

  return (
    <main>
      <EventsHeroSection />

      {featuredEventsResult.docs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Eventos em Destaque
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Confira os próximos eventos com inscrições abertas
            </p>
          </div>
          <EventsCarousel events={featuredEventsResult.docs as Event[]} />
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com filtros e calendário */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <EventsFilterPanel
              commissions={commissionsResult.docs as Commission[]}
              subsections={subsectionsResult.docs as Subsection[]}
              currentModality={modality}
              currentStatus={status}
              currentCommission={commission}
              currentCity={city}
            />

            {/* Calendário */}
            <div className="hidden lg:block">
              <EventCalendar events={calendarEventsResult.docs as Event[]} />
            </div>
          </aside>

          {/* Grid de eventos */}
          <div className="flex-1">
            <EventsGridSection
              events={eventsResult.docs as Event[]}
              totalDocs={eventsResult.totalDocs}
              totalPages={eventsResult.totalPages}
              currentPage={currentPage}
              hasNextPage={eventsResult.hasNextPage}
              hasPrevPage={eventsResult.hasPrevPage}
              searchParams={currentSearchParams}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
