'use client'

import { useMemo, useState } from 'react'
import { CreditCard, UserCheck, ShieldCheck, BadgeCheck, BookOpen, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import type { Event } from '@/payload-types'

interface EventSidebarProps {
  event: Event
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function calcGroupDiscount(event: Event, unitPrice: number, qty: number) {
  const min = event.groupDiscountMinPeople ?? null
  const max = event.groupDiscountMaxPeople ?? null
  const type = event.groupDiscountType ?? null
  const value = event.groupDiscountValue ?? 0

  if (unitPrice <= 0 || qty <= 0) return { discount: 0, applied: false }
  if (!min || !max || !type || value <= 0) return { discount: 0, applied: false }

  const eligible = qty >= min && qty <= max
  if (!eligible) return { discount: 0, applied: false }

  const subtotal = unitPrice * qty

  if (type === 'percentage') {
    const discount = Math.round((subtotal * value) / 100)
    return { discount, applied: discount > 0 }
  }

  const discount = Math.round(value)
  return { discount, applied: discount > 0 }
}

export function EventSidebar({ event }: EventSidebarProps) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [participantName, setParticipantName] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')
  const [participantPhone, setParticipantPhone] = useState('')
  const [participantOAB, setParticipantOAB] = useState('')

  const ticketTypes = event.ticketTypes ?? []
  const selectedTicket = ticketTypes[selectedTicketIndex]
  const currentPrice = selectedTicket?.price ?? 0

  const isExternalRegistration = event.registrationType === 'external'
  const isClosed = event.status === 'closed' || event.status === 'cancelled'

  const { subtotal, discount, total, discountApplied, showGroupDiscountHint } = useMemo(() => {
    const subtotal = currentPrice * quantity
    const { discount, applied } = calcGroupDiscount(event, currentPrice, quantity)
    const total = Math.max(0, subtotal - discount)

    const hasGroupConfig =
      !!event.groupDiscountMinPeople &&
      !!event.groupDiscountMaxPeople &&
      !!event.groupDiscountType &&
      (event.groupDiscountValue ?? 0) > 0

    return {
      subtotal,
      discount,
      total,
      discountApplied: applied,
      showGroupDiscountHint: hasGroupConfig && currentPrice > 0,
    }
  }, [
    currentPrice,
    quantity,
    event.groupDiscountMinPeople,
    event.groupDiscountMaxPeople,
    event.groupDiscountType,
    event.groupDiscountValue,
  ])

  const handleRegister = () => {
    if (isExternalRegistration && event.externalRegistrationUrl) {
      window.open(event.externalRegistrationUrl, '_blank')
      return
    }
  }

  return (
    <div className="sticky top-24 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inscrição</CardTitle>
          <CardDescription>
            {isExternalRegistration ? 'Inscrição externa' : 'Complete seus dados para finalizar'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {ticketTypes.length > 0 && !isExternalRegistration && (
            <div className="space-y-3">
              <Label>Categoria de Inscrição</Label>

              <RadioGroup
                value={String(selectedTicketIndex)}
                onValueChange={(value) => setSelectedTicketIndex(Number(value))}
                className="space-y-2"
              >
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.id || index}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={String(index)} id={`ticket-${index}`} />
                    <Label htmlFor={`ticket-${index}`} className="flex-1 cursor-pointer">
                      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                        <span>{ticket.category}</span>
                        <span className="font-semibold text-primary tabular-nums whitespace-nowrap">
                          {ticket.price === 0 ? 'Gratuito' : formatBRL(ticket.price)}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {!isExternalRegistration && (
            <>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oab">Número OAB</Label>
                  <Input
                    id="oab"
                    value={participantOAB}
                    onChange={(e) => setParticipantOAB(e.target.value)}
                    placeholder="OAB/SC 12345"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor unitário</span>
                  <span className="font-semibold tabular-nums">
                    {currentPrice === 0 ? 'Gratuito' : formatBRL(currentPrice)}
                  </span>
                </div>

                {currentPrice > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quantidade</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-7 w-7 p-0"
                          type="button"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-semibold tabular-nums">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-7 w-7 p-0"
                          type="button"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {showGroupDiscountHint && event.groupDiscountDescription && (
                      <p className="text-xs text-muted-foreground">
                        {event.groupDiscountDescription}
                      </p>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold tabular-nums">{formatBRL(subtotal)}</span>
                    </div>

                    {discountApplied && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Desconto em grupo</span>
                        <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">
                          - {formatBRL(discount)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary tabular-nums">
                        {formatBRL(total)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <Button
            onClick={handleRegister}
            disabled={isClosed}
            className="w-full h-12 cursor-pointer"
            type="button"
          >
            {isClosed ? (
              'Inscrições Encerradas'
            ) : isExternalRegistration ? (
              'Acessar Inscrição Externa'
            ) : currentPrice === 0 ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Confirmar Inscrição Gratuita
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Finalizar Inscrição
              </>
            )}
          </Button>

          {!isExternalRegistration && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Pagamento seguro e dados protegidos</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          {event.hasCertificate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <span>Certificado reconhecido pela OAB</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Material didático incluso</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>Networking com especialistas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
