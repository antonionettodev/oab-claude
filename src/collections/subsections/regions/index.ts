import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { titleField } from '@/fields/title'
import { anyone } from '@/access/anyone'

export const SubsectionRegions: CollectionConfig = {
  slug: 'subsection-regions',
  labels: {
    singular: 'Região',
    plural: 'Regiões',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Subseções',
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Nome da Região',
      placeholder: 'Ex: Grande Florianópolis, Vale do Itajaí, Oeste, Serra...',
      unique: true,
    }),
    createdByField,
    editedByField,
  ],
}
