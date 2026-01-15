import type { FieldHook } from 'payload'

export const trimUppercaseHook: FieldHook = ({ value }) => {
  return value?.trim().toUpperCase()
}
