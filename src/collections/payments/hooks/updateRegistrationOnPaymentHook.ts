import type { CollectionAfterChangeHook } from 'payload'

type RegistrationPaymentMethod = 'boleto' | 'credit-card' | 'debit-card' | 'pix' | 'transfer' | 'complimentary'

/**
 * Converte o método de pagamento da collection payments para registrations
 */
const convertPaymentMethod = (method: string | null | undefined): RegistrationPaymentMethod | undefined => {
  if (!method) return undefined

  const methodMap: Record<string, RegistrationPaymentMethod> = {
    credit_card: 'credit-card',
    debit_card: 'debit-card',
    boleto: 'boleto',
    pix: 'pix',
    qr_code: 'pix',
  }

  return methodMap[method]
}

/**
 * Hook: Atualizar Inscrição após Mudança de Status
 *
 * Quando o status de um pagamento muda para 'paid' ou 'refunded',
 * atualiza automaticamente a inscrição relacionada.
 */
export const updateRegistrationOnPaymentHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Só processa se há uma inscrição relacionada
  if (!doc.registration) {
    return doc
  }

  const registrationId = typeof doc.registration === 'object' ? doc.registration.id : doc.registration
  const previousStatus = previousDoc?.status
  const currentStatus = doc.status

  // Se o status não mudou, não faz nada
  if (previousStatus === currentStatus) {
    return doc
  }

  try {
    // Se foi pago
    if (currentStatus === 'paid' && previousStatus !== 'paid') {
      const registrationPaymentMethod = convertPaymentMethod(doc.paymentMethod)

      await req.payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          paymentStatus: 'paid',
          paymentDate: doc.paymentDate || new Date().toISOString(),
          paymentReference: doc.pagbankOrderId,
          paymentMethod: registrationPaymentMethod,
        },
      })

      console.log('Inscrição atualizada após pagamento:', registrationId)
    }

    // Se foi reembolsado
    if (currentStatus === 'refunded' && previousStatus !== 'refunded') {
      await req.payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          paymentStatus: 'refunded',
        },
      })

      console.log('Inscrição atualizada após reembolso:', registrationId)
    }

    // Se foi cancelado
    if (currentStatus === 'canceled' && previousStatus !== 'canceled') {
      await req.payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          paymentStatus: 'cancelled',
        },
      })

      console.log('Inscrição atualizada após cancelamento:', registrationId)
    }
  } catch (error) {
    console.error('Erro ao atualizar inscrição:', error)
  }

  return doc
}
