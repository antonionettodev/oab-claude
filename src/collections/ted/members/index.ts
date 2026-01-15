import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { nameField } from '@/fields/name'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { checkTurmaCompositionHook } from './hooks/check-turma-composition'

export const TedMembers: CollectionConfig = {
  slug: 'ted-members',
  labels: {
    singular: 'Membro do Ted',
    plural: 'Membros do Ted',
  },
  defaultPopulate: {
    composition: true,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Ted',
  },
  access: {
    read: anyone,
  },
  hooks: {
    beforeValidate: [checkTurmaCompositionHook],
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
                  label: 'Nome',
                  placeholder: 'Ex: João da Silva',
                  width: '70%',
                }),
                {
                  name: 'oabNumber',
                  type: 'text',
                  label: 'Nº da OAB',
                  required: true,
                  admin: {
                    placeholder: 'Ex: 12345',
                    width: '30%',
                  },
                  maxLength: 20,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Cargo e Composição',
          fields: [
            {
              name: 'position',
              type: 'select',
              label: 'Cargo',
              required: false,
              admin: {
                placeholder: 'Selecione o cargo',
              },
              options: [
                {
                  label: 'Presidente',
                  value: 'presidente',
                },
                {
                  label: 'Vice Presidente',
                  value: 'vice-presidente',
                },
                {
                  label: 'Secretário Geral',
                  value: 'secretario-geral',
                },
                {
                  label: 'Secretária Geral',
                  value: 'secretaria-geral',
                },
              ],
            },
            {
              name: 'isTurmaComposition',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                hidden: true,
              },
            },
            {
              name: 'composition',
              type: 'relationship',
              label: 'Composição',
              relationTo: 'composition',
              required: true,
              admin: {
                placeholder: 'Selecione a composição',
                description:
                  'Selecione a composição. Campos adicionais aparecerão automaticamente ao salvar o membro se a composição contiver "Turma" no nome.',
              },
            },
            {
              name: 'location',
              type: 'text',
              label: 'Local',
              required: false,
              admin: {
                placeholder: 'Ex: Florianópolis, Palhoça',
                description: 'Local do membro',
                condition: (data) => Boolean(data?.isTurmaComposition),
              },
              maxLength: 100,
              hooks: {
                beforeChange: [trimHook],
              },
            },
            {
              name: 'memberType',
              type: 'radio',
              label: 'Tipo',
              required: false,
              admin: {
                layout: 'horizontal',
                description: 'Selecione se o membro é titular ou suplente',
                condition: (data) => Boolean(data?.isTurmaComposition),
              },
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
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
