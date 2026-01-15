import type { FieldHook } from 'payload'
import { generateCheckinPassword } from '@/lib/token'

/**
 * Hook para gerar senha de check-in automaticamente
 * A senha é gerada apenas na criação do evento
 */
export const generateCheckinPasswordHook: FieldHook = ({ value, operation }) => {
  // Mantém o valor existente se não for criação
  if (value && operation !== 'create') {
    return value
  }

  return generateCheckinPassword()
}
