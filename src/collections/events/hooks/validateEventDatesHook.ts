import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Hook para validar datas do evento
 * - Data de início deve ser anterior à data de término
 * - Data de início deve ser no futuro para novos eventos
 */
export const validateEventDatesHook: CollectionBeforeValidateHook = async ({
  data,
  operation,
}) => {
  if (!data) return data

  const { startDate, endDate } = data

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      throw new Error('A data de início deve ser anterior à data de término')
    }
  }

  // Validação apenas para novos eventos
  if (operation === 'create' && startDate) {
    const start = new Date(startDate)
    const now = new Date()

    // Remove horas para comparar apenas datas
    start.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    if (start < now) {
      throw new Error('A data de início deve ser no futuro')
    }
  }

  return data
}
