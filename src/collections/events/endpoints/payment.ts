import type { Endpoint } from 'payload'

/**
 * Endpoint: Validar Status de Pagamento
 *
 * Verifica o status de pagamento de uma inscrição.
 *
 * GET /api/events/validate-payment/:registrationId
 */
export const validatePaymentEndpoint: Endpoint = {
  path: '/validate-payment/:registrationId',
  method: 'get',
  handler: async (req) => {
    const { payload, routeParams } = req

    try {
      const registrationId = routeParams?.registrationId

      if (!registrationId) {
        return Response.json(
          { success: false, error: 'ID da inscrição é obrigatório' },
          { status: 400 }
        )
      }

      // Busca a inscrição
      const registration = await payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 1,
      })

      if (!registration) {
        return Response.json(
          { success: false, error: 'Inscrição não encontrada' },
          { status: 404 }
        )
      }

      const isPaid = ['paid', 'complimentary'].includes(registration.paymentStatus)

      return Response.json({
        success: true,
        data: {
          registrationId,
          registrationCode: registration.registrationCode,
          paymentStatus: registration.paymentStatus,
          isPaid,
          totalPrice: registration.totalPrice,
          paymentMethod: registration.paymentMethod,
          paymentDate: registration.paymentDate,
          paymentReference: registration.paymentReference,
          canCheckin: isPaid && registration.status !== 'cancelled',
        },
      })
    } catch (error) {
      console.error('Erro ao validar pagamento:', error)
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
 * Endpoint: Atualizar Status de Pagamento
 *
 * Atualiza o status de pagamento de uma inscrição (webhook de gateway de pagamento).
 *
 * POST /api/events/update-payment
 */
export const updatePaymentEndpoint: Endpoint = {
  path: '/update-payment',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const {
        registrationId,
        registrationCode,
        paymentStatus,
        paymentReference,
        paymentMethod,
        paymentDate,
      } = body

      if (!registrationId && !registrationCode) {
        return Response.json(
          { success: false, error: 'ID ou código da inscrição é obrigatório' },
          { status: 400 }
        )
      }

      if (!paymentStatus) {
        return Response.json(
          { success: false, error: 'Status do pagamento é obrigatório' },
          { status: 400 }
        )
      }

      // Valida o status
      const validStatuses = [
        'pending',
        'processing',
        'paid',
        'failed',
        'refunded',
        'cancelled',
        'complimentary',
      ]
      if (!validStatuses.includes(paymentStatus)) {
        return Response.json(
          { success: false, error: 'Status de pagamento inválido' },
          { status: 400 }
        )
      }

      // Busca a inscrição
      let registration
      if (registrationId) {
        registration = await payload.findByID({
          collection: 'registrations',
          id: registrationId,
          depth: 0,
        })
      } else {
        const results = await payload.find({
          collection: 'registrations',
          where: {
            registrationCode: { equals: registrationCode },
          },
          limit: 1,
        })
        registration = results.docs[0]
      }

      if (!registration) {
        return Response.json(
          { success: false, error: 'Inscrição não encontrada' },
          { status: 404 }
        )
      }

      // Prepara os dados de atualização
      const updateData: Record<string, any> = {
        paymentStatus,
      }

      if (paymentReference) {
        updateData.paymentReference = paymentReference
      }

      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod
      }

      if (paymentDate) {
        updateData.paymentDate = paymentDate
      } else if (paymentStatus === 'paid') {
        updateData.paymentDate = new Date().toISOString()
      }

      // Se o pagamento foi confirmado, atualiza o status da inscrição
      if (paymentStatus === 'paid' || paymentStatus === 'complimentary') {
        if (registration.status === 'pending') {
          updateData.status = 'confirmed'
        }
      }

      // Atualiza a inscrição
      const updatedRegistration = await payload.update({
        collection: 'registrations',
        id: registration.id,
        data: updateData,
      })

      return Response.json({
        success: true,
        message: 'Pagamento atualizado com sucesso',
        data: {
          registrationId: updatedRegistration.id,
          registrationCode: updatedRegistration.registrationCode,
          paymentStatus: updatedRegistration.paymentStatus,
          status: updatedRegistration.status,
        },
      })
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error)
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
 * Endpoint: Solicitar Reembolso
 *
 * Processa solicitação de reembolso de uma inscrição.
 *
 * POST /api/events/request-refund
 */
export const requestRefundEndpoint: Endpoint = {
  path: '/request-refund',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { registrationId, reason } = body

      if (!registrationId) {
        return Response.json(
          { success: false, error: 'ID da inscrição é obrigatório' },
          { status: 400 }
        )
      }

      // Busca a inscrição com o evento
      const registration = await payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 1,
      })

      if (!registration) {
        return Response.json(
          { success: false, error: 'Inscrição não encontrada' },
          { status: 404 }
        )
      }

      // Verifica se o pagamento foi feito
      if (registration.paymentStatus !== 'paid') {
        return Response.json(
          { success: false, error: 'Esta inscrição não possui pagamento para reembolso' },
          { status: 400 }
        )
      }

      // Busca o evento para verificar o prazo de reembolso
      const eventId =
        typeof registration.event === 'object'
          ? registration.event.id
          : registration.event

      const event = await payload.findByID({
        collection: 'events',
        id: eventId,
        depth: 0,
      })

      if (!event) {
        return Response.json(
          { success: false, error: 'Evento não encontrado' },
          { status: 404 }
        )
      }

      // Verifica o prazo de reembolso
      const refundDeadlineDays = event.refundDeadlineDays || 7
      const eventStartDate = new Date(event.startDate)
      const deadlineDate = new Date(eventStartDate)
      deadlineDate.setDate(deadlineDate.getDate() - refundDeadlineDays)

      const now = new Date()
      if (now > deadlineDate) {
        const daysUntilEvent = Math.ceil(
          (eventStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
        return Response.json(
          {
            success: false,
            error: `Prazo para reembolso expirado. O prazo era de ${refundDeadlineDays} dias antes do evento.`,
            daysUntilEvent,
            refundDeadlineDays,
          },
          { status: 400 }
        )
      }

      // Atualiza a inscrição para reembolso pendente
      const updatedRegistration = await payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          paymentStatus: 'refunded',
          status: 'cancelled',
          adminNotes: `${registration.adminNotes || ''}\n\n[${new Date().toISOString()}] Solicitação de reembolso: ${reason || 'Não informado'}`.trim(),
        },
      })

      return Response.json({
        success: true,
        message: 'Solicitação de reembolso registrada com sucesso',
        data: {
          registrationId: updatedRegistration.id,
          registrationCode: updatedRegistration.registrationCode,
          totalPrice: updatedRegistration.totalPrice,
          status: updatedRegistration.status,
          paymentStatus: updatedRegistration.paymentStatus,
        },
      })
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error)
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
