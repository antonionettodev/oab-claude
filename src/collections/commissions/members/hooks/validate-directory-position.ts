import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

const DIRECTORY_POSITIONS = [
  'presidente',
  'vice-presidente',
  'secretario',
  'secretario-adjunto',
] as const

const POSITION_LABELS: Record<string, string> = {
  presidente: 'Presidente',
  'vice-presidente': 'Vice-Presidente',
  secretario: 'Secretário(a)',
  'secretario-adjunto': 'Secretário(a) Adjunto(a)',
}

export const validateDirectoryPositionHook: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data?.position || !data?.commission) {
    return data
  }

  const position = typeof data.position === 'string' ? data.position : null

  if (!position || !DIRECTORY_POSITIONS.includes(position as any)) {
    return data
  }

  const commissionId =
    typeof data.commission === 'object' && data.commission !== null
      ? data.commission.id
      : data.commission

  const currentDocId = operation === 'update' && originalDoc?.id ? originalDoc.id : null

  const whereConditions: any[] = [
    { position: { equals: position } },
    { commission: { equals: commissionId } },
  ]

  if (currentDocId) {
    whereConditions.push({ id: { not_equals: currentDocId } })
  }

  const existingMembers = await req.payload.find({
    collection: 'commission-members',
    where: { and: whereConditions },
    limit: 1,
  })

  if (existingMembers.docs.length > 0) {
    const positionLabel = POSITION_LABELS[position] || position
    const existingMember = existingMembers.docs[0]

    throw new APIError(
      `Já existe um(a) ${positionLabel} cadastrado(a) para esta comissão${
        existingMember.name ? `: ${existingMember.name}` : ''
      }.`,
      400,
    )
  }

  return data
}
