import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { phoneField } from '@/fields/phone'
import { titleField } from '@/fields/title'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { trimLowercaseHook } from '@/hooks/trim-lowercase'

export const SubsectionRooms: CollectionConfig = {
  slug: 'subsection-rooms',
  labels: {
    singular: 'Sala da Subseção',
    plural: 'Salas da Subseção',
  },
  admin: {
    useAsTitle: 'title',
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
          label: 'Informações da Sala',
          fields: [
            {
              type: 'row',
              fields: [
                titleField({
                  label: 'Nome do Local',
                  placeholder: 'Ex: Sala do Fórum, Sede da Justiça do Trabalho...',
                  width: '50%',
                }),
                {
                  name: 'subsection',
                  type: 'relationship',
                  label: 'Subseção',
                  relationTo: 'subsections',
                  required: true,
                  admin: {
                    placeholder: 'Selecione a Subseção',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'address',
              type: 'text',
              label: 'Endereço Completo',
              required: true,
              admin: {
                placeholder: 'Ex: Av. Rio Branco, 29 - Centro - 88160-000 - Biguaçu/SC',
              },
              maxLength: 200,
              hooks: {
                beforeChange: [trimHook],
              },
            },
            {
              name: 'serviceHours',
              type: 'text',
              label: 'Horário de Atendimento',
              admin: {
                placeholder: 'Ex: Segunda a Sexta, 09:00 às 18:00',
              },
              maxLength: 100,
              hooks: {
                beforeChange: [trimHook],
              },
            },
          ],
        },
        {
          label: 'Contato',
          fields: [
            {
              type: 'row',
              fields: [
                phoneField({
                  placeholder: 'Ex: (47) 3361-1234',
                  required: false,
                  width: '50%',
                }),
                {
                  name: 'email',
                  type: 'email',
                  label: 'E-mail',
                  admin: {
                    placeholder: 'Ex: sala@oabsc.org.br',
                    width: '50%',
                  },
                  hooks: {
                    beforeChange: [trimLowercaseHook],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
