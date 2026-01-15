import type { CalendarTed } from '@/payload-types'
import { CalendarEventCard } from './calendar-event-card'

interface CalendarListProps {
  events: CalendarTed[]
  selectedYear: string
}

export function CalendarList({ events, selectedYear }: CalendarListProps) {
  // Filtrar eventos por ano se um ano foi selecionado
  const filteredEvents = selectedYear
    ? events.filter((event) => {
        if (!event.date) return false
        const date = new Date(event.date)
        return date.getFullYear() === Number.parseInt(selectedYear, 10)
      })
    : events

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {selectedYear
            ? `Nenhum evento agendado para ${selectedYear}.`
            : 'Nenhum evento agendado no momento.'}
        </p>
      </div>
    )
  }

  // Agrupar eventos por mês/ano
  const eventsByMonth = filteredEvents.reduce(
    (acc, event) => {
      if (!event.date) return acc

      const date = new Date(event.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          events: [],
        }
      }

      acc[monthKey].events.push(event)
      return acc
    },
    {} as Record<string, { label: string; events: CalendarTed[] }>,
  )

  // Ordenar meses
  const sortedMonths = Object.keys(eventsByMonth).sort()

  return (
    <div className="space-y-8">
      {sortedMonths.map((monthKey) => {
        const { label, events: monthEvents } = eventsByMonth[monthKey]
        return (
          <div key={monthKey}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{label}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monthEvents.map((event) => (
                <CalendarEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
