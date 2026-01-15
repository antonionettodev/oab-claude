import type { Endpoint } from 'payload'

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
 * Endpoint: Webhook do PagBank
 *
 * Recebe notificações de mudança de status dos pedidos do PagBank.
 * Este endpoint é necessário porque o PagBank faz uma chamada HTTP
 * para notificar mudanças de status.
 *
 * POST /api/payments/webhook
 */
export const webhookEndpoint: Endpoint = {
  path: '/webhook',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}

      console.log('Webhook PagBank recebido:', JSON.stringify(body, null, 2))

      const { id: pagbankOrderId, reference_id, charges } = body

      if (!pagbankOrderId && !reference_id) {
        return Response.json(
          { success: false, error: 'ID do pedido não informado' },
          { status: 400 }
        )
      }

      // Busca o pagamento local
      let payment = null

      if (pagbankOrderId) {
        const result = await payload.find({
          collection: 'payments',
          where: {
            pagbankOrderId: { equals: pagbankOrderId },
          },
          limit: 1,
        })
        payment = result.docs[0]
      }

      if (!payment && reference_id) {
        const result = await payload.find({
          collection: 'payments',
          where: {
            referenceId: { equals: reference_id },
          },
          limit: 1,
        })
        payment = result.docs[0]
      }

      if (!payment) {
        console.warn('Pagamento não encontrado para webhook:', { pagbankOrderId, reference_id })
        return Response.json({
          success: true,
          message: 'Notificação recebida, mas pagamento não encontrado localmente',
        })
      }

      // Determina o novo status baseado nas charges
      let newStatus: PaymentStatus = payment.status as PaymentStatus
      let paidAmount: number | undefined
      let refundedAmount: number | undefined
      let chargeId: string | undefined

      if (charges && charges.length > 0) {
        const charge = charges[0]
        chargeId = charge.id
        newStatus = mapPagBankStatus(charge.status)

        if (charge.amount?.summary?.paid) {
          paidAmount = charge.amount.summary.paid
        }
        if (charge.amount?.summary?.refunded) {
          refundedAmount = charge.amount.summary.refunded
        }
      }

      const previousStatus = payment.status

      // Prepara os dados de atualização
      const updateData: Record<string, unknown> = {
        status: newStatus,
        pagbankResponse: body,
      }

      // Adiciona a notificação ao histórico
      const webhookEntry = {
        receivedAt: new Date().toISOString(),
        notificationType: body.notificationCode || 'status_change',
        previousStatus,
        newStatus,
        payload: body,
      }

      updateData.webhookHistory = [...(payment.webhookHistory || []), webhookEntry]

      if (newStatus === 'paid' && !payment.paymentDate) {
        updateData.paymentDate = new Date().toISOString()
      }

      if (paidAmount !== undefined) {
        updateData.paidAmount = paidAmount
      }

      if (refundedAmount !== undefined) {
        updateData.refundedAmount = refundedAmount
      }

      if (chargeId) {
        updateData.chargeId = chargeId
      }

      // Atualiza o pagamento (os hooks afterChange cuidam de atualizar a inscrição)
      const updatedPayment = await payload.update({
        collection: 'payments',
        id: payment.id,
        data: updateData,
      })

      console.log('Webhook processado com sucesso:', {
        paymentId: updatedPayment.id,
        previousStatus,
        newStatus,
      })

      return Response.json({
        success: true,
        message: 'Notificação processada com sucesso',
        data: {
          paymentId: updatedPayment.id,
          referenceId: updatedPayment.referenceId,
          previousStatus,
          newStatus: updatedPayment.status,
        },
      })
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
        },
        { status: 500 }
      )
    }
  },
}
