import type { CollectionConfig } from 'payload'

import { nameField } from '@/fields/name'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { trimUppercaseHook } from '@/hooks/trim-uppercase'

export const Lawyers: CollectionConfig = {
  slug: 'lawyers',
  labels: {
    singular: 'Advogado',
    plural: 'Advogados',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Gestão de Pessoas',
  },
  auth: true,
  fields: [
    {
      type: 'row',
      fields: [
        nameField({
          required: true,
        }),
        {
          name: 'oabNumber',
          type: 'text',
          label: 'Nº da OAB',
          admin: {
            placeholder: 'Número da OAB do Advogado',
            width: '50%',
          },
          minLength: 3,
          maxLength: 20,
          hooks: {
            beforeChange: [trimUppercaseHook],
          },
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
