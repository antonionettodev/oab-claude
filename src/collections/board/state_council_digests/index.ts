import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

export const StateCouncilDigests: CollectionConfig = {
  slug: 'state-council-digests',
  labels: {
    singular: 'Ementa do Conselho Estadual',
    plural: 'Ementas do Conselho Estadual',
  },
  admin: {
    useAsTitle: 'processNumber',
    group: 'Diretoria',
    defaultColumns: ['processNumber', 'acordaoNumber', 'year'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'processNumber',
      type: 'text',
      label: 'Processo',
      required: true,
      admin: {
        placeholder: 'Ex: Processo n. 74438',
      },
      maxLength: 100,
      hooks: {
        beforeChange: [trimHook],
      },
    },
    {
      name: 'acordaoNumber',
      type: 'text',
      label: 'Nº do Acórdão',
      required: true,
      admin: {
        placeholder: 'Ex: 273',
      },
      maxLength: 50,
      hooks: {
        beforeChange: [trimHook],
      },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Ano',
      required: true,
      min: 1900,
      max: 2100,
      admin: {
        placeholder: 'Ex: 2025',
        step: 1,
      },
    },
    {
      name: 'information',
      type: 'textarea',
      label: 'Informações',
      required: false,
      admin: {
        placeholder: 'Informações e ementa',
      },
      maxLength: 2000,
    },
    createdByField,
    editedByField,
  ],
}
