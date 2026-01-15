import type { Endpoint } from 'payload'
import { decodeQRData } from '@/lib/qrcode'

/**
 * Endpoint: Validar QR Code de Ingresso
 *
 * Valida um QR Code individual de ingresso (eventos externos).
 * Retorna informações do participante e status do ingresso.
 *
 * POST /api/events/validate-qrcode
 */
export const validateQRCodeEndpoint: Endpoint = {
  path: '/validate-qrcode',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { qrData } = body

      if (!qrData) {
        return Response.json(
          { success: false, error: 'Dados do QR Code são obrigatórios' },
          { status: 400 },
        )
      }

      // Decodifica o QR Code
      let qrInfo
      try {
        qrInfo = decodeQRData(qrData)
      } catch {
        return Response.json(
          { success: false, error: 'QR Code inválido ou corrompido' },
          { status: 400 },
        )
      }

      // QR Code de ingresso individual
      if (qrInfo.type === 'ticket') {
        const { registrationId, ticketId, eventId, token } = qrInfo

        // Busca a inscrição
        const registration = await payload.findByID({
          collection: 'registrations',
          id: registrationId as string,
          depth: 1,
        })

        if (!registration) {
          return Response.json(
            { success: false, error: 'Inscrição não encontrada', valid: false },
            { status: 404 },
          )
        }

        // Encontra o ingresso pelo ticketId ou token
        const ticketIndex = registration.tickets?.findIndex(
          (t: any) =>
            t.id === ticketId ||
            t.token === token ||
            `${registrationId}-${registration.tickets.indexOf(t)}` === ticketId,
        )

        if (ticketIndex === undefined || ticketIndex === -1 || !registration.tickets) {
          return Response.json(
            { success: false, error: 'Ingresso não encontrado', valid: false },
            { status: 404 },
          )
        }

        const ticket = registration.tickets[ticketIndex]

        // Valida o token
        if (ticket.token && ticket.token !== token) {
          return Response.json(
            { success: false, error: 'Token inválido', valid: false },
            { status: 400 },
          )
        }

        // Busca o evento
        const event = await payload.findByID({
          collection: 'events',
          id: eventId as string,
          depth: 0,
        })

        // Verifica status do pagamento
        const isPaid = ['paid', 'complimentary'].includes(registration.paymentStatus)

        // Verifica se já fez check-in
        const alreadyCheckedIn =
          ticket.ticketStatus === 'checked-in' || ticket.ticketStatus === 'attended'

        return Response.json({
          success: true,
          valid: isPaid && !alreadyCheckedIn && registration.status !== 'cancelled',
          data: {
            registrationId,
            registrationCode: registration.registrationCode,
            ticketIndex,
            participant: {
              name: ticket.participantName,
              cpf: ticket.participantCPF,
              email: ticket.participantEmail,
              oab: ticket.participantOAB,
            },
            event: {
              id: eventId,
              title: event?.title,
              date: event?.startDate,
            },
            status: {
              registration: registration.status,
              payment: registration.paymentStatus,
              ticket: ticket.ticketStatus,
              isPaid,
              alreadyCheckedIn,
              canCheckin: isPaid && !alreadyCheckedIn && registration.status !== 'cancelled',
            },
            checkinAt: ticket.checkinAt,
          },
        })
      }

      // QR Code do evento (para eventos internos)
      if (qrInfo.type === 'event') {
        const { eventId, checkinPassword } = qrInfo

        // Busca o evento
        const event = await payload.findByID({
          collection: 'events',
          id: eventId as string,
          depth: 0,
        })

        if (!event) {
          return Response.json(
            { success: false, error: 'Evento não encontrado', valid: false },
            { status: 404 },
          )
        }

        // Valida a senha
        const isValidPassword = event.checkinPassword === checkinPassword

        return Response.json({
          success: true,
          valid: isValidPassword && event.status !== 'cancelled',
          type: 'event',
          data: {
            eventId,
            eventTitle: event.title,
            eventType: event.eventType,
            status: event.status,
            isValidPassword,
            message: isValidPassword
              ? 'QR Code do evento válido. Insira o ID da sua inscrição para fazer check-in.'
              : 'QR Code expirado ou inválido',
          },
        })
      }

      return Response.json(
        { success: false, error: 'Tipo de QR Code não reconhecido', valid: false },
        { status: 400 },
      )
    } catch (error) {
      console.error('Erro ao validar QR Code:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
          valid: false,
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Endpoint: Buscar Inscrição para Check-in
 *
 * Busca uma inscrição por código, CPF ou nome para check-in manual.
 *
 * GET /api/events/search-registration
 */
export const searchRegistrationEndpoint: Endpoint = {
  path: '/search-registration',
  method: 'get',
  handler: async (req) => {
    const { payload } = req

    try {
      const url = new URL(req.url || '', 'http://localhost')
      const eventId = url.searchParams.get('eventId')
      const query = url.searchParams.get('q')

      if (!eventId) {
        return Response.json(
          { success: false, error: 'ID do evento é obrigatório' },
          { status: 400 },
        )
      }

      if (!query || query.length < 3) {
        return Response.json(
          { success: false, error: 'Termo de busca deve ter pelo menos 3 caracteres' },
          { status: 400 },
        )
      }

      // Busca inscrições pelo código, CPF ou nome
      const registrations = await payload.find({
        collection: 'registrations',
        where: {
          event: { equals: eventId },
          status: { not_equals: 'cancelled' },
          or: [
            { registrationCode: { contains: query } },
            { registrantCPF: { contains: query.replace(/\D/g, '') } },
            { registrantName: { contains: query } },
            { 'tickets.participantCPF': { contains: query.replace(/\D/g, '') } },
            { 'tickets.participantName': { contains: query } },
          ],
        },
        limit: 10,
        depth: 0,
      })

      const results = registrations.docs.map((reg: any) => ({
        id: reg.id,
        registrationCode: reg.registrationCode,
        registrantName: reg.registrantName,
        registrantCPF: reg.registrantCPF,
        ticketCount: reg.tickets?.length || 0,
        paymentStatus: reg.paymentStatus,
        status: reg.status,
        tickets: reg.tickets?.map((t: any, index: number) => ({
          index,
          name: t.participantName,
          cpf: t.participantCPF,
          status: t.ticketStatus,
          checkedIn: t.ticketStatus === 'checked-in' || t.ticketStatus === 'attended',
        })),
      }))

      return Response.json({
        success: true,
        count: results.length,
        data: results,
      })
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error)
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
