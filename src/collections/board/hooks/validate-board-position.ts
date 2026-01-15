import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

const REPEATABLE_POSITIONS = [
  'conselho-estadual-titular',
  'conselho-estadual-suplente',
  'conselho-federal-titular',
  'conselho-federal-suplente',
] as const

const POSITION_LABELS: Record<string, string> = {
  presidente: 'Presidente',
  'vice-presidente': 'Vice-Presidente',
  'secretario-geral': 'Secretário(a)-Geral',
  'secretario-geral-adjunto': 'Secretário(a)-Geral Adjunto(a)',
  tesoureiro: 'Tesoureiro(a)',
  'tesoureiro-adjunto': 'Tesoureiro(a) Adjunto(a)',
  'diretor-administrativo': 'Diretor(a) Administrativo(a)',
  'diretor-executivo': 'Diretor(a) Executivo(a)',
  'diretor-relacoes-institucionais': 'Diretor(a) de Relações Institucionais',
  'diretor-defesa-prerrogativas-valorizacao-advocacia':
    'Diretor(a) de Defesa das Prerrogativas e Valorização da Advocacia',
  'diretor-educacao-juridica': 'Diretor(a) de Educação Jurídica',
  'diretor-iniciacao-profissional': 'Diretor(a) de Iniciação Profissional',
  'diretor-tecnologia-inovacao': 'Diretor(a) de Tecnologia e Inovação',
  'diretor-inclusao-acessibilidade': 'Diretor(a) de Inclusão e Acessibilidade',
  'diretor-interiorizacao': 'Diretor(a) de Interiorização',
  'diretor-assuntos-penais': 'Diretor(a) de Assuntos Penais',
  'diretor-atendimento': 'Diretor(a) de Atendimento',
  'diretor-relacionamento-justica-federal': 'Diretor(a) de Relacionamento com a Justiça Federal',
  'diretor-relacionamento-justica-estadual': 'Diretor(a) de Relacionamento com a Justiça Estadual',
  'diretor-relacionamento-justica-trabalho':
    'Diretor(a) de Relacionamento com a Justiça do Trabalho',
  'diretor-relacionamento-justica-eleitoral':
    'Diretor(a) de Relacionamento com a Justiça Eleitoral',
  'conselho-estadual-titular': 'Conselho Estadual Titular',
  'conselho-estadual-suplente': 'Conselho Estadual Suplente',
  'conselho-federal-titular': 'Conselho Federal Titular',
  'conselho-federal-suplente': 'Conselho Federal Suplente',
}

export const validateBoardPositionHook: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data?.position || !data?.management) {
    return data
  }

  const position = typeof data.position === 'string' ? data.position : null

  if (!position) {
    return data
  }

  if (REPEATABLE_POSITIONS.includes(position as any)) {
    return data
  }

  const managementId =
    typeof data.management === 'object' && data.management !== null
      ? data.management.id
      : data.management

  if (!managementId) {
    return data
  }

  const currentDocId = operation === 'update' && originalDoc?.id ? originalDoc.id : null

  const whereConditions: any[] = [
    { position: { equals: position } },
    { management: { equals: managementId } },
  ]

  if (currentDocId) {
    whereConditions.push({ id: { not_equals: currentDocId } })
  }

  const existingMembers = await req.payload.find({
    collection: 'board',
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
      `Já existe um(a) ${positionLabel} cadastrado(a) para esta gestão${
        memberName ? `: ${memberName}` : ''
      }.`,
      400,
    )
  }

  return data
}
