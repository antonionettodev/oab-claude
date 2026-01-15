import type { AuthStrategy } from 'payload'
import jwt from 'jsonwebtoken'

/**
 * Custom Strategy: BR Conselhos JWT
 *
 * Valida o token JWT gerado no login do BR Conselhos.
 * Usado para autenticar requisições como /api/lawyers/me
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

      // Remove "Bearer " do início
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader

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
