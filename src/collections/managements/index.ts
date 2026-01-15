import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'

export const Managements: CollectionConfig = {
  slug: 'managements',
  labels: {
    singular: 'Período',
    plural: 'Períodos',
  },
  admin: {
    useAsTitle: 'managementStart',
    group: 'Gestões',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'managementStart',
          type: 'number',
          label: 'Início da Gestão',
          required: true,
          min: 1900,
          max: 2100,
          admin: {
            placeholder: 'Ex: 2022',
            step: 1,
            width: '50%',
          },
        },
        {
          name: 'managementEnd',
          type: 'number',
          label: 'Fim da Gestão',
          required: true,
          min: 1900,
          max: 2100,
          admin: {
            placeholder: 'Ex: 2024',
            step: 1,
            width: '50%',
          },
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
