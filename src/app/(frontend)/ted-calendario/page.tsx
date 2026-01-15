import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TedCalendarHeroSection } from '@/components/ted-calendar/hero'
import { TedCalendarFilters } from '@/components/ted-calendar/filters'
import { CalendarList } from '@/components/ted-calendar/calendar-list'
import type { CalendarTed } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Calendário - TED | OAB/SC',
  description: 'Calendário de sessões do Tribunal de Ética e Disciplina da OAB/SC',
}

interface TedCalendarioPageProps {
  searchParams: Promise<{
    year?: string
  }>
}

export default async function TedCalendarioPage({ searchParams }: TedCalendarioPageProps) {
  const { year = '' } = await searchParams
  const events = await queryCalendarEvents()
  const availableYears = await getAvailableYears(events)

  // Se não houver ano selecionado, usar o ano atual se existir eventos nesse ano
  const currentYearNum = new Date().getFullYear()
  const hasCurrentYearEvents = availableYears.includes(currentYearNum)
  const defaultYear = hasCurrentYearEvents ? String(currentYearNum) : ''
  const currentYear = year || defaultYear

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <TedCalendarHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <TedCalendarFilters currentYear={currentYear} availableYears={availableYears} />
          <CalendarList events={events} selectedYear={currentYear} />
        </div>
      </div>
    </main>
  )
}

const queryCalendarEvents = cache(async (): Promise<CalendarTed[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'calendar-ted',
    limit: 1000,
    depth: 0,
    sort: 'date',
    pagination: false,
  })

  return result.docs as CalendarTed[]
})

function getAvailableYears(events: CalendarTed[]): number[] {
  const years = new Set<number>()

  events.forEach((event) => {
    if (event.date) {
      const date = new Date(event.date)
      years.add(date.getFullYear())
    }
  })

  return Array.from(years).sort((a, b) => b - a)
}
