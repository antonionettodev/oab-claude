import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'

export const UrhHonorarium: CollectionConfig = {
  slug: 'urh-honorarium',
  labels: {
    singular: 'URH',
    plural: 'URHs',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Documentos',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'file',
      label: 'Arquivo',
      type: 'upload',
      relationTo: 'files',
      required: true,
    },
    createdByField,
    editedByField,
  ],
}
