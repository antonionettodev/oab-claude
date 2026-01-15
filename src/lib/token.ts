import crypto from 'crypto'

/**
 * Gera um token alfanumérico seguro
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

/**
 * Gera uma senha de check-in (6-9 caracteres alfanuméricos maiúsculos)
 */
export const generateCheckinPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = Math.floor(Math.random() * 4) + 6 // 6-9 caracteres
  let password = ''

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}

/**
 * Gera um número de certificado único
 */
export const generateCertificateNumber = (params: {
  eventId: string | number
  year: number
  sequence: number
}): string => {
  const { eventId, year, sequence } = params
  const sequenceStr = sequence.toString().padStart(5, '0')
  return `CERT-${year}-${eventId}-${sequenceStr}`
}

/**
 * Gera um hash para validação de certificado
 */
export const generateCertificateHash = (params: {
  certificateNumber: string
  participantName: string
  eventTitle: string
}): string => {
  const { certificateNumber, participantName, eventTitle } = params
  const data = `${certificateNumber}:${participantName}:${eventTitle}`

  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16).toUpperCase()
}

/**
 * Valida um token de check-in
 */
export const validateCheckinToken = (
  token: string,
  expectedToken: string
): boolean => {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  )
}
