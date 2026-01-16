'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  QrCode,
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

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RegistrationStatus({
  registration,
  event,
  payment,
  initialStatus,
}: RegistrationStatusProps) {
  const [copied, setCopied] = useState(false)
  const [currentPayment, setCurrentPayment] = useState(payment)
  const [isPolling, setIsPolling] = useState(false)

  const isPaid =
    registration.paymentStatus === 'paid' ||
    registration.paymentStatus === 'complimentary' ||
    initialStatus === 'success'

  const isFree = registration.totalPrice === 0 || registration.paymentStatus === 'complimentary'

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

    // Poll every 10 seconds for PIX payments
    const interval = setInterval(pollPaymentStatus, 10000)
    return () => clearInterval(interval)
  }, [isPaid, isFree, currentPayment])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
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
          {!isPaid && !isFree && currentPayment && (
            <Card>
              <CardHeader>
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
                  {currentPayment.paymentMethod === 'pix'
                    ? 'Escaneie o QR Code ou copie o código PIX'
                    : currentPayment.paymentMethod === 'boleto'
                      ? 'Pague o boleto até a data de vencimento'
                      : 'Complete o pagamento'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PIX Payment */}
                {currentPayment.paymentMethod === 'pix' && currentPayment.qrCodeUrl && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        {currentPayment.qrCodeUrl ? (
                          <Image
                            src={currentPayment.qrCodeUrl}
                            alt="QR Code PIX"
                            width={200}
                            height={200}
                            className="mx-auto"
                          />
                        ) : (
                          <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded">
                            <QrCode className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {currentPayment.qrCodeText && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-center">PIX Copia e Cola</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-muted p-3 rounded-lg text-xs break-all font-mono">
                            {currentPayment.qrCodeText.slice(0, 100)}...
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(currentPayment.qrCodeText || '')}
                            className="flex-shrink-0"
                          >
                            {copied ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentPayment.qrCodeExpirationDate && (
                      <p className="text-sm text-center text-muted-foreground">
                        Válido até: {formatDateTime(currentPayment.qrCodeExpirationDate)}
                      </p>
                    )}
                  </div>
                )}

                {/* Boleto Payment */}
                {currentPayment.paymentMethod === 'boleto' && (
                  <div className="space-y-4">
                    {currentPayment.boletoBarcode && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Linha Digitável</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-muted p-3 rounded-lg text-sm break-all font-mono">
                            {currentPayment.boletoBarcode}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(currentPayment.boletoBarcode || '')}
                            className="flex-shrink-0"
                          >
                            {copied ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentPayment.boletoUrl && (
                      <Button asChild className="w-full">
                        <a
                          href={currentPayment.boletoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Boleto
                        </a>
                      </Button>
                    )}

                    {currentPayment.boletoDueDate && (
                      <p className="text-sm text-center text-muted-foreground">
                        Vencimento: {formatDate(currentPayment.boletoDueDate)}
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total a pagar</span>
                  <span className="text-primary">
                    {formatBRL((currentPayment.totalAmount || 0) / 100)}
                  </span>
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
                    <p className="font-medium">
                      {event.startDate && formatDate(event.startDate)}
                    </p>
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
