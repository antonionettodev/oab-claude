import type { FieldHook } from 'payload'

export const generateCheckinPasswordHook: FieldHook = ({ value, operation }) => {
  if (value && operation !== 'create') {
    return value
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = Math.floor(Math.random() * 3) + 6
  let password = ''

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}
