import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Hook para atualizar o contador de inscrições do evento
 */
export const updateEventRegistrationCountHook: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (!doc.event) return doc

  const eventId = typeof doc.event === 'object' ? doc.event.id : doc.event

  try {
    // Conta inscrições ativas (não canceladas)
    const count = await req.payload.count({
      collection: 'registrations',
      where: {
        event: { equals: eventId },
        status: { not_equals: 'cancelled' },
      },
    })

    // Atualiza o contador no evento
    await req.payload.update({
      collection: 'events',
      id: eventId,
      data: {
        registrationCount: count.totalDocs,
      },
      depth: 0,
    })
  } catch (error) {
    console.error('Erro ao atualizar contador de inscrições:', error)
  }

  return doc
}

/**
 * Hook para atualizar contador após exclusão de inscrição
 */
export const updateEventRegistrationCountAfterDeleteHook: CollectionAfterDeleteHook =
  async ({ doc, req }) => {
    if (!doc.event) return

    const eventId = typeof doc.event === 'object' ? doc.event.id : doc.event

    try {
      const count = await req.payload.count({
        collection: 'registrations',
        where: {
          event: { equals: eventId },
          status: { not_equals: 'cancelled' },
        },
      })

      await req.payload.update({
        collection: 'events',
        id: eventId,
        data: {
          registrationCount: count.totalDocs,
        },
        depth: 0,
      })
    } catch (error) {
      console.error('Erro ao atualizar contador de inscrições:', error)
    }
  }
