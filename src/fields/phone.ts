import type { Field } from 'payload'
import { stripNonNumericCharactersHook } from '@/hooks/strip-non-numeric-characters'
import { formatPhoneHook } from '@/hooks/format-phone'

interface PhoneFieldOptions {
  placeholder?: string
  required?: boolean
  width?: string
}

export const phoneField = (options: PhoneFieldOptions = {}): Field => ({
  name: 'phone',
  type: 'text',
  label: 'Telefone',
  required: options.required ?? true,
  admin: {
    placeholder: options.placeholder || 'Telefone',
    width: options.width || '50%',
  },
  maxLength: 20,
  hooks: {
    beforeChange: [stripNonNumericCharactersHook],
    afterRead: [formatPhoneHook],
  },
})
