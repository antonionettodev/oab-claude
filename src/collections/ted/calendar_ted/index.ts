import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

export const CalendarTed: CollectionConfig = {
  slug: 'calendar-ted',
  labels: {
    singular: 'Evento do Calendário TED',
    plural: 'Calendário TED',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Ted',
    defaultColumns: ['title', 'date', 'location'],
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
      admin: {
        placeholder: 'Ex: Sessão 3-TED',
      },
      maxLength: 100,
      hooks: {
        beforeChange: [trimHook],
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Data',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Local',
      required: true,
      admin: {
        placeholder: 'Ex: Chapecó, Blumenau, São Jose',
      },
      maxLength: 200,
      hooks: {
        beforeChange: [trimHook],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      required: false,
      admin: {
        placeholder: 'Informações adicionais sobre a sessão (opcional)',
      },
      maxLength: 500,
    },
    createdByField,
    editedByField,
  ],
}
