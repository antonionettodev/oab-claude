import type { CollectionConfig } from 'payload'

import { editedByField } from '@/fields/edited-by'
import { phoneField } from '@/fields/phone'
import { nameField } from '@/fields/name'
import { sendWelcomeEmail } from './hooks/send-welcome-email'
import { unsubscribeEndpoint } from './endpoints/unsubscribe'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  labels: {
    singular: 'Assinante',
    plural: 'Assinantes',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Gestão de Pessoas',
  },
  fields: [
    {
      type: 'row',
      fields: [
        nameField(),
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
          required: true,
          unique: true,
          admin: {
            placeholder: 'E-mail',
            width: '50%',
          },
        },
      ],
    },
    phoneField({
      placeholder: 'WhatsApp (opcional)',
      required: false,
      width: '100%',
    }),
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
      ],
      admin: {
        placeholder: 'Selecione',
        position: 'sidebar',
      },
    },
    editedByField,
  ],
  endpoints: [unsubscribeEndpoint],
  hooks: {
    afterChange: [sendWelcomeEmail],
  },
}
