'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ConfirmationStatus = 'loading' | 'success' | 'pending' | 'error'

interface RegistrationData {
  id: string
  registrationCode: string
  registrantName: string
  paymentStatus: string
  event: {
    slug: string
    title: string
  }
}

function PaymentConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const referenceId = searchParams.get('ref')

  useEffect(() => {
    if (!referenceId) {
      setStatus('error')
      setError('Referência de pagamento não encontrada')
      return
    }

    const checkPaymentStatus = async () => {
      try {
        // Look up registration by reference code
        const response = await fetch(`/api/registrations?where[registrationCode][equals]=${referenceId}`)

        if (!response.ok) {
          throw new Error('Erro ao buscar inscrição')
        }

        const data = await response.json()

        if (!data.docs || data.docs.length === 0) {
          setStatus('error')
          setError('Inscrição não encontrada')
          return
        }

        const reg = data.docs[0]
        setRegistration({
          id: reg.id,
          registrationCode: reg.registrationCode,
          registrantName: reg.registrantName,
          paymentStatus: reg.paymentStatus,
          event: typeof reg.event === 'object' ? reg.event : { slug: '', title: 'Evento' },
        })

        // Determine status based on payment status
        if (reg.paymentStatus === 'paid' || reg.paymentStatus === 'complimentary') {
          setStatus('success')
        } else if (reg.paymentStatus === 'pending' || reg.paymentStatus === 'processing') {
          setStatus('pending')
        } else {
          setStatus('error')
          setError('Pagamento não foi processado')
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    }

    checkPaymentStatus()
  }, [referenceId])

  // Redirect to registration page after a delay
  useEffect(() => {
    if (registration && (status === 'success' || status === 'pending')) {
      const timer = setTimeout(() => {
        router.push(`/eventos/${registration.event.slug}/inscricao/${registration.id}?status=${status}`)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [registration, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <h2 className="text-xl font-semibold mb-2">Verificando pagamento...</h2>
              <p className="text-muted-foreground">
                Aguarde enquanto confirmamos seu pagamento
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4 mx-auto">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Erro no Pagamento</CardTitle>
            <CardDescription>{error || 'Ocorreu um erro ao processar seu pagamento'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Por favor, tente novamente ou entre em contato com nosso suporte.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/eventos">Ver Eventos</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:eventos@oab-sc.org.br">Fale Conosco</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4 mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Pagamento Confirmado!</CardTitle>
            <CardDescription>Sua inscrição foi confirmada com sucesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {registration && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inscrito</span>
                  <span className="font-medium">{registration.registrantName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Evento</span>
                  <span className="font-medium">{registration.event.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Código</span>
                  <span className="font-mono font-medium">{registration.registrationCode}</span>
                </div>
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecionando para detalhes da inscrição...
            </p>
            {registration && (
              <Button asChild className="w-full">
                <Link href={`/eventos/${registration.event.slug}/inscricao/${registration.id}`}>
                  Ver Detalhes da Inscrição
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pending status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4 mx-auto">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle>Pagamento em Processamento</CardTitle>
          <CardDescription>Estamos aguardando a confirmação do seu pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registration && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inscrito</span>
                <span className="font-medium">{registration.registrantName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Evento</span>
                <span className="font-medium">{registration.event.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Código</span>
                <span className="font-mono font-medium">{registration.registrationCode}</span>
              </div>
            </div>
          )}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Pagamento via PIX ou Boleto?
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Após a confirmação do pagamento, você receberá um e-mail com os detalhes da sua inscrição.
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecionando para detalhes da inscrição...
          </p>
          {registration && (
            <Button asChild className="w-full">
              <Link href={`/eventos/${registration.event.slug}/inscricao/${registration.id}`}>
                Ver Detalhes da Inscrição
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentConfirmationContent />
    </Suspense>
  )
}
