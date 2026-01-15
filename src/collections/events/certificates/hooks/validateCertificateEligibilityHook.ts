import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Hook para validar elegibilidade para emissão de certificado
 * - Verifica se o evento emite certificado
 * - Verifica se a inscrição é válida
 * - Verifica se a presença está registrada
 * - Verifica se o pagamento foi confirmado
 */
export const validateCertificateEligibilityHook: CollectionBeforeChangeHook = async ({
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
    throw new Error('Certificado não pode ser emitido: pagamento não confirmado')
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

  // Verifica se o evento emite certificado
  if (!event.hasCertificate) {
    throw new Error('Este evento não emite certificado')
  }

  // Verifica presença (baseado no status da inscrição ou check-in)
  const presenceStatuses = ['checked-in', 'attended', 'partial-checkin']
  if (!presenceStatuses.includes(registration.status)) {
    throw new Error('Certificado não pode ser emitido: presença não registrada')
  }

  // Verifica se já existe certificado emitido para este participante
  const ticketIndex = data.ticketIndex || 0
  const existingCertificate = await req.payload.find({
    collection: 'certificates',
    where: {
      registration: { equals: registrationId },
      ticketIndex: { equals: ticketIndex },
    },
    limit: 1,
  })

  if (existingCertificate.totalDocs > 0) {
    // Verifica se permite segunda via
    if (!event.allowDuplicateCertificate) {
      throw new Error('Este evento não permite emissão de segunda via do certificado')
    }

    // Se permite, marca como segunda via
    data.isDuplicate = true
    data.originalCertificateId = existingCertificate.docs[0].id
  }

  // Adiciona dados do evento ao certificado
  data.event = eventId
  data.eventTitle = event.title
  data.eventStartDate = event.startDate
  data.eventEndDate = event.endDate
  data.workload = event.workload

  // Adiciona dados do participante
  const participant = registration.tickets?.[ticketIndex]
  if (participant) {
    data.participantName = participant.participantName
    data.participantCPF = participant.participantCPF
    data.participantEmail = participant.participantEmail
  } else {
    data.participantName = registration.registrantName
    data.participantCPF = registration.registrantCPF
    data.participantEmail = registration.registrantEmail
  }

  return data
}
