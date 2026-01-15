import { Calendar, MapPin } from 'lucide-react'
import type { CalendarTed } from '@/payload-types'

interface CalendarEventCardProps {
  event: CalendarTed
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  if (!event.date) return null

  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const day = date.getDate()
  const month = date.toLocaleDateString('pt-BR', { month: 'short' })

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-lg p-3 min-w-[60px]">
          <span className="text-2xl font-bold">{day}</span>
          <span className="text-xs uppercase">{month}</span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {event.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>

            {event.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{event.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
