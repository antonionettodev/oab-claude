import type { Endpoint } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL || 'https://sandbox.api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

/**
 * Endpoint: Consultar Pedido no PagBank
 *
 * Consulta o status de um pedido na API do PagBank e atualiza os dados localmente.
 *
 * GET /api/payments/get-order/:orderId
 *
 * O orderId pode ser:
 * - O ID do PagBank (ORDE_XXXXXXXXXXXX)
 * - O reference_id interno
 * - O ID do registro no banco local
 */
export const getOrderEndpoint: Endpoint = {
  path: '/get-order/:orderId',
  method: 'get',
  handler: async (req) => {
    const { payload, routeParams } = req

    try {
      const orderId = routeParams?.orderId as string | undefined

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

      // Primeiro, tenta encontrar o pagamento no banco local
      let payment = null
      let pagbankOrderId = orderId

      // Se o orderId começa com ORDE_, é um ID do PagBank
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
        // Tenta buscar por reference_id ou ID local
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
          // Tenta buscar por ID local
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

      if (payment && payment.pagbankOrderId) {
        pagbankOrderId = payment.pagbankOrderId
      } else if (!orderId.startsWith('ORDE_')) {
        return Response.json(
          { success: false, error: 'Pedido não encontrado' },
          { status: 404 }
        )
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
        console.error('Erro PagBank:', pagbankData)
        return Response.json(
          {
            success: false,
            error: 'Erro ao consultar pedido no PagBank',
            details: pagbankData,
          },
          { status: pagbankResponse.status }
        )
      }

      // Mapeia o status do PagBank para o status local
      const mapPagBankStatus = (charges: Array<{ status?: string }>): string => {
        if (!charges || charges.length === 0) {
          return 'pending'
        }

        const charge = charges[0]
        const status = charge.status?.toLowerCase()

        const statusMap: Record<string, string> = {
          authorized: 'authorized',
          paid: 'paid',
          available: 'available',
          in_dispute: 'in_dispute',
          refunded: 'refunded',
          canceled: 'canceled',
          declined: 'declined',
          waiting: 'waiting_payment',
          in_analysis: 'in_analysis',
        }

        return statusMap[status || ''] || 'pending'
      }

      const newStatus = mapPagBankStatus(pagbankData.charges)

      // Atualiza o pagamento local se existir
      if (payment) {
        const previousStatus = payment.status

        // Só atualiza se o status mudou
        if (previousStatus !== newStatus) {
          const updateData: Record<string, unknown> = {
            status: newStatus,
            pagbankResponse: pagbankData,
          }

          // Se foi pago, atualiza a data de pagamento
          if (newStatus === 'paid' && !payment.paymentDate) {
            updateData.paymentDate = new Date().toISOString()
          }

          // Se há charges, atualiza o valor pago
          if (pagbankData.charges && pagbankData.charges.length > 0) {
            const charge = pagbankData.charges[0]
            if (charge.amount?.summary?.paid) {
              updateData.paidAmount = charge.amount.summary.paid
            }
            if (charge.amount?.summary?.refunded) {
              updateData.refundedAmount = charge.amount.summary.refunded
            }
          }

          payment = await payload.update({
            collection: 'payments',
            id: payment.id,
            data: updateData,
          })
        }
      }

      return Response.json({
        success: true,
        data: {
          localPayment: payment
            ? {
                id: payment.id,
                referenceId: payment.referenceId,
                status: payment.status,
                totalAmount: payment.totalAmount,
                paidAmount: payment.paidAmount,
                paymentMethod: payment.paymentMethod,
                paymentDate: payment.paymentDate,
              }
            : null,
          pagbankOrder: {
            id: pagbankData.id,
            reference_id: pagbankData.reference_id,
            created_at: pagbankData.created_at,
            customer: pagbankData.customer,
            items: pagbankData.items,
            charges: pagbankData.charges,
            qr_codes: pagbankData.qr_codes,
            notification_urls: pagbankData.notification_urls,
          },
        },
      })
    } catch (error) {
      console.error('Erro ao consultar pedido:', error)
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
