import type { Endpoint } from 'payload'
import jwt from 'jsonwebtoken'

import { authenticateBRConselhos, mapBRConselhosToLawyer } from '../auth/br-conselhos-service'

/**
 * Endpoint: Login de Advogado via BR Conselhos
 *
 * POST /api/lawyers/login-br-conselhos
 *
 * Body:
 * {
 *   "cpf": "12345678900",
 *   "password": "senha123"
 * }
 */
export const loginBRConselhosEndpoint: Endpoint = {
  path: '/login-br-conselhos',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { cpf, password, senha } = body

      const userPassword = password || senha

      if (!cpf || !userPassword) {
        return Response.json(
          { success: false, error: 'CPF e senha são obrigatórios' },
          { status: 400 }
        )
      }

      // Autentica no BR Conselhos
      const brConselhosData = await authenticateBRConselhos(cpf, userPassword)

      if (!brConselhosData || brConselhosData.status !== 'OK') {
        return Response.json(
          { success: false, error: 'CPF ou senha inválidos' },
          { status: 401 }
        )
      }

      // Busca o advogado pelo CPF
      const cpfClean = brConselhosData.cpfCnpj?.replace(/\D/g, '') || cpf.replace(/\D/g, '')

      const existingLawyer = await payload.find({
        collection: 'lawyers',
        where: { cpf: { equals: cpfClean } },
        limit: 1,
      })

      let lawyer

      if (existingLawyer.docs.length > 0) {
        // Atualiza o advogado existente
        lawyer = await payload.update({
          collection: 'lawyers',
          id: existingLawyer.docs[0].id,
          data: mapBRConselhosToLawyer(brConselhosData),
        })
      } else {
        // Cria novo advogado
        const email = brConselhosData.emailComercial || `${cpfClean}@oab-sc.org.br`

        lawyer = await payload.create({
          collection: 'lawyers',
          data: {
            ...mapBRConselhosToLawyer(brConselhosData),
            email,
          },
        })
      }

      // Gera o token JWT manualmente
      const token = jwt.sign(
        {
          id: lawyer.id,
          collection: 'lawyers',
          email: lawyer.email,
        },
        payload.secret,
        { expiresIn: '7d' }
      )

      // Remove campos sensíveis
      const { hash, salt, ...safeUser } = lawyer as Record<string, unknown>

      return Response.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: safeUser,
        token,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      })
    } catch (error) {
      console.error('Login BR Conselhos erro:', error)
      return Response.json(
        { success: false, error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  },
}
