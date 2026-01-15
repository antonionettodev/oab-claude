import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

// Cargos que podem ter múltiplos membros na mesma câmara
const REPEATABLE_POSITIONS = ['relator', 'relatora'] as const

// Mapeamento de valores para labels dos cargos
const POSITION_LABELS: Record<string, string> = {
  presidente: 'Presidente',
  'vice-presidente': 'Vice-Presidente',
  relator: 'Relator',
  relatora: 'Relatora',
}

export const validateChamberPositionHook: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data?.position || !data?.adjudicatingChamber) {
    return data
  }

  const position = typeof data.position === 'string' ? data.position : null

  if (!position) {
    return data
  }

  // Se o cargo pode ser repetido, não valida
  if (REPEATABLE_POSITIONS.includes(position as any)) {
    return data
  }

  const chamberId =
    typeof data.adjudicatingChamber === 'object' && data.adjudicatingChamber !== null
      ? data.adjudicatingChamber.id
      : data.adjudicatingChamber

  if (!chamberId) {
    return data
  }

  const currentDocId = operation === 'update' && originalDoc?.id ? originalDoc.id : null

  const whereConditions: any[] = [
    { position: { equals: position } },
    { adjudicatingChamber: { equals: chamberId } },
  ]

  if (currentDocId) {
    whereConditions.push({ id: { not_equals: currentDocId } })
  }

  const existingMembers = await req.payload.find({
    collection: 'members-adjudicating-chamber',
    where: {
      and: whereConditions,
    },
    limit: 1,
  })

  if (existingMembers.docs.length > 0) {
    const positionLabel = POSITION_LABELS[position] || position
    const existingMember = existingMembers.docs[0]
    const memberName = existingMember.title || ''

    throw new APIError(
      `Já existe um(a) ${positionLabel} cadastrado(a) para esta câmara julgadora${
        memberName ? `: ${memberName}` : ''
      }.`,
      400,
    )
  }

  return data
}
