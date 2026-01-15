import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

const DIRECTORY_POSITIONS = [
  'presidente',
  'vice-presidente',
  'secretario-geral',
  'secretario-geral-adjunto',
  'tesoureiro',
] as const

const POSITION_LABELS: Record<string, string> = {
  presidente: 'Presidente',
  'vice-presidente': 'Vice-Presidente',
  'secretario-geral': 'Secretário(a)-Geral',
  'secretario-geral-adjunto': 'Secretário(a)-Geral Adjunto(a)',
  tesoureiro: 'Tesoureiro(a)',
}

export const validateDirectoryPositionHook: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data?.position || !data?.subsection || !data?.management) {
    return data
  }

  const position = typeof data.position === 'string' ? data.position : null

  if (!position || !DIRECTORY_POSITIONS.includes(position as any)) {
    return data
  }

  const subsectionId =
    typeof data.subsection === 'object' && data.subsection !== null
      ? data.subsection.id
      : data.subsection

  const managementId =
    typeof data.management === 'object' && data.management !== null
      ? data.management.id
      : data.management

  const currentDocId = operation === 'update' && originalDoc?.id ? originalDoc.id : null

  const whereConditions: any[] = [
    { position: { equals: position } },
    { subsection: { equals: subsectionId } },
    { management: { equals: managementId } },
  ]

  if (currentDocId) {
    whereConditions.push({ id: { not_equals: currentDocId } })
  }

  const existingMembers = await req.payload.find({
    collection: 'subsection-members',
    where: {
      and: whereConditions,
    },
    limit: 1,
  })

  if (existingMembers.docs.length > 0) {
    const positionLabel = POSITION_LABELS[position] || position
    const existingMember = existingMembers.docs[0]

    throw new APIError(
      `Já existe um(a) ${positionLabel} cadastrado(a) para esta subseção nesta gestão${
        existingMember.name ? `: ${existingMember.name}` : ''
      }.`,
      400,
    )
  }

  return data
}
