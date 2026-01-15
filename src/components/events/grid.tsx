import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Monitor, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { EventDetailCard } from './detail-card'
import type { Event, Commission, Subsection, File } from '@/payload-types'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface EventsGridSectionProps {
  events: Event[]
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  searchParams?: Record<string, string>
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getModalityLabel(modality: string) {
  switch (modality) {
    case 'in-person':
      return 'Presencial'
    case 'hybrid':
      return 'Híbrido'
    case 'virtual':
      return 'Virtual'
    default:
      return modality
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Ativo'
    case 'cancelled':
      return 'Cancelado'
    case 'closed':
      return 'Encerrado'
    default:
      return status
  }
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default'
    case 'cancelled':
      return 'destructive'
    case 'closed':
      return 'secondary'
    default:
      return 'outline'
  }
}

function getLowestPrice(ticketTypes: Event['ticketTypes']) {
  if (!ticketTypes || ticketTypes.length === 0) return null

  const prices = ticketTypes.map((t) => t.price).filter((p) => p !== undefined && p !== null)
  if (prices.length === 0) return null

  const lowest = Math.min(...(prices as number[]))
  return lowest === 0 ? 'Gratuito' : `A partir de R$ ${lowest.toFixed(2)}`
}

function EventCard({ event }: { event: Event }) {
  const commission = event.commission as Commission | undefined
  const subsection = event.subsection as Subsection | undefined
  const featuredImage = event.featuredImage as File | undefined

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem */}
      <div className="relative aspect-video overflow-hidden">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url || '/placeholder.svg'}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Badges sobre a imagem */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={getStatusVariant(event.status)}>{getStatusLabel(event.status)}</Badge>
          {event.hasCertificate && (
            <Badge variant="outline" className="bg-white/90">
              <Award className="w-3 h-3 mr-1" />
              Certificado
            </Badge>
          )}
        </div>

        {/* Tipo do evento */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90">
            {event.type === 'event' ? 'Evento' : 'Curso'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          {event.modality === 'virtual' ? (
            <Monitor className="w-4 h-4" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{getModalityLabel(event.modality)}</span>
          {commission && (
            <>
              <span>•</span>
              <span className="truncate">{commission.title}</span>
            </>
          )}
        </div>

        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {/* Data */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(event.startDate)}
              {event.endDate && event.endDate !== event.startDate && (
                <> a {formatDate(event.endDate)}</>
              )}
            </span>
          </div>

          {/* Horário */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>

          {/* Local */}
          {event.venue && event.modality !== 'virtual' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
        </div>

        {/* Preço */}
        {event.ticketTypes && event.ticketTypes.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <span className="font-medium text-blue-600">{getLowestPrice(event.ticketTypes)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/eventos/${event.slug || event.id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function EventsGridSection({
  events,
  totalDocs,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
  searchParams = {},
}: EventsGridSectionProps) {
  // Build query string preserving existing filters
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `/eventos?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalDocs === 0 ? (
            'Nenhum evento encontrado'
          ) : totalDocs === 1 ? (
            '1 evento encontrado'
          ) : (
            <>{totalDocs} eventos encontrados</>
          )}
        </p>
      </div>

      {/* Grid de eventos */}
      {events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventDetailCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros para encontrar eventos.
          </p>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={!hasPrevPage} asChild={hasPrevPage}>
            {hasPrevPage ? (
              <Link href={buildPageUrl(currentPage - 1)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Link>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </>
            )}
          </Button>

          <span className="text-sm text-muted-foreground px-4">
            Página {currentPage} de {totalPages}
          </span>

          <Button variant="outline" size="sm" disabled={!hasNextPage} asChild={hasNextPage}>
            {hasNextPage ? (
              <Link href={buildPageUrl(currentPage + 1)}>
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <>
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
