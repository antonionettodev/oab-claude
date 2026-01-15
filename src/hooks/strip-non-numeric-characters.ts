import type { FieldHook } from 'payload'

export const stripNonNumericCharactersHook: FieldHook = ({ value }) => {
  return value?.replace(/\D/g, '')
}
