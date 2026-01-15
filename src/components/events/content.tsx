import Image from 'next/image'
import {
  FileText,
  Calendar,
  Users,
  Award,
  AlertCircle,
  Check,
  ChevronRight,
  User,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Event, Speaker, File } from '@/payload-types'

interface EventContentProps {
  event: Event
  speakers: Speaker[]
}

function formatProgramDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function EventContent({ event, speakers }: EventContentProps) {
  return (
    <div className="space-y-8">
      {/* Sobre o Evento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Sobre o Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </CardContent>
      </Card>

      {/* Programação */}
      {event.program && event.program.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Programação
            </CardTitle>
            <CardDescription>Cronograma completo do evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.program.map((item, index) => {
              const speaker = typeof item.speaker === 'object' ? (item.speaker as Speaker) : null
              return (
                <div key={item.id || index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      {speaker ? (
                        <User className="w-5 h-5 text-primary" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-primary">
                        {formatProgramDate(item.date)} - {item.time}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    {item.briefDescription && (
                      <p className="text-sm text-muted-foreground">{item.briefDescription}</p>
                    )}
                    {speaker && <p className="text-sm text-primary mt-1">Com: {speaker.name}</p>}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Palestrantes */}
      {speakers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Palestrantes
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            {speakers.map((speaker) => {
              const image = speaker.image as File | undefined
              return (
                <div key={speaker.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      {image?.url ? (
                        <Image
                          src={image.url || '/placeholder.svg'}
                          alt={speaker.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">{speaker.name}</h4>
                    {speaker.professionalTitle && (
                      <p className="text-sm text-primary mb-2">{speaker.professionalTitle}</p>
                    )}
                    {speaker.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {speaker.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* O que está incluso */}
      {event.included && event.included.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />O que está incluso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-3">
              {event.included.map((item, index) => (
                <li key={item.id || index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item.item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Requisitos */}
      {event.requirements && event.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Requisitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {event.requirements.map((item, index) => (
                <li key={item.id || index} className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item.requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
