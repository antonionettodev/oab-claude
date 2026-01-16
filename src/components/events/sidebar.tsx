'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  UserCheck,
  ShieldCheck,
  BadgeCheck,
  BookOpen,
  Users,
  Loader2,
  Search,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Event } from '@/payload-types'

interface EventSidebarProps {
  event: Event
}

interface LookupResult {
  name: string
  cpf: string
  email: string
  phone: string
  oab: string | null
  oabNumber: string | null
  oabState: string | null
  lawyerId: number
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
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
  const router = useRouter()

  // Form state
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [participantName, setParticipantName] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')
  const [participantPhone, setParticipantPhone] = useState('')
  const [participantCPF, setParticipantCPF] = useState('')
  const [participantOAB, setParticipantOAB] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string>('pix')

  // Lookup state
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null)
  const [isLawyer, setIsLawyer] = useState(false)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Lookup lawyer by OAB or CPF
  const lookupParticipant = useCallback(async (oab?: string, cpf?: string) => {
    if (!oab && !cpf) return

    setIsLookingUp(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (oab) params.set('oab', oab)
      if (cpf) params.set('cpf', cpf.replace(/\D/g, ''))

      const response = await fetch(`/api/events/lookup-participant?${params}`)
      const data = await response.json()

      if (data.success && data.found) {
        setLookupResult(data.data)
        setIsLawyer(data.isLawyer)

        // Auto-fill fields
        setParticipantName(data.data.name || '')
        setParticipantEmail(data.data.email || '')
        setParticipantPhone(data.data.phone ? formatPhone(data.data.phone) : '')
        setParticipantCPF(data.data.cpf ? formatCPF(data.data.cpf) : '')
        if (data.data.oab) {
          setParticipantOAB(data.data.oab)
        }
      } else {
        setLookupResult(null)
        setIsLawyer(false)
      }
    } catch {
      setLookupResult(null)
      setIsLawyer(false)
    } finally {
      setIsLookingUp(false)
    }
  }, [])

  // Debounced lookup when OAB changes
  useEffect(() => {
    if (participantOAB.length >= 5) {
      const timer = setTimeout(() => {
        lookupParticipant(participantOAB, undefined)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [participantOAB, lookupParticipant])

  // Debounced lookup when CPF changes
  useEffect(() => {
    const cpfClean = participantCPF.replace(/\D/g, '')
    if (cpfClean.length === 11 && !lookupResult) {
      const timer = setTimeout(() => {
        lookupParticipant(undefined, cpfClean)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [participantCPF, lookupParticipant, lookupResult])

  const handleRegister = async () => {
    if (isExternalRegistration && event.externalRegistrationUrl) {
      window.open(event.externalRegistrationUrl, '_blank')
      return
    }

    // Validation
    if (!participantName.trim()) {
      setError('Nome é obrigatório')
      return
    }
    if (!participantEmail.trim()) {
      setError('E-mail é obrigatório')
      return
    }
    if (!participantCPF.trim() || participantCPF.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Build tickets array
      const tickets = Array.from({ length: quantity }, (_, i) => ({
        participantName: i === 0 ? participantName : '',
        participantEmail: i === 0 ? participantEmail : '',
        participantPhone: participantPhone.replace(/\D/g, ''),
        participantCPF: i === 0 ? participantCPF.replace(/\D/g, '') : '',
        participantOAB: participantOAB || undefined,
        ticketType: selectedTicket?.id || selectedTicket?.category,
        unitPrice: currentPrice,
      }))

      const registrationData = {
        event: event.id,
        registrantName: participantName,
        registrantEmail: participantEmail,
        registrantPhone: participantPhone.replace(/\D/g, ''),
        registrantCPF: participantCPF.replace(/\D/g, ''),
        registrantOAB: participantOAB || undefined,
        tickets,
        totalPrice: total,
        paymentMethod: total > 0 ? paymentMethod : 'complimentary',
        paymentStatus: total > 0 ? 'pending' : 'complimentary',
        status: 'confirmed',
        lawyer: lookupResult?.lawyerId || undefined,
      }

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || result.message || 'Erro ao criar inscrição')
      }

      // Redirect to payment page or success page
      if (total > 0) {
        router.push(`/eventos/${event.slug}/inscricao/${result.doc.id}`)
      } else {
        router.push(`/eventos/${event.slug}/inscricao/${result.doc.id}?status=success`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar inscrição')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCPFChange = (value: string) => {
    setParticipantCPF(formatCPF(value))
    // Clear lookup if CPF changes after a successful lookup
    if (lookupResult && value.replace(/\D/g, '') !== lookupResult.cpf) {
      setLookupResult(null)
      setIsLawyer(false)
    }
  }

  const handleOABChange = (value: string) => {
    setParticipantOAB(value.toUpperCase())
    // Clear lookup if OAB changes after a successful lookup
    if (lookupResult && value !== lookupResult.oab) {
      setLookupResult(null)
      setIsLawyer(false)
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

              {/* Lookup indicator */}
              {isLawyer && lookupResult && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Advogado identificado! Dados preenchidos automaticamente.</span>
                </div>
              )}

              <div className="space-y-4">
                {/* OAB field - first for lawyer lookup */}
                <div className="space-y-2">
                  <Label htmlFor="oab">Número OAB</Label>
                  <div className="relative">
                    <Input
                      id="oab"
                      value={participantOAB}
                      onChange={(e) => handleOABChange(e.target.value)}
                      placeholder="SC12345"
                      className="pr-10"
                    />
                    {isLookingUp && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {!isLookingUp && participantOAB.length >= 5 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Digite sua OAB para preencher automaticamente
                  </p>
                </div>

                {/* CPF field */}
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <div className="relative">
                    <Input
                      id="cpf"
                      value={participantCPF}
                      onChange={(e) => handleCPFChange(e.target.value)}
                      placeholder="000.000.000-00"
                      className="pr-10"
                    />
                    {isLookingUp && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Seu nome completo"
                    readOnly={isLawyer && !!lookupResult}
                    className={isLawyer && lookupResult ? 'bg-muted' : ''}
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
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={participantPhone}
                    onChange={(e) => setParticipantPhone(formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
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

                    {/* Payment method selection */}
                    <div className="space-y-2 pt-2">
                      <Label>Forma de Pagamento</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pix">PIX (Aprovação instantânea)</SelectItem>
                          <SelectItem value="boleto">Boleto Bancário</SelectItem>
                          <SelectItem value="credit-card">Cartão de Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            onClick={handleRegister}
            disabled={isClosed || isSubmitting}
            className="w-full h-12 cursor-pointer"
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : isClosed ? (
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
