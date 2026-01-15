import type { CollectionBeforeValidateHook } from 'payload'

export const checkTurmaCompositionHook: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data

  const compId = data?.composition
  if (!compId) {
    data.isTurmaComposition = false
    return data
  }

  // relationship no admin geralmente é só o ID
  const comp = await req.payload.findByID({
    collection: 'composition',
    id: compId,
    depth: 0,
  })

  const title = String((comp as any)?.title || '')
  data.isTurmaComposition = title.toLowerCase().includes('turma')

  return data
}
