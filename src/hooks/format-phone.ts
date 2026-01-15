import type { FieldHook } from 'payload'

export const formatPhoneHook: FieldHook = ({ value }) => {
  if (!value) return value

  const numbers = value.replace(/\D/g, '')

  if (numbers.length === 13) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9)}`
  }

  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  }

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }

  if (numbers.length === 9) {
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
  }

  if (numbers.length === 8) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
  }

  return value
}
