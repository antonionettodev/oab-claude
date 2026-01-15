import type { CollectionAfterReadHook } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL?.startsWith('http')
  ? process.env.PAGBANK_API_URL
  : `https://${process.env.PAGBANK_API_URL || 'sandbox.api.pagseguro.com'}`
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

type PaymentStatus = 'pending' | 'waiting_payment' | 'in_analysis' | 'authorized' | 'paid' | 'available' | 'in_dispute' | 'refunded' | 'canceled' | 'declined'

/**
 * Mapeia o status do PagBank para o status local
 */
const mapPagBankStatus = (status: string): PaymentStatus => {
  const statusMap: Record<string, PaymentStatus> = {
    AUTHORIZED: 'authorized',
    PAID: 'paid',
    AVAILABLE: 'available',
    IN_DISPUTE: 'in_dispute',
    REFUNDED: 'refunded',
    CANCELED: 'canceled',
    DECLINED: 'declined',
    WAITING: 'waiting_payment',
    IN_ANALYSIS: 'in_analysis',
  }

  return statusMap[status?.toUpperCase()] || 'pending'
}

/**
 * Hook: Sincronizar Status com PagBank
 *
 * Quando um pagamento é lido e ainda está aguardando pagamento,
 * consulta o status atual na API do PagBank e atualiza se necessário.
 *
 * NOTA: Este hook é opcional e pode impactar performance se habilitado.
 * Para uso em produção, considere usar apenas o webhook.
 */
export const syncPagBankStatusHook: CollectionAfterReadHook = async ({
  doc,
  req,
}) => {
  // Só sincroniza se o pagamento ainda está pendente e tem um ID do PagBank
  if (!doc.pagbankOrderId) {
    return doc
  }

  // Só sincroniza se o status ainda é "aguardando"
  const pendingStatuses = ['pending', 'waiting_payment', 'in_analysis']
  if (!pendingStatuses.includes(doc.status)) {
    return doc
  }

  if (!PAGBANK_TOKEN) {
    return doc
  }

  // Evita sincronização frequente - só sincroniza se passou mais de 5 minutos
  const lastSync = doc.updatedAt ? new Date(doc.updatedAt) : null
  const now = new Date()
  if (lastSync && (now.getTime() - lastSync.getTime()) < 5 * 60 * 1000) {
    return doc
  }

  try {
    const pagbankResponse = await fetch(`${PAGBANK_API_URL}/orders/${doc.pagbankOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
      },
    })

    if (!pagbankResponse.ok) {
      return doc
    }

    const pagbankData = await pagbankResponse.json()

    // Verifica se o status mudou
    if (pagbankData.charges && pagbankData.charges.length > 0) {
      const charge = pagbankData.charges[0]
      const newStatus = mapPagBankStatus(charge.status)

      if (newStatus !== doc.status) {
        // Atualiza o documento em background (não bloqueia a leitura)
        const updateData: Record<string, unknown> = {
          status: newStatus,
          pagbankResponse: pagbankData,
        }

        if (newStatus === 'paid' && !doc.paymentDate) {
          updateData.paymentDate = new Date().toISOString()
        }

        if (charge.amount?.summary?.paid) {
          updateData.paidAmount = charge.amount.summary.paid
        }

        if (charge.id) {
          updateData.chargeId = charge.id
        }

        // Atualiza em background sem aguardar
        req.payload.update({
          collection: 'payments',
          id: doc.id,
          data: updateData,
        }).catch((error) => {
          console.error('Erro ao atualizar status do pagamento:', error)
        })

        // Retorna o doc atualizado para exibição imediata
        return {
          ...doc,
          ...updateData,
        }
      }
    }

    return doc
  } catch (error) {
    console.error('Erro ao sincronizar com PagBank:', error)
    return doc
  }
}
