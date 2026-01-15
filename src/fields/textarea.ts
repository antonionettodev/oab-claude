import type { Field } from 'payload'
import { trimHook } from '@/hooks/trim'

interface TextareaFieldOptions {
  name: string
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  maxLength?: number
}

export const textareaField = (options: TextareaFieldOptions): Field => ({
  name: options.name,
  type: 'textarea',
  label: options.label,
  required: options.required ?? false,
  admin: {
    placeholder: options.placeholder,
    description: options.description,
  },
  maxLength: options.maxLength || 512,
  hooks: {
    beforeChange: [trimHook],
  },
})
