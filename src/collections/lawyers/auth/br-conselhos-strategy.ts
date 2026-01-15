import type { AuthStrategy } from 'payload'
import jwt from 'jsonwebtoken'

/**
 * Custom Strategy: BR Conselhos JWT
 *
 * Valida o token JWT gerado no login do BR Conselhos.
 * Usado para autenticar requisições como /api/lawyers/me
 *
 * Aceita tokens nos formatos:
 * - Authorization: JWT <token> (formato padrão do Payload)
 * - Authorization: Bearer <token> (formato alternativo)
 */
export const brConselhosStrategy: AuthStrategy = {
  name: 'br-conselhos-jwt',
  authenticate: async ({ payload, headers }) => {
    try {
      // Obtém o token do header Authorization
      const authHeader = headers.get('authorization')

      if (!authHeader) {
        return { user: null }
      }

      // Remove prefixo "JWT " ou "Bearer " do início
      let token = authHeader
      if (authHeader.startsWith('JWT ')) {
        token = authHeader.slice(4)
      } else if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }

      if (!token) {
        return { user: null }
      }

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, payload.secret) as {
        id: number | string
        collection: string
        email?: string
      }

      if (!decoded.id || decoded.collection !== 'lawyers') {
        return { user: null }
      }

      // Busca o usuário pelo ID
      const lawyer = await payload.findByID({
        collection: 'lawyers',
        id: decoded.id,
      })

      if (!lawyer) {
        return { user: null }
      }

      return {
        user: {
          collection: 'lawyers',
          ...lawyer,
        },
      }
    } catch (error) {
      // Token inválido ou expirado
      return { user: null }
    }
  },
}
