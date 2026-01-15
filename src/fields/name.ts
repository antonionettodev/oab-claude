import type { Field } from 'payload'
import { trimUppercaseHook } from '@/hooks/trim-uppercase'

interface NameFieldOptions {
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  width?: string
  maxLength?: number
}

export const nameField = (options: NameFieldOptions = {}): Field => ({
  name: options.name || 'name',
  type: 'text',
  label: options.label || 'Nome Completo',
  required: options.required ?? true,
  admin: {
    placeholder: options.placeholder || 'Nome Completo',
    width: options.width || '50%',
  },
  minLength: 2,
  maxLength: options.maxLength || 128,
  hooks: {
    beforeChange: [trimUppercaseHook],
  },
})
