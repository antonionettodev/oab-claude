import type { FieldHook } from 'payload'

export const trimHook: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)
