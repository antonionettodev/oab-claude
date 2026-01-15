import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Hook para atualizar automaticamente o status do evento
 * - Fecha eventos cuja data de término já passou
 */
export const updateEventStatusHook: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  // Não altera status se já foi cancelado manualmente
  if (data.status === 'cancelled' || originalDoc?.status === 'cancelled') {
    return data
  }

  const endDate = data.endDate || originalDoc?.endDate

  if (endDate) {
    const end = new Date(endDate)
    const now = new Date()

    // Se o evento já terminou, marca como encerrado
    if (end < now && data.status !== 'closed') {
      data.status = 'closed'
    }
  }

  return data
}
