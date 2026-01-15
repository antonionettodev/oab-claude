import type { CollectionBeforeChangeHook } from 'payload'
import { hasTimeConflict } from '@/lib/validation'

/**
 * Hook para validar a seleção de salas em eventos com múltiplas salas
 * - Verifica se o participante selecionou uma sala por horário
 * - Verifica conflitos de horários
 * - Verifica capacidade das salas
 */
export const validateRoomSelectionHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.event || !data?.roomSelections) {
    return data
  }

  const eventId = typeof data.event === 'object' ? data.event.id : data.event

  // Busca o evento com as salas
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 2,
  })

  if (!event || !event.hasMultipleRooms || !event.rooms) {
    return data
  }

  const roomSelections = data.roomSelections || []

  // Valida conflitos de horários nas seleções do participante
  for (let i = 0; i < roomSelections.length; i++) {
    for (let j = i + 1; j < roomSelections.length; j++) {
      const selection1 = roomSelections[i]
      const selection2 = roomSelections[j]

      // Se são no mesmo dia, verifica conflito de horário
      if (selection1.date === selection2.date) {
        if (
          hasTimeConflict({
            start1: selection1.startTime,
            end1: selection1.endTime,
            start2: selection2.startTime,
            end2: selection2.endTime,
          })
        ) {
          throw new Error(
            `Conflito de horários: você selecionou atividades que se sobrepõem no dia ${selection1.date}`,
          )
        }
      }
    }
  }

  // Valida capacidade de cada sala selecionada
  for (const selection of roomSelections) {
    const room = event.rooms.find(
      (r: any) => r.id === selection.roomId || r.name === selection.roomName,
    )

    if (!room) {
      throw new Error(`Sala não encontrada: ${selection.roomName || selection.roomId}`)
    }

    // Conta quantas pessoas já selecionaram esta sala neste horário
    const existingSelections = await req.payload.find({
      collection: 'registrations',
      where: {
        event: { equals: eventId },
        status: { not_equals: 'cancelled' },
        'roomSelections.roomId': { equals: selection.roomId },
        'roomSelections.date': { equals: selection.date },
        'roomSelections.startTime': { equals: selection.startTime },
      },
      limit: 0,
    })

    if (existingSelections.totalDocs >= room.capacity) {
      throw new Error(
        `A sala "${room.name}" atingiu a capacidade máxima para o horário ${selection.startTime} do dia ${selection.date}`,
      )
    }
  }

  return data
}
