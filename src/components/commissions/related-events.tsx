import { Calendar } from 'lucide-react'
import { EventDetailCard } from '@/components/events/detail-card'
import type { Event } from '@/payload-types'

type Props = {
  events: Event[]
  commissionTitle: string
}

export function CommissionRelatedEvents({ events, commissionTitle }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhum evento encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ainda não há eventos ativos para a {commissionTitle}.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Eventos da Comissão
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventDetailCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
