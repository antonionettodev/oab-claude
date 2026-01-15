import type { Endpoint } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL || 'https://sandbox.api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

/**
 * Mapeia o status do PagBank para o status local
 */
const mapPagBankStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
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
 *
 * POST /api/payments/webhook
 *
 * O PagBank envia notificações quando o status de um pedido muda.
 * Este endpoint processa essas notificações e atualiza o status local.
 */
export const webhookEndpoint: Endpoint = {
  path: '/webhook',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}

      console.log('Webhook PagBank recebido:', JSON.stringify(body, null, 2))

      // O PagBank pode enviar diferentes tipos de notificação
      // Estrutura comum: { id, reference_id, charges: [...] }
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
        // Retorna sucesso mesmo assim para evitar que o PagBank reenvie
        return Response.json({
          success: true,
          message: 'Notificação recebida, mas pagamento não encontrado localmente',
        })
      }

      // Determina o novo status baseado nas charges
      let newStatus = payment.status
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
      const updateData: Record<string, any> = {
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

      // Atualiza o status se mudou
      if (previousStatus !== newStatus) {
        updateData.status = newStatus

        // Se foi pago, atualiza a data de pagamento
        if (newStatus === 'paid' && !payment.paymentDate) {
          updateData.paymentDate = new Date().toISOString()
        }
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

      // Atualiza o pagamento
      const updatedPayment = await payload.update({
        collection: 'payments',
        id: payment.id,
        data: updateData,
      })

      // Se o pagamento foi confirmado e há uma inscrição relacionada, atualiza a inscrição
      if (
        newStatus === 'paid' &&
        previousStatus !== 'paid' &&
        updatedPayment.registration
      ) {
        try {
          const registrationId =
            typeof updatedPayment.registration === 'object'
              ? updatedPayment.registration.id
              : updatedPayment.registration

          await payload.update({
            collection: 'registrations',
            id: registrationId,
            data: {
              paymentStatus: 'paid',
              paymentDate: new Date().toISOString(),
              paymentReference: pagbankOrderId,
              paymentMethod: updatedPayment.paymentMethod,
            },
          })

          console.log('Inscrição atualizada após pagamento:', registrationId)
        } catch (error) {
          console.error('Erro ao atualizar inscrição após pagamento:', error)
        }
      }

      // Se foi reembolsado e há uma inscrição relacionada
      if (
        newStatus === 'refunded' &&
        previousStatus !== 'refunded' &&
        updatedPayment.registration
      ) {
        try {
          const registrationId =
            typeof updatedPayment.registration === 'object'
              ? updatedPayment.registration.id
              : updatedPayment.registration

          await payload.update({
            collection: 'registrations',
            id: registrationId,
            data: {
              paymentStatus: 'refunded',
            },
          })

          console.log('Inscrição atualizada após reembolso:', registrationId)
        } catch (error) {
          console.error('Erro ao atualizar inscrição após reembolso:', error)
        }
      }

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

/**
 * Endpoint: Sincronizar Pedido com PagBank
 *
 * Consulta o status atual de um pedido na API do PagBank e sincroniza localmente.
 * Útil para casos onde o webhook falhou ou para verificação manual.
 *
 * POST /api/payments/sync/:orderId
 */
export const syncOrderEndpoint: Endpoint = {
  path: '/sync/:orderId',
  method: 'post',
  handler: async (req) => {
    const { payload, routeParams } = req

    try {
      const orderId = routeParams?.orderId

      if (!orderId) {
        return Response.json(
          { success: false, error: 'ID do pedido é obrigatório' },
          { status: 400 }
        )
      }

      if (!PAGBANK_TOKEN) {
        return Response.json(
          { success: false, error: 'Token do PagBank não configurado' },
          { status: 500 }
        )
      }

      // Busca o pagamento local
      let payment = null
      let pagbankOrderId = orderId

      if (orderId.startsWith('ORDE_')) {
        const result = await payload.find({
          collection: 'payments',
          where: {
            pagbankOrderId: { equals: orderId },
          },
          limit: 1,
        })
        payment = result.docs[0]
      } else {
        const resultByRef = await payload.find({
          collection: 'payments',
          where: {
            referenceId: { equals: orderId },
          },
          limit: 1,
        })

        if (resultByRef.docs.length > 0) {
          payment = resultByRef.docs[0]
        } else {
          try {
            payment = await payload.findByID({
              collection: 'payments',
              id: orderId,
            })
          } catch {
            // ID não encontrado
          }
        }
      }

      if (!payment) {
        return Response.json(
          { success: false, error: 'Pagamento não encontrado' },
          { status: 404 }
        )
      }

      if (payment.pagbankOrderId) {
        pagbankOrderId = payment.pagbankOrderId
      }

      // Consulta o pedido na API do PagBank
      const pagbankResponse = await fetch(`${PAGBANK_API_URL}/orders/${pagbankOrderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        },
      })

      const pagbankData = await pagbankResponse.json()

      if (!pagbankResponse.ok) {
        return Response.json(
          {
            success: false,
            error: 'Erro ao consultar pedido no PagBank',
            details: pagbankData,
          },
          { status: pagbankResponse.status }
        )
      }

      // Determina o novo status
      let newStatus = payment.status
      let paidAmount: number | undefined
      let refundedAmount: number | undefined
      let chargeId: string | undefined

      if (pagbankData.charges && pagbankData.charges.length > 0) {
        const charge = pagbankData.charges[0]
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
      const updateData: Record<string, any> = {
        status: newStatus,
        pagbankResponse: pagbankData,
      }

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

      // Adiciona entrada de sincronização no histórico
      const syncEntry = {
        receivedAt: new Date().toISOString(),
        notificationType: 'manual_sync',
        previousStatus,
        newStatus,
        payload: pagbankData,
      }

      updateData.webhookHistory = [...(payment.webhookHistory || []), syncEntry]

      // Atualiza o pagamento
      const updatedPayment = await payload.update({
        collection: 'payments',
        id: payment.id,
        data: updateData,
      })

      return Response.json({
        success: true,
        message: 'Pedido sincronizado com sucesso',
        data: {
          paymentId: updatedPayment.id,
          referenceId: updatedPayment.referenceId,
          previousStatus,
          newStatus: updatedPayment.status,
          paidAmount: updatedPayment.paidAmount,
          refundedAmount: updatedPayment.refundedAmount,
        },
      })
    } catch (error) {
      console.error('Erro ao sincronizar pedido:', error)
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
