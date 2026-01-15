import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { titleField } from '@/fields/title'
import { anyone } from '@/access/anyone'

export const CommissionAreas: CollectionConfig = {
  slug: 'commission-areas',
  labels: {
    singular: 'Área da Comissão',
    plural: 'Áreas das Comissões',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Comissões',
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Nome da Área',
      placeholder: 'Ex: Educação, Direito Público, Previdenciário...',
      unique: true,
    }),
    createdByField,
    editedByField,
  ],
}
