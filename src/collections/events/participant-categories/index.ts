import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { nameField } from '@/fields/name'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

/**
 * Collection: Categorias de Participante
 *
 * Define as categorias de participantes que podem se inscrever em eventos:
 * - Advogado
 * - Estagiário
 * - Jovem Advogado
 * - Público Externo
 * - Outras categorias configuráveis
 */
export const ParticipantCategories: CollectionConfig = {
  slug: 'participant-categories',
  labels: {
    singular: 'Categoria de Participante',
    plural: 'Categorias de Participante',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Eventos',
    defaultColumns: ['name', 'code', 'isActive', 'sortOrder'],
    description: 'Categorias de participantes para inscrição em eventos',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'row',
      fields: [
        nameField({
          label: 'Nome da Categoria',
          placeholder: 'Ex: Advogado, Estagiário, Público Externo',
          required: true,
          width: '50%',
        }),
        {
          name: 'code',
          type: 'text',
          label: 'Código',
          required: true,
          unique: true,
          maxLength: 50,
          admin: {
            placeholder: 'Ex: ADVOGADO, ESTAGIARIO, PUBLICO_EXTERNO',
            description: 'Identificador único para uso interno',
            width: '50%',
          },
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (typeof value === 'string') {
                  return value.toUpperCase().replace(/\s+/g, '_')
                }
                return value
              },
            ],
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      maxLength: 300,
      admin: {
        placeholder: 'Descrição detalhada da categoria...',
      },
      hooks: {
        beforeChange: [trimHook],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'requiresOAB',
          type: 'checkbox',
          label: 'Requer Número OAB',
          defaultValue: false,
          admin: {
            description: 'Se marcado, o número da OAB será obrigatório na inscrição',
            width: '50%',
          },
        },
        {
          name: 'requiresCPF',
          type: 'checkbox',
          label: 'Requer CPF',
          defaultValue: true,
          admin: {
            description: 'Se marcado, o CPF será obrigatório na inscrição',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sortOrder',
          type: 'number',
          label: 'Ordem de Exibição',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Ordem em que a categoria aparece nas listagens',
            width: '50%',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Ativo',
          defaultValue: true,
          admin: {
            description: 'Categorias inativas não aparecem nas opções de inscrição',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'color',
      type: 'text',
      label: 'Cor de Identificação',
      admin: {
        placeholder: '#3B82F6',
        description: 'Cor hexadecimal para identificação visual',
      },
      maxLength: 7,
      validate: (value) => {
        if (!value) return true
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
        if (!hexColorRegex.test(value)) {
          return 'Formato de cor inválido. Use o formato #RRGGBB'
        }
        return true
      },
    },
    createdByField,
    editedByField,
  ],
}
