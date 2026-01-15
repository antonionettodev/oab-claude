import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { titleField } from '@/fields/title'

export const LegislationsTypes: CollectionConfig = {
  slug: 'legislations-types',
  labels: {
    singular: 'Tipo de Legislação',
    plural: 'Tipos de Legislação',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Documentos',
    defaultColumns: ['title'],
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Nome do Tipo',
      placeholder: 'Ex: Estatuto, Regimento Interno, etc.',
    }),
    createdByField,
    editedByField,
  ],
}
