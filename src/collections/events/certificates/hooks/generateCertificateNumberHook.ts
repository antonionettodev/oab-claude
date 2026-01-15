import type { FieldHook } from 'payload'
import { generateCertificateNumber, generateCertificateHash } from '@/lib/token'

/**
 * Hook para gerar número único do certificado
 */
export const generateCertificateNumberHook: FieldHook = async ({ value, operation, data, req }) => {
  // Mantém o valor existente se não for criação
  if (value && operation !== 'create') {
    return value
  }

  if (!data?.event) {
    return value
  }

  const eventId = typeof data.event === 'object' ? data.event.id : data.event
  const year = new Date().getFullYear()

  // Conta certificados existentes para este evento no ano atual
  const existingCount = await req.payload.count({
    collection: 'certificates',
    where: {
      event: { equals: eventId },
      createdAt: {
        greater_than_equal: `${year}-01-01`,
        less_than: `${year + 1}-01-01`,
      },
    },
  })

  const sequence = existingCount.totalDocs + 1

  return generateCertificateNumber({
    eventId,
    year,
    sequence,
  })
}

/**
 * Hook para gerar hash de validação do certificado
 */
export const generateCertificateHashHook: FieldHook = ({ value, operation, data }) => {
  // Mantém o valor existente se não for criação
  if (value && operation !== 'create') {
    return value
  }

  if (!data?.certificateNumber || !data?.participantName || !data?.eventTitle) {
    return value
  }

  return generateCertificateHash({
    certificateNumber: data.certificateNumber,
    participantName: data.participantName,
    eventTitle: data.eventTitle,
  })
}
