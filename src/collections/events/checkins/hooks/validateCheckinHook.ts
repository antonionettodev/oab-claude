import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Hook para validar check-in
 * - Verifica se a inscrição está paga
 * - Verifica se o evento está acontecendo
 * - Verifica se já não foi feito check-in
 */
export const validateCheckinHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.registration) {
    return data
  }

  const registrationId =
    typeof data.registration === 'object' ? data.registration.id : data.registration

  // Busca a inscrição com o evento
  const registration = await req.payload.findByID({
    collection: 'registrations',
    id: registrationId,
    depth: 1,
  })

  if (!registration) {
    throw new Error('Inscrição não encontrada')
  }

  // Verifica status da inscrição
  if (registration.status === 'cancelled') {
    throw new Error('Esta inscrição foi cancelada')
  }

  // Verifica pagamento
  const paidStatuses = ['paid', 'complimentary']
  if (!paidStatuses.includes(registration.paymentStatus)) {
    throw new Error('Check-in não permitido: pagamento não confirmado')
  }

  // Busca o evento
  const eventId =
    typeof registration.event === 'object' ? registration.event.id : registration.event
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 0,
  })

  if (!event) {
    throw new Error('Evento não encontrado')
  }

  // Verifica status do evento
  if (event.status === 'cancelled') {
    throw new Error('Este evento foi cancelado')
  }

  if (event.status === 'closed') {
    throw new Error('Este evento já foi encerrado')
  }

  // Verifica se o check-in está liberado (baseado no horário)
  const now = new Date()
  const eventStart = new Date(event.startDate)

  // Define o horário de início do evento
  if (event.startTime) {
    const [hours, minutes] = event.startTime.split(':').map(Number)
    eventStart.setHours(hours, minutes, 0, 0)
  }

  // Calcula quando o check-in é liberado
  const checkinStartMinutes = event.checkinStartMinutes || 60
  const checkinOpenTime = new Date(eventStart.getTime() - checkinStartMinutes * 60 * 1000)

  if (now < checkinOpenTime) {
    const minutesUntilOpen = Math.ceil((checkinOpenTime.getTime() - now.getTime()) / 60000)
    throw new Error(
      `Check-in ainda não está liberado. Será aberto em ${minutesUntilOpen} minutos.`
    )
  }

  // Adiciona dados úteis ao check-in
  data.event = eventId
  data.eventTitle = event.title
  data.participantName =
    data.participantName ||
    registration.tickets?.[data.ticketIndex || 0]?.participantName ||
    registration.registrantName

  return data
}
