import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { titleField } from '@/fields/title'
import { validateChamberPositionHook } from './hooks/validate-chamber-position'

export const MembersAdjudicatingChamber: CollectionConfig = {
  slug: 'members-adjudicating-chamber',
  labels: {
    singular: 'Membro da Câmara Julgadora',
    plural: 'Membros da Câmara Julgadora',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Diretoria',
    defaultColumns: ['title', 'oabNumber', 'position', 'adjudicatingChamber'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados do Membro',
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
          label: 'Cargo e Câmara',
          fields: [
            {
              name: 'adjudicatingChamber',
              type: 'relationship',
              label: 'Câmara Julgadora',
              relationTo: 'adjudicating-chamber',
              required: true,
              admin: {
                placeholder: 'Selecione a câmara julgadora',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Cargo',
              required: true,
              options: [
                {
                  label: 'Presidente',
                  value: 'presidente',
                },
                {
                  label: 'Vice-Presidente',
                  value: 'vice-presidente',
                },
                {
                  label: 'Relator',
                  value: 'relator',
                },
                {
                  label: 'Relatora',
                  value: 'relatora',
                },
              ],
              admin: {
                placeholder: 'Selecione o cargo',
              },
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
  hooks: {
    beforeValidate: [validateChamberPositionHook],
  },
}
