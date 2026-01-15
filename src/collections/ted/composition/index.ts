import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { titleField } from '@/fields/title'

export const Composition: CollectionConfig = {
  slug: 'composition',
  labels: {
    singular: 'Composição',
    plural: 'Composições',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Ted',
  },
  access: {
    read: anyone,
  },
  fields: [
    titleField({
      label: 'Nome',
      placeholder: 'Digite o nome',
    }),
    createdByField,
    editedByField,
  ],
}
