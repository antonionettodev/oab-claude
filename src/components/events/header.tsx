'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Video,
  Globe,
  Share2,
  Download,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Event, File, Commission } from '@/payload-types'
import { downloadEventIcal } from '@/lib/download-event-ical'

interface EventHeaderProps {
  event: Event
}

const modalityConfig = {
  'in-person': {
    icon: MapPin,
    label: 'Presencial',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-900',
  },
  virtual: {
    icon: Video,
    label: 'Online',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-900',
  },
  hybrid: {
    icon: Globe,
    label: 'Híbrido',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-900',
  },
}

const statusConfig = {
  active: {
    label: 'Inscrições Abertas',
    color: 'bg-green-500 dark:bg-green-600',
    textColor: 'text-white',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-500 dark:bg-red-600',
    textColor: 'text-white',
  },
  closed: {
    label: 'Encerrado',
    color: 'bg-gray-400 dark:bg-gray-600',
    textColor: 'text-white',
  },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function ShareModal({ event }: { event: Event }) {
  const [open, setOpen] = useState(false)

  const eventUrl = typeof window !== 'undefined' ? window.location.href : ''
  const eventTitle = event.title
  const eventDate = formatDate(event.startDate)
  const shareText = `${eventTitle} - ${eventDate}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      toast.success('Link copiado!', {
        description: 'O link do evento foi copiado para a área de transferência.',
      })
    } catch (err) {
      console.error('Erro ao copiar:', err)
      toast.error('Erro ao copiar', {
        description: 'Não foi possível copiar o link. Tente novamente.',
      })
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${eventUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(`Confira este evento: ${shareText}\n\n${eventUrl}`)}`,
  }

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#1877F2]/90 text-white',
      onClick: () => window.open(shareLinks.facebook, '_blank', 'width=600,height=400'),
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white',
      onClick: () => window.open(shareLinks.twitter, '_blank', 'width=600,height=400'),
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#25D366]/90 text-white',
      onClick: () => window.open(shareLinks.whatsapp, '_blank'),
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700 text-white',
      onClick: () => (window.location.href = shareLinks.email),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Evento</DialogTitle>
          <DialogDescription>Compartilhe este evento nas suas redes sociais</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {socialButtons.map((social) => {
              const Icon = social.icon
              return (
                <Button
                  key={social.name}
                  onClick={social.onClick}
                  className={`cursor-pointer ${social.color}`}
                  size="lg"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {social.name}
                </Button>
              )
            })}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link do evento</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-muted border border-input rounded-md"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="shrink-0 cursor-pointer"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function EventHeader({ event }: EventHeaderProps) {
  const modalityInfo =
    modalityConfig[event.modality as keyof typeof modalityConfig] || modalityConfig['in-person']
  const ModalityIcon = modalityInfo.icon
  const statusInfo = statusConfig[event.status as keyof typeof statusConfig] || statusConfig.active

  const featuredImage = event.featuredImage as File | undefined
  const commission = event.commission as Commission | undefined

  const handleDownload = () => {
    try {
      const hasProgram = (event.program ?? []).length > 0

      downloadEventIcal(event)

      toast.success(hasProgram ? 'Programação baixada!' : 'Evento baixado!', {
        description: hasProgram
          ? 'Arquivo .ical com a programação foi gerado.'
          : 'Arquivo .ical do evento foi gerado.',
      })
    } catch (err) {
      console.error(err)
      toast.error('Não foi possível baixar', {
        description: 'Tente novamente. Se persistir, avise o suporte.',
      })
    }
  }

  return (
    <div className="relative">
      {featuredImage?.url && (
        <div className="relative h-64 sm:h-80 lg:h-96 w-full">
          <Image
            src={featuredImage.url || '/placeholder.svg'}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className={featuredImage?.url ? '-mt-32 relative z-10' : 'pt-8'}>
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="hover:text-primary transition-colors text-white/80 hover:text-white"
                    >
                      Início
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/eventos"
                      className="hover:text-primary transition-colors text-white/80 hover:text-white"
                    >
                      Eventos
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">{event.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="bg-card dark:bg-[#1E293B] rounded-xl p-6 sm:p-8 shadow-lg border border-border">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${statusInfo.color} ${statusInfo.textColor} px-3 py-1`}>
                {statusInfo.label}
              </Badge>
              <Badge
                className={`${modalityInfo.bgColor} ${modalityInfo.color} border ${modalityInfo.borderColor} px-3 py-1`}
                variant="outline"
              >
                <ModalityIcon className="w-3.5 h-3.5 mr-1.5" />
                {modalityInfo.label}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.venue}</span>
                </div>
              )}
              {commission && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>{commission.title}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <ShareModal event={event} />
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handleDownload}
                type="button"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Programação
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
