import type { CollectionConfig } from 'payload'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { nameField } from '@/fields/name'
import { anyone } from '@/access/anyone'
import { trimUppercaseHook } from '@/hooks/trim-uppercase'
import { validateDirectoryPositionHook } from './hooks/validate-directory-position'

export const SubsectionMembers: CollectionConfig = {
  slug: 'subsection-members',
  labels: {
    singular: 'Membro da Subseção',
    plural: 'Membros da Subseção',
  },
  defaultPopulate: {
    subsection: true,
    image: true,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Subseções',
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
          label: 'Cargo e Gestão',
          fields: [
            {
              name: 'subsection',
              type: 'relationship',
              label: 'Subseção',
              relationTo: 'subsections',
              required: true,
              admin: {
                placeholder: 'Selecione a Subseção',
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
                { label: 'Secretário(a)-Geral', value: 'secretario-geral' },
                { label: 'Secretário(a)-Geral Adjunto(a)', value: 'secretario-geral-adjunto' },
                { label: 'Tesoureiro(a)', value: 'tesoureiro' },
                { label: 'Conselheiro(a)', value: 'conselheiro' },
              ],
            },
            {
              name: 'management',
              label: 'Gestão',
              type: 'relationship',
              relationTo: 'managements',
              required: true,
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
