export type DiscountConfig = {
  type: 'percentage' | 'fixed'
  value: number
  minQuantity: number
  maxQuantity?: number
}

export type ProgressiveDiscountTier = {
  minQuantity: number
  maxQuantity?: number
  discountPercent: number
}

/**
 * Calcula o desconto em grupo baseado na quantidade de ingressos
 */
export const calculateGroupDiscount = (params: {
  ticketQuantity: number
  totalPrice: number
  discountConfig: DiscountConfig | null
}): {
  originalPrice: number
  discountAmount: number
  finalPrice: number
  discountApplied: boolean
} => {
  const { ticketQuantity, totalPrice, discountConfig } = params

  const result = {
    originalPrice: totalPrice,
    discountAmount: 0,
    finalPrice: totalPrice,
    discountApplied: false,
  }

  if (!discountConfig) {
    return result
  }

  const { type, value, minQuantity, maxQuantity } = discountConfig

  // Verifica se a quantidade está dentro do range para desconto
  if (ticketQuantity < minQuantity) {
    return result
  }

  if (maxQuantity && ticketQuantity > maxQuantity) {
    return result
  }

  // Calcula o desconto
  if (type === 'percentage') {
    result.discountAmount = totalPrice * (value / 100)
  } else if (type === 'fixed') {
    result.discountAmount = value * ticketQuantity
  }

  result.finalPrice = Math.max(0, totalPrice - result.discountAmount)
  result.discountApplied = result.discountAmount > 0

  return result
}

/**
 * Calcula desconto progressivo por quantidade
 * Quanto mais ingressos, maior o desconto
 */
export const calculateProgressiveDiscount = (params: {
  ticketQuantity: number
  unitPrice: number
  tiers: ProgressiveDiscountTier[]
}): {
  originalPrice: number
  discountPercent: number
  discountAmount: number
  finalPrice: number
  tierApplied: ProgressiveDiscountTier | null
} => {
  const { ticketQuantity, unitPrice, tiers } = params
  const originalPrice = ticketQuantity * unitPrice

  const result = {
    originalPrice,
    discountPercent: 0,
    discountAmount: 0,
    finalPrice: originalPrice,
    tierApplied: null as ProgressiveDiscountTier | null,
  }

  if (!tiers || tiers.length === 0) {
    return result
  }

  // Ordena os tiers por minQuantity decrescente para encontrar o maior aplicável
  const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity)

  for (const tier of sortedTiers) {
    if (ticketQuantity >= tier.minQuantity) {
      if (!tier.maxQuantity || ticketQuantity <= tier.maxQuantity) {
        result.tierApplied = tier
        result.discountPercent = tier.discountPercent
        result.discountAmount = originalPrice * (tier.discountPercent / 100)
        result.finalPrice = originalPrice - result.discountAmount
        break
      }
    }
  }

  return result
}

/**
 * Formata valor monetário em BRL
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
