import type { Field } from 'payload'
import { trimHook } from '@/hooks/trim'

interface TitleFieldOptions {
  name?: string
  label?: string
  placeholder?: string
  unique?: boolean
  maxLength?: number
  width?: string
}

export const titleField = (options: TitleFieldOptions = {}): Field => ({
  name: options.name || 'title',
  type: 'text',
  label: options.label || 'Título',
  required: true,
  unique: options.unique ?? false,
  admin: {
    placeholder: options.placeholder || 'Digite o título',
    width: options.width || '50%',
  },
  minLength: 2,
  maxLength: options.maxLength || 128,
  hooks: {
    beforeChange: [trimHook],
  },
})
