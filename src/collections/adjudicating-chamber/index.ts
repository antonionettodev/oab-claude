import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { titleField } from '@/fields/title'

export const AdjudicatingChamber: CollectionConfig = {
  slug: 'adjudicating-chamber',
  labels: {
    singular: 'Câmara Julgadora',
    plural: 'Câmaras Julgadoras',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Diretoria',
    defaultColumns: ['title'],
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Título',
      placeholder: 'Ex: 1ª Câmara Julgadora',
    }),
    createdByField,
    editedByField,
  ],
}
