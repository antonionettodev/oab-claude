import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { authenticatedOrPublic } from '@/access/authenticated-or-public'

export const Files: CollectionConfig = {
  slug: 'files',
  labels: {
    singular: 'Arquivo',
    plural: 'Arquivos',
  },
  admin: {
    group: 'Mídia e Arquivos',
  },
  access: {
    read: authenticatedOrPublic,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto Alternativo do Arquivo',
      type: 'text',
      required: false,
      maxLength: 128,
    },
    {
      name: 'caption',
      label: 'Legenda',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'isPublic',
      label: 'Arquivo Público',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Quando marcado, o arquivo fica acessível publicamente sem autenticação',
        position: 'sidebar',
      },
    },
    createdByField,
    editedByField,
  ],
  upload: {
    disableLocalStorage: true,
    displayPreview: true,
    mimeTypes: [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
  },
  folders: true,
}
