import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { titleField } from '@/fields/title'

export const Counselors: CollectionConfig = {
  slug: 'counselors',
  labels: {
    singular: 'Membro do Conselho',
    plural: 'Membros do Conselho',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Diretoria',
    defaultColumns: ['title', 'councilType', 'positionType', 'management'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados do Conselheiro',
          fields: [
            titleField({
              label: 'Nome',
              placeholder: 'Ex: João da Silva',
            }),
            {
              name: 'oabNumber',
              type: 'text',
              label: 'Nº da OAB',
              required: true,
              admin: {
                placeholder: 'Ex: 12345',
              },
              maxLength: 20,
              hooks: {
                beforeChange: [trimHook],
              },
            },
          ],
        },
        {
          label: 'Conselho e Gestão',
          fields: [
            {
              name: 'management',
              type: 'relationship',
              label: 'Gestão',
              relationTo: 'managements',
              required: true,
              admin: {
                placeholder: 'Selecione a gestão',
              },
            },
            {
              name: 'councilType',
              type: 'radio',
              label: 'Conselheiro',
              required: true,
              options: [
                {
                  label: 'Estadual',
                  value: 'estadual',
                },
                {
                  label: 'Federal',
                  value: 'federal',
                },
              ],
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'positionType',
              type: 'radio',
              label: 'Cargo',
              required: true,
              options: [
                {
                  label: 'Titular',
                  value: 'titular',
                },
                {
                  label: 'Suplente',
                  value: 'suplente',
                },
              ],
              admin: {
                layout: 'horizontal',
              },
            },
          ],
        },
      ],
    },

    createdByField,
    editedByField,
  ],
}
