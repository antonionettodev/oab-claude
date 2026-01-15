import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Monitor, Video, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Event, Commission, File } from '@/payload-types'

interface EventDetailCardProps {
  event: Event
}

const modalityConfig = {
  'in-person': {
    icon: MapPin,
    label: 'Presencial',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  virtual: {
    icon: Monitor,
    label: 'Online',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  hybrid: {
    icon: Video,
    label: 'Híbrido',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
}

const statusConfig = {
  active: {
    label: 'Inscrições abertas',
    color: 'bg-green-500 dark:bg-green-600',
    textColor: 'text-white',
  },
  closed: {
    label: 'Encerrado',
    color: 'bg-gray-400 dark:bg-gray-600',
    textColor: 'text-white',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-500 dark:bg-red-600',
    textColor: 'text-white',
  },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function EventDetailCard({ event }: EventDetailCardProps) {
  const modalityInfo = modalityConfig[event.modality] || modalityConfig['in-person']
  const ModalityIcon = modalityInfo.icon
  const statusInfo = statusConfig[event.status] || statusConfig.active
  const commission = event.commission as Commission | undefined
  const featuredImage = event.featuredImage as File | undefined

  return (
    <div className="group bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header com imagem */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#0084ff]/5 via-[#0070e0]/5 to-[#E85D75]/5 dark:from-[#3B82F6]/10 dark:via-[#60A5FA]/10 dark:to-[#F472B6]/10">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url || '/placeholder.svg'}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge - Canto superior esquerdo */}
        <div className="absolute top-3 left-3">
          <Badge className={`${statusInfo.color} ${statusInfo.textColor} border-0 shadow-lg`}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Modalidade Badge - Canto superior direito */}
        <div className="absolute top-3 right-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${modalityInfo.bg} backdrop-blur-sm border border-white/20`}
          >
            <ModalityIcon className={`w-3.5 h-3.5 ${modalityInfo.color}`} />
            <span className={`text-xs font-semibold ${modalityInfo.color}`}>
              {modalityInfo.label}
            </span>
          </div>
        </div>

        {/* Data e Hora - Canto inferior */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDate(event.startDate)}</span>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{event.startTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        {/* Comissão */}
        {commission && (
          <div className="mb-2">
            <span className="text-xs font-medium text-[#0066cc] dark:text-[#60A5FA] uppercase tracking-wide">
              {commission.title}
            </span>
          </div>
        )}

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-[#F8FAFC] mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#0066cc] dark:group-hover:text-[#60A5FA] transition-colors leading-tight">
          {event.title}
        </h3>

        {/* Local (se presencial ou híbrido) */}
        {(event.modality === 'in-person' || event.modality === 'hybrid') && event.venue && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#94A3B8] mb-auto">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-2" />

        {/* CTA */}
        <div className="mt-3">
          {event.status === 'active' ? (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#0084ff] to-[#0070e0] dark:from-[#3B82F6] dark:to-[#2563EB] text-white hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-[#3B82F6]/30 transition-all font-semibold"
            >
              <Link href={`/eventos/${event.slug || event.id}`}>Inscrever-se agora</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="w-full border-gray-300 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#334155] font-semibold bg-transparent"
            >
              <Link href={`/eventos/${event.slug || event.id}`}>Ver detalhes</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
