import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { phoneField } from '@/fields/phone'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { stripNonNumericCharactersHook } from '@/hooks/strip-non-numeric-characters'
import { titleField } from '@/fields/title'

export const Subsections: CollectionConfig = {
  slug: 'subsections',
  labels: {
    singular: 'Subseção',
    plural: 'Subseções',
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
          label: 'Informações Básicas',
          fields: [
            {
              type: 'row',
              fields: [
                titleField({
                  label: 'Nome da Subseção',
                  placeholder: 'Ex: Blumenau, Joinville, Chapecó...',
                  unique: true,
                  width: '50%',
                }),
                {
                  name: 'region',
                  type: 'relationship',
                  label: 'Região',
                  relationTo: 'subsection-regions',
                  required: true,
                  admin: {
                    placeholder: 'Selecione a região',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'creationDate',
              type: 'date',
              label: 'Data de Criação',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy',
                  pickerAppearance: 'dayOnly',
                },
                description: 'Data de fundação da subseção.',
              },
            },
            textareaField({
              name: 'about',
              label: 'Sobre a Subseção',
              placeholder: 'Descreva a subseção, suas características e abrangência...',
              description: 'Texto exibido na seção "Sobre a Subseção".',
              maxLength: 1000,
            }),
            textareaField({
              name: 'mission',
              label: 'Região de abrangência',
              placeholder: 'Descreva a região de abrangência da subseção...',
              maxLength: 1000,
            }),
          ],
        },
        {
          label: 'Localização',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Logradouro',
                  admin: {
                    placeholder: 'Ex: Rua XV de Novembro, 123',
                    width: '70%',
                  },
                  maxLength: 200,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'district',
                  type: 'text',
                  label: 'Bairro',
                  admin: {
                    placeholder: 'Ex: Centro',
                    width: '30%',
                  },
                  maxLength: 100,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  label: 'Cidade',
                  admin: {
                    placeholder: 'Ex: Florianópolis',
                    width: '70%',
                  },
                  maxLength: 100,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'CEP',
                  admin: {
                    placeholder: 'Ex: 88000-000',
                    width: '30%',
                  },
                  maxLength: 10,
                  hooks: {
                    beforeChange: [stripNonNumericCharactersHook],
                  },
                },
              ],
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
                  placeholder: 'Ex: (48) 3333-4444',
                  required: false,
                  width: '50%',
                }),
                {
                  name: 'email',
                  type: 'email',
                  label: 'E-mail',
                  admin: {
                    placeholder: 'Ex: subsecao@oab-sc.org.br',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'website',
                  type: 'text',
                  label: 'Site da Subseção',
                  admin: {
                    placeholder: 'Ex: https://subsecao.oab-sc.org.br',
                    width: '50%',
                  },
                  maxLength: 512,
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
                    width: '50%',
                  },
                  maxLength: 100,
                  hooks: {
                    beforeChange: [trimHook],
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
