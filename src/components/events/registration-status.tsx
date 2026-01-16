'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  Loader2,
  ExternalLink,
  Ticket,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Event, Payment, Registration } from '@/payload-types'

interface RegistrationStatusProps {
  registration: Registration
  event: Event
  payment: Payment | null
  initialStatus?: string
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function RegistrationStatus({
  registration,
  event,
  payment,
  initialStatus,
}: RegistrationStatusProps) {
  const [currentPayment, setCurrentPayment] = useState(payment)
  const [isPolling, setIsPolling] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const isPaid =
    registration.paymentStatus === 'paid' ||
    registration.paymentStatus === 'complimentary' ||
    currentPayment?.status === 'paid' ||
    currentPayment?.status === 'available' ||
    initialStatus === 'success'

  const isFree = registration.totalPrice === 0 || registration.paymentStatus === 'complimentary'

  // Get checkout URL from payment (type assertion needed for custom field)
  const checkoutUrl = (currentPayment as Payment & { checkoutUrl?: string })?.checkoutUrl

  // Poll for payment status updates
  useEffect(() => {
    if (isPaid || isFree || !currentPayment) return

    const pollPaymentStatus = async () => {
      setIsPolling(true)
      try {
        const response = await fetch(`/api/payments/${currentPayment.id}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentPayment(data)

          if (data.status === 'paid' || data.status === 'available') {
            // Refresh the page to show updated status
            window.location.reload()
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error)
      } finally {
        setIsPolling(false)
      }
    }

    // Poll every 15 seconds
    const interval = setInterval(pollPaymentStatus, 15000)
    return () => clearInterval(interval)
  }, [isPaid, isFree, currentPayment])

  const handlePayment = () => {
    if (checkoutUrl) {
      setIsRedirecting(true)
      window.location.href = checkoutUrl
    }
  }

  const getStatusBadge = () => {
    if (isPaid || isFree) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {isFree ? 'Inscrição Gratuita Confirmada' : 'Pagamento Confirmado'}
        </Badge>
      )
    }

    if (registration.paymentStatus === 'pending' || registration.paymentStatus === 'processing') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Aguardando Pagamento
        </Badge>
      )
    }

    if (registration.paymentStatus === 'failed' || registration.paymentStatus === 'cancelled') {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pagamento não realizado
        </Badge>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      {(isPaid || isFree) && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Inscrição Confirmada!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Você receberá um e-mail com os detalhes da sua inscrição.
          </p>
        </div>
      )}

      {/* Pending Payment Header */}
      {!isPaid && !isFree && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Inscrição Realizada
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete o pagamento para confirmar sua inscrição.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Payment Section - Only show if not paid and not free */}
          {!isPaid && !isFree && (
            <Card className="border-primary border-2">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pagamento
                  </CardTitle>
                  {isPolling && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </div>
                  )}
                </div>
                <CardDescription>
                  Clique no botão abaixo para ser redirecionado ao ambiente seguro do PagBank
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Payment Amount */}
                <div className="text-center py-6 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatBRL(registration.totalPrice || 0)}
                  </p>
                </div>

                {/* Payment Button */}
                {checkoutUrl ? (
                  <Button
                    onClick={handlePayment}
                    disabled={isRedirecting}
                    className="w-full h-14 text-lg"
                    size="lg"
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Redirecionando para o PagBank...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar com PagBank
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center py-6">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Gerando link de pagamento...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aguarde alguns segundos e atualize a página
                    </p>
                  </div>
                )}

                {/* Payment Methods Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p className="mb-3">Formas de pagamento disponíveis:</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    <span className="bg-muted px-4 py-2 rounded-full font-medium">PIX</span>
                    <span className="bg-muted px-4 py-2 rounded-full font-medium">
                      Cartão de Crédito
                    </span>
                    <span className="bg-muted px-4 py-2 rounded-full font-medium">
                      Cartão de Débito
                    </span>
                    <span className="bg-muted px-4 py-2 rounded-full font-medium">Boleto</span>
                  </div>
                  <p className="mt-3 text-xs">Parcelamento em até 12x no cartão de crédito</p>
                </div>

                <Separator />

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span>Pagamento 100% seguro pelo PagBank</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Detalhes da Inscrição
                </CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Inscrito</p>
                    <p className="font-medium">{registration.registrantName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{registration.registrantEmail}</p>
                  </div>
                </div>

                {registration.registrantPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{registration.registrantPhone}</p>
                    </div>
                  </div>
                )}

                {registration.registrantOAB && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">OAB</p>
                      <p className="font-medium">{registration.registrantOAB}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Código da Inscrição</span>
                <span className="font-mono font-semibold">{registration.registrationCode}</span>
              </div>

              {registration.tickets && registration.tickets.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ingressos ({registration.tickets.length})
                    </p>
                    <div className="space-y-2">
                      {registration.tickets.map((ticket, index) => (
                        <div
                          key={ticket.id || index}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                        >
                          <span>{ticket.participantName || `Ingresso ${index + 1}`}</span>
                          <span className="font-medium">{ticket.ticketType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Valor Total</span>
                <span className="text-primary">
                  {registration.totalPrice === 0 ? 'Gratuito' : formatBRL(registration.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Event Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">{event.title}</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{event.startDate && formatDate(event.startDate)}</p>
                    {event.startTime && event.endTime && (
                      <p className="text-muted-foreground">
                        {event.startTime} às {event.endTime}
                      </p>
                    )}
                  </div>
                </div>

                {event.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{event.venue}</p>
                      {event.address && <p className="text-muted-foreground">{event.address}</p>}
                    </div>
                  </div>
                )}
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/eventos/${event.slug}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Evento
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Precisa de ajuda?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Entre em contato com nossa equipe de suporte.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="mailto:eventos@oab-sc.org.br">Fale Conosco</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
