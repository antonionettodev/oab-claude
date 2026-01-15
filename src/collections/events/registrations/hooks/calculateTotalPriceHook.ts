import type { CollectionBeforeChangeHook } from 'payload'
import { calculateProgressiveDiscount } from '@/lib/discount'

/**
 * Hook para calcular o preço total da inscrição
 * Aplica descontos em grupo quando aplicável
 */
export const calculateTotalPriceHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data?.event || !data?.tickets) {
    return data
  }

  const eventId = typeof data.event === 'object' ? data.event.id : data.event

  // Busca o evento com tipos de ingresso
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 1,
  })

  if (!event || !event.ticketTypes) {
    return data
  }

  let totalPrice = 0
  const ticketCount = data.tickets.length

  // Calcula o preço de cada ingresso
  for (const ticket of data.tickets) {
    const ticketTypeId =
      typeof ticket.ticketType === 'object' ? ticket.ticketType.id : ticket.ticketType

    // Encontra o tipo de ingresso no evento
    const ticketType = event.ticketTypes.find((tt: any) => {
      const categoryId =
        typeof tt.participantCategory === 'object'
          ? tt.participantCategory.id
          : tt.participantCategory
      return categoryId === ticketTypeId || tt.id === ticketTypeId
    })

    if (ticketType) {
      // Verifica se há preço early bird válido
      let price = ticketType.price

      if (ticketType.earlyBirdPrice && ticketType.earlyBirdDeadline) {
        const deadlineDate = new Date(ticketType.earlyBirdDeadline)
        if (new Date() <= deadlineDate) {
          price = ticketType.earlyBirdPrice
        }
      }

      totalPrice += price
      ticket.unitPrice = price
    }
  }

  // Aplica desconto em grupo se habilitado
  if (event.groupDiscountEnabled && event.groupDiscountTiers && ticketCount > 1) {
    const discountResult = calculateProgressiveDiscount({
      ticketQuantity: ticketCount,
      unitPrice: totalPrice / ticketCount,
      tiers: event.groupDiscountTiers,
    })

    if (discountResult.tierApplied) {
      data.subtotal = totalPrice
      data.discountPercent = discountResult.discountPercent
      data.discountAmount = discountResult.discountAmount
      data.totalPrice = discountResult.finalPrice
      data.groupDiscountApplied = true
    } else {
      data.subtotal = totalPrice
      data.totalPrice = totalPrice
      data.discountAmount = 0
      data.groupDiscountApplied = false
    }
  } else {
    data.subtotal = totalPrice
    data.totalPrice = totalPrice
    data.discountAmount = 0
    data.groupDiscountApplied = false
  }

  return data
}
