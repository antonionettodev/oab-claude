import type { CollectionAfterChangeHook } from 'payload'

/**
 * Hook para atualizar o status do ingresso após check-in
 */
export const updateTicketStatusHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create' || !doc.registration) {
    return doc
  }

  const registrationId =
    typeof doc.registration === 'object' ? doc.registration.id : doc.registration

  try {
    // Busca a inscrição
    const registration = await req.payload.findByID({
      collection: 'registrations',
      id: registrationId,
      depth: 0,
    })

    if (!registration || !registration.tickets) {
      return doc
    }

    // Atualiza o status do ingresso específico
    const ticketIndex = doc.ticketIndex || 0
    const updatedTickets = [...registration.tickets]

    if (updatedTickets[ticketIndex]) {
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        ticketStatus: 'checked-in',
        checkinAt: doc.checkinAt || new Date().toISOString(),
        checkinBy: doc.checkinBy || req.user?.id,
      }
    }

    // Verifica se todos os ingressos fizeram check-in
    const allCheckedIn = updatedTickets.every(
      (ticket: any) => ticket.ticketStatus === 'checked-in' || ticket.ticketStatus === 'attended'
    )

    const someCheckedIn = updatedTickets.some(
      (ticket: any) => ticket.ticketStatus === 'checked-in' || ticket.ticketStatus === 'attended'
    )

    // Determina o status da inscrição
    let registrationStatus = registration.status
    if (allCheckedIn) {
      registrationStatus = 'checked-in'
    } else if (someCheckedIn) {
      registrationStatus = 'partial-checkin'
    }

    // Atualiza a inscrição
    await req.payload.update({
      collection: 'registrations',
      id: registrationId,
      data: {
        tickets: updatedTickets,
        status: registrationStatus,
      },
      depth: 0,
    })
  } catch (error) {
    console.error('Erro ao atualizar status do ingresso:', error)
  }

  return doc
}
