import type { CollectionConfig } from 'payload'

import { nameField } from '@/fields/name'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  labels: {
    singular: 'Palestrante',
    plural: 'Palestrantes',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Eventos',
  },
  access: {
    read: anyone,
  },
  fields: [
    nameField({
      label: 'Nome do Palestrante',
      placeholder: 'Ex: Maria Santos',
      required: true,
    }),
    {
      name: 'professionalTitle',
      type: 'text',
      label: 'Título Profissional',
      required: true,
      maxLength: 64,
      admin: {
        placeholder: 'Ex: Especialista em Direito Penal',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      maxLength: 128,
      admin: {
        placeholder: 'Breve descrição sobre o palestrante',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Foto do Palestrante',
      relationTo: 'files',
    },
    createdByField,
    editedByField,
  ],
}
