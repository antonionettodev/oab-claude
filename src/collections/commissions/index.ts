import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { titleField } from '@/fields/title'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'

export const Commissions: CollectionConfig = {
  slug: 'commissions',
  labels: {
    singular: 'Comissão',
    plural: 'Comissões',
  },
  admin: {
    useAsTitle: 'title',
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
          label: 'Informações Básicas',
          fields: [
            {
              type: 'row',
              fields: [
                titleField({
                  label: 'Nome da Comissão',
                  placeholder: 'Ex: Acesso à Justiça (Defensoria Dativa)',
                  unique: true,
                  width: '70%',
                }),
                {
                  name: 'type',
                  type: 'radio',
                  label: 'Tipo',
                  required: true,
                  defaultValue: 'permanente',
                  admin: {
                    layout: 'horizontal',
                    width: '30%',
                  },
                  options: [
                    { label: 'Permanente', value: 'permanente' },
                    { label: 'Temporária', value: 'temporaria' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'area',
                  type: 'relationship',
                  label: 'Área',
                  relationTo: 'commission-areas',
                  admin: {
                    placeholder: 'Selecione a área',
                    width: '50%',
                  },
                },
                {
                  name: 'subsection',
                  type: 'relationship',
                  label: 'Subseção',
                  relationTo: 'subsections',
                  admin: {
                    placeholder: 'Selecione a subseção',
                    description: 'Vincule esta comissão a uma subseção específica.',
                    width: '50%',
                  },
                },
              ],
            },
            textareaField({
              name: 'about',
              label: 'Sobre a Comissão',
              placeholder: 'Descreva a comissão, seus objetivos e área de atuação...',
              description: 'Texto exibido na seção "Sobre a Comissão".',
              maxLength: 1000,
            }),
          ],
        },
        {
          label: 'Áreas de Foco',
          fields: [
            {
              name: 'focusAreas',
              type: 'array',
              label: 'Áreas de Foco',
              admin: {
                description: 'Adicione as áreas de foco da comissão.',
                initCollapsed: false,
              },
              labels: {
                singular: 'Área de Foco',
                plural: 'Áreas de Foco',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  label: 'Área de Foco',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Fundos de pensão',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    createdByField,
    editedByField,
  ],
}
