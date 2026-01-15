import type { FieldHook } from 'payload'

export const trimLowercaseHook: FieldHook = ({ value }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value
