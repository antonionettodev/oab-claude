/**
 * Utilitários de validação para o módulo de eventos
 */

/**
 * Valida se um CPF é válido
 */
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '')

  if (cleanCPF.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false

  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de telefone brasileiro
 */
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

/**
 * Valida formato de número OAB
 */
export const validateOABNumber = (oab: string): boolean => {
  // Formato: UF + número (ex: SC12345, SP123456)
  const oabRegex = /^[A-Z]{2}\d{4,6}$/i
  return oabRegex.test(oab.replace(/\s/g, ''))
}

/**
 * Verifica se uma data está no futuro
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}

/**
 * Verifica se uma data está no passado
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

/**
 * Verifica se o prazo de reembolso ainda é válido
 */
export const isRefundDeadlineValid = (params: {
  eventStartDate: Date | string
  refundDeadlineDays: number
}): boolean => {
  const { eventStartDate, refundDeadlineDays } = params
  const eventDate =
    typeof eventStartDate === 'string'
      ? new Date(eventStartDate)
      : eventStartDate

  const deadlineDate = new Date(eventDate)
  deadlineDate.setDate(deadlineDate.getDate() - refundDeadlineDays)

  return new Date() < deadlineDate
}

/**
 * Verifica conflito de horários
 */
export const hasTimeConflict = (params: {
  start1: string // formato HH:mm
  end1: string
  start2: string
  end2: string
}): boolean => {
  const { start1, end1, start2, end2 } = params

  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const s1 = toMinutes(start1)
  const e1 = toMinutes(end1)
  const s2 = toMinutes(start2)
  const e2 = toMinutes(end2)

  // Verifica sobreposição
  return s1 < e2 && s2 < e1
}

/**
 * Verifica se dois períodos de datas se sobrepõem
 */
export const hasDateOverlap = (params: {
  start1: Date | string
  end1: Date | string
  start2: Date | string
  end2: Date | string
}): boolean => {
  const toDate = (d: Date | string) => (typeof d === 'string' ? new Date(d) : d)

  const s1 = toDate(params.start1).getTime()
  const e1 = toDate(params.end1).getTime()
  const s2 = toDate(params.start2).getTime()
  const e2 = toDate(params.end2).getTime()

  return s1 <= e2 && s2 <= e1
}
