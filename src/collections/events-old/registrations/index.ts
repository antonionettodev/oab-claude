import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    singular: 'Inscrição',
    plural: 'Lista de Inscritos',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Eventos',
    defaultColumns: ['lawyer', 'event', 'status', 'registrationDate'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'lawyer',
          type: 'relationship',
          label: 'Advogado',
          relationTo: 'lawyers',
          required: true,
          admin: {
            placeholder: 'Selecione o advogado',
            width: '50%',
          },
        },
        {
          name: 'event',
          type: 'relationship',
          label: 'Evento',
          relationTo: 'events',
          required: true,
          admin: {
            placeholder: 'Selecione o evento',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
          required: true,
          admin: {
            placeholder: 'email@exemplo.com',
            width: '50%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefone',
          required: true,
          admin: {
            placeholder: '(00) 00000-0000',
            width: '50%',
          },
          maxLength: 20,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'oabNumber',
          type: 'text',
          label: 'Número da OAB',
          required: true,
          admin: {
            placeholder: 'Ex: SC12345',
            width: '50%',
          },
          maxLength: 20,
        },
        {
          name: 'registrationDate',
          type: 'date',
          label: 'Data de Inscrição',
          admin: {
            date: {
              displayFormat: 'dd/MM/yyyy, HH:mm',
              pickerAppearance: 'dayAndTime',
            },
            description: 'Data em que o advogado se inscreveu no evento',
            width: '50%',
          },
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    {
      name: 'checkInAt',
      type: 'date',
      label: 'Check-in Realizado Em',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy, HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        description: 'Data e hora em que o check-in foi realizado',
        readOnly: true,
      },
    },
    textareaField({
      name: 'notes',
      label: 'Observações',
      placeholder: 'Adicione observações sobre esta inscrição...',
      maxLength: 500,
      required: false,
    }),
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'registered',
      required: true,
      options: [
        { label: 'Inscrito', value: 'registered' },
        { label: 'Check-in Confirmado', value: 'checked-in' },
        { label: 'Presente', value: 'attended' },
        { label: 'Ausente', value: 'absent' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      admin: {
        placeholder: 'Selecione o status',
        position: 'sidebar',
        description: 'Status da participação no evento',
      },
    },
    createdByField,
    editedByField,
  ],
}
