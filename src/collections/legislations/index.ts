import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'

export const Legislations: CollectionConfig = {
  slug: 'legislations',
  labels: {
    singular: 'Legislação',
    plural: 'Legislações',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Documentos',
    defaultColumns: ['title', 'type'],
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
      name: 'type',
      label: 'Tipo de Legislação',
      type: 'relationship',
      relationTo: 'legislations-types',
      required: true,
      admin: {
        position: 'sidebar',
      },
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
