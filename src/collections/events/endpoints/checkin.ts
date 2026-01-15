import type { Endpoint } from 'payload'
import { decodeQRData } from '@/lib/qrcode'

/**
 * Endpoint: Check-in Manual
 *
 * Usado por funcionários para validar check-in em eventos externos.
 * Valida voucher, presença e pagamento.
 *
 * POST /api/events/checkin
 */
export const checkinEndpoint: Endpoint = {
  path: '/checkin',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { registrationId, ticketIndex = 0, method = 'manual' } = body

      if (!registrationId) {
        return Response.json(
          { success: false, error: 'ID da inscrição é obrigatório' },
          { status: 400 },
        )
      }

      // Busca a inscrição
      const registration = await payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 1,
      })

      if (!registration) {
        return Response.json({ success: false, error: 'Inscrição não encontrada' }, { status: 404 })
      }

      // Valida status da inscrição
      if (registration.status === 'cancelled') {
        return Response.json(
          { success: false, error: 'Esta inscrição foi cancelada' },
          { status: 400 },
        )
      }

      // Valida pagamento
      const paidStatuses = ['paid', 'complimentary']
      if (!paidStatuses.includes(registration.paymentStatus)) {
        return Response.json(
          {
            success: false,
            error: 'Check-in não permitido: pagamento não confirmado',
            paymentStatus: registration.paymentStatus,
          },
          { status: 400 },
        )
      }

      // Valida se o ingresso existe
      if (!registration.tickets || !registration.tickets[ticketIndex]) {
        return Response.json({ success: false, error: 'Ingresso não encontrado' }, { status: 404 })
      }

      const ticket = registration.tickets[ticketIndex]

      // Verifica se já fez check-in
      if (ticket.ticketStatus === 'checked-in' || ticket.ticketStatus === 'attended') {
        return Response.json(
          {
            success: false,
            error: 'Check-in já realizado para este ingresso',
            checkinAt: ticket.checkinAt,
          },
          { status: 400 },
        )
      }

      // Cria o registro de check-in
      const checkin = await payload.create({
        collection: 'checkins',
        data: {
          registration: registrationId,
          ticketIndex,
          checkinType: 'manual',
          checkinMethod: method,
          checkinAt: new Date().toISOString(),
          isValid: true,
          voucherValidated: true,
          paymentValidated: true,
          presenceConfirmed: true,
          checkinBy: req.user?.id,
        },
      })

      // Busca dados do evento para gerar o ticket
      const eventId =
        typeof registration.event === 'object' ? registration.event.id : registration.event

      const event = await payload.findByID({
        collection: 'events',
        id: eventId,
        depth: 0,
      })

      return Response.json({
        success: true,
        message: 'Check-in realizado com sucesso',
        data: {
          checkinId: checkin.id,
          participantName: ticket.participantName,
          eventTitle: event?.title,
          checkinAt: checkin.checkinAt,
          ticketNumber: `${registration.registrationCode}-${ticketIndex + 1}`,
        },
      })
    } catch (error) {
      console.error('Erro no check-in:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Endpoint: Check-in Automático (Self Check-in)
 *
 * Usado por participantes para fazer auto check-in em eventos internos.
 * O participante escaneia o QR Code fixo do evento.
 *
 * POST /api/events/self-checkin
 */
export const selfCheckinEndpoint: Endpoint = {
  path: '/self-checkin',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { qrData, registrationId, ticketIndex = 0 } = body

      if (!qrData || !registrationId) {
        return Response.json(
          { success: false, error: 'Dados do QR Code e ID da inscrição são obrigatórios' },
          { status: 400 },
        )
      }

      // Decodifica o QR Code do evento
      let qrInfo
      try {
        qrInfo = decodeQRData(qrData)
      } catch {
        return Response.json({ success: false, error: 'QR Code inválido' }, { status: 400 })
      }

      if (qrInfo.type !== 'event') {
        return Response.json(
          { success: false, error: 'Este QR Code não é de um evento' },
          { status: 400 },
        )
      }

      // Busca a inscrição
      const registration = await payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 1,
      })

      if (!registration) {
        return Response.json({ success: false, error: 'Inscrição não encontrada' }, { status: 404 })
      }

      // Verifica se a inscrição é para o evento do QR Code
      const registrationEventId =
        typeof registration.event === 'object' ? registration.event.id : registration.event

      if (registrationEventId !== qrInfo.eventId) {
        return Response.json(
          { success: false, error: 'Esta inscrição não é para este evento' },
          { status: 400 },
        )
      }

      // Busca o evento para validar a senha
      const event = await payload.findByID({
        collection: 'events',
        id: qrInfo.eventId,
        depth: 0,
      })

      if (!event) {
        return Response.json({ success: false, error: 'Evento não encontrado' }, { status: 404 })
      }

      // Valida a senha de check-in
      if (event.checkinPassword !== qrInfo.checkinPassword) {
        return Response.json(
          { success: false, error: 'QR Code expirado ou inválido' },
          { status: 400 },
        )
      }

      // Valida status da inscrição
      if (registration.status === 'cancelled') {
        return Response.json(
          { success: false, error: 'Esta inscrição foi cancelada' },
          { status: 400 },
        )
      }

      // Valida pagamento
      const paidStatuses = ['paid', 'complimentary']
      if (!paidStatuses.includes(registration.paymentStatus)) {
        return Response.json(
          {
            success: false,
            error: 'Check-in não permitido: pagamento não confirmado',
            paymentStatus: registration.paymentStatus,
          },
          { status: 400 },
        )
      }

      // Valida ingresso
      if (!registration.tickets || !registration.tickets[ticketIndex]) {
        return Response.json({ success: false, error: 'Ingresso não encontrado' }, { status: 404 })
      }

      const ticket = registration.tickets[ticketIndex]

      if (ticket.ticketStatus === 'checked-in' || ticket.ticketStatus === 'attended') {
        return Response.json(
          {
            success: false,
            error: 'Check-in já realizado',
            checkinAt: ticket.checkinAt,
          },
          { status: 400 },
        )
      }

      // Cria o registro de check-in
      const checkin = await payload.create({
        collection: 'checkins',
        data: {
          registration: registrationId,
          ticketIndex,
          checkinType: 'automatic',
          checkinMethod: 'qr-code',
          checkinAt: new Date().toISOString(),
          isValid: true,
          paymentValidated: true,
          presenceConfirmed: true,
          qrCodeData: qrData,
        },
      })

      return Response.json({
        success: true,
        message: 'Check-in realizado com sucesso!',
        data: {
          checkinId: checkin.id,
          participantName: ticket.participantName,
          eventTitle: event.title,
          checkinAt: checkin.checkinAt,
        },
      })
    } catch (error) {
      console.error('Erro no self check-in:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
        },
        { status: 500 },
      )
    }
  },
}
