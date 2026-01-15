import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Hook para validar a capacidade do evento antes de criar uma inscrição
 * Verifica se ainda há vagas disponíveis
 */
export const validateEventCapacityHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.event) {
    return data
  }

  const eventId = typeof data.event === 'object' ? data.event.id : data.event

  // Busca o evento
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 0,
  })

  if (!event) {
    throw new Error('Evento não encontrado')
  }

  // Verifica se o evento aceita inscrições
  if (event.status === 'cancelled') {
    throw new Error('Este evento foi cancelado')
  }

  if (event.status === 'closed') {
    throw new Error('Este evento já foi encerrado')
  }

  if (event.status === 'registration-closed') {
    throw new Error('As inscrições para este evento estão encerradas')
  }

  // Verifica limite de inscrições
  if (event.registrationLimit) {
    const registrationCount = await req.payload.count({
      collection: 'registrations',
      where: {
        event: { equals: eventId },
        status: { not_equals: 'cancelled' },
      },
    })

    if (registrationCount.totalDocs >= event.registrationLimit) {
      throw new Error('Este evento atingiu o limite máximo de inscrições')
    }
  }

  // Verifica período de inscrições
  const now = new Date()

  if (event.registrationStartDate) {
    const startDate = new Date(event.registrationStartDate)
    if (now < startDate) {
      throw new Error('As inscrições para este evento ainda não foram abertas')
    }
  }

  if (event.registrationEndDate) {
    const endDate = new Date(event.registrationEndDate)
    if (now > endDate) {
      throw new Error('O prazo de inscrição para este evento já encerrou')
    }
  }

  return data
}
