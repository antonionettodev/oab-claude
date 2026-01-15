import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo e Publicações',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      unique: true,
      admin: {
        placeholder: 'Digite o Nome da Categoria',
      },
      minLength: 1,
      maxLength: 32,
      hooks: {
        beforeChange: [
          ({ value }) => {
            return typeof value === 'string' ? value.trim() : value
          },
        ],
      },
    },
    {
      name: 'highlight',
      type: 'checkbox',
      label: 'Destaque',
      defaultValue: false,
      admin: {
        description: 'Define se a categoria aparece na home',
      },
    },
    createdByField,
    editedByField,
  ],
}
