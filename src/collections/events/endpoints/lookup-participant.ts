import type { Endpoint } from 'payload'

/**
 * Endpoint: Buscar Participante
 *
 * Busca dados de advogado por OAB ou CPF para auto-preenchimento na inscrição.
 * Se for advogado, retorna dados da collection lawyers.
 * Se não encontrar, retorna vazio para preenchimento manual.
 *
 * GET /api/events/lookup-participant?oab=SC12345
 * GET /api/events/lookup-participant?cpf=12345678900
 */
export const lookupParticipantEndpoint: Endpoint = {
  path: '/lookup-participant',
  method: 'get',
  handler: async (req) => {
    const { payload } = req

    try {
      const url = new URL(req.url || '', 'http://localhost')
      const oab = url.searchParams.get('oab')
      const cpf = url.searchParams.get('cpf')

      if (!oab && !cpf) {
        return Response.json(
          { success: false, error: 'Informe OAB ou CPF para busca' },
          { status: 400 },
        )
      }

      let lawyer = null

      // Busca por OAB
      if (oab) {
        const oabClean = oab.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

        // Extrai estado e número (ex: SC12345 -> estado=SC, numero=12345)
        const stateMatch = oabClean.match(/^([A-Z]{2})(\d+)$/)

        if (stateMatch) {
          const [, oabState, oabNumber] = stateMatch

          const result = await payload.find({
            collection: 'lawyers',
            where: {
              and: [
                { oabNumber: { equals: oabNumber } },
                { oabState: { equals: oabState } },
              ],
            },
            limit: 1,
          })

          if (result.docs.length > 0) {
            lawyer = result.docs[0]
          }
        } else {
          // Busca só pelo número
          const result = await payload.find({
            collection: 'lawyers',
            where: {
              oabNumber: { equals: oabClean },
            },
            limit: 1,
          })

          if (result.docs.length > 0) {
            lawyer = result.docs[0]
          }
        }
      }

      // Busca por CPF
      if (!lawyer && cpf) {
        const cpfClean = cpf.replace(/\D/g, '')

        const result = await payload.find({
          collection: 'lawyers',
          where: {
            cpf: { equals: cpfClean },
          },
          limit: 1,
        })

        if (result.docs.length > 0) {
          lawyer = result.docs[0]
        }
      }

      if (!lawyer) {
        return Response.json({
          success: true,
          found: false,
          message: 'Participante não encontrado na base de advogados',
          data: null,
        })
      }

      // Retorna dados para auto-preenchimento
      return Response.json({
        success: true,
        found: true,
        isLawyer: true,
        data: {
          name: lawyer.name,
          cpf: lawyer.cpf,
          email: lawyer.email || lawyer.commercialEmail,
          phone: lawyer.commercialPhone,
          oab: lawyer.oabNumber ? `${lawyer.oabState}${lawyer.oabNumber}` : null,
          oabNumber: lawyer.oabNumber,
          oabState: lawyer.oabState,
          lawyerId: lawyer.id,
        },
      })
    } catch (error) {
      console.error('Erro ao buscar participante:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
        },
        { status: 500 },
      )
    }
  },
}
