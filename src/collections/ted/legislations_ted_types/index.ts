import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { titleField } from '@/fields/title'

export const LegislationsTedTypes: CollectionConfig = {
  slug: 'legislations-ted-types',
  labels: {
    singular: 'Tipo de Legislação TED',
    plural: 'Tipos de Legislação TED',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Ted',
    defaultColumns: ['title'],
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Nome do Tipo',
      placeholder: 'Ex: Conselho Federal, Conselho Federal, etc.',
    }),
    createdByField,
    editedByField,
  ],
}
