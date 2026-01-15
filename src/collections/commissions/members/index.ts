import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { nameField } from '@/fields/name'
import { anyone } from '@/access/anyone'
import { trimUppercaseHook } from '@/hooks/trim-uppercase'
import { validateDirectoryPositionHook } from './hooks/validate-directory-position'

export const CommissionMembers: CollectionConfig = {
  slug: 'commission-members',
  labels: {
    singular: 'Membro da Comissão',
    plural: 'Membros das Comissões',
  },
  defaultPopulate: {
    commission: true,
    image: true,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Comissões',
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
            {
              type: 'row',
              fields: [
                nameField({
                  label: 'Nome do Membro',
                  placeholder: 'Ex: João da Silva',
                  width: '70%',
                }),
                {
                  name: 'oabNumber',
                  type: 'text',
                  label: 'Nº da OAB',
                  admin: {
                    placeholder: 'Ex: 12345',
                    width: '30%',
                  },
                  minLength: 3,
                  maxLength: 20,
                  hooks: {
                    beforeChange: [trimUppercaseHook],
                  },
                },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              label: 'Foto do Membro',
              relationTo: 'files',
            },
          ],
        },
        {
          label: 'Cargo',
          fields: [
            {
              name: 'commission',
              type: 'relationship',
              label: 'Comissão',
              relationTo: 'commissions',
              required: true,
              admin: {
                placeholder: 'Selecione a Comissão',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Cargo',
              required: true,
              admin: {
                placeholder: 'Selecione o cargo',
              },
              options: [
                { label: 'Presidente', value: 'presidente' },
                { label: 'Vice-Presidente', value: 'vice-presidente' },
                { label: 'Secretário(a)', value: 'secretario' },
                { label: 'Secretário(a) Adjunto(a)', value: 'secretario-adjunto' },
                { label: 'Membro', value: 'membro' },
                { label: 'Membro Consultivo', value: 'membro-consultivo' },
              ],
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
  hooks: {
    beforeValidate: [validateDirectoryPositionHook],
  },
}
