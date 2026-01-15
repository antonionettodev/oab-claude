import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { FileBlock } from '@/blocks/file/config'
import { revalidateDeleteHook, revalidatePostHook } from './hooks/revalidate-posts'
import { populateAuthorsHook, populateFirstAuthorHook } from './hooks/populate-authors'
import { editedByField } from '@/fields/edited-by'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { queuePostNotificationHook, markForNotificationHook } from './hooks/send-post-notifications'
import { authenticatedOrPublished } from '@/access/authenticated-or-published'
import { calculateReadingTimeHook } from './hooks/calculate-reading-time'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    featuredImage: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    group: 'Conteúdo e Publicações',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
  },
  trash: true,
  access: {
    read: authenticatedOrPublished,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conteúdo',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              admin: {
                placeholder: 'Digite o Título do Post',
              },
              maxLength: 256,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Resumo',
              required: true,
              admin: {
                placeholder: 'Escreva um Breve Resumo do Post',
                description: 'Máximo de 320 caracteres',
              },
              maxLength: 320,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              label: 'Imagem Destacada',
              relationTo: 'files',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Conteúdo',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [FileBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Categorização',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              label: 'Categoria',
              relationTo: 'categories',
              hasMany: true,
              maxRows: 5,
              admin: {
                placeholder: 'Selecione as Categorias do Post',
              },
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'commission',
                  type: 'relationship',
                  label: 'Comissão',
                  relationTo: 'commissions',
                  admin: {
                    placeholder: 'Selecione a comissão',
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
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'highlight',
              type: 'checkbox',
              label: 'Destaque',
              defaultValue: false,
              admin: {
                description: 'Define se o post aparece na home',
              },
            },
            {
              name: 'authors',
              type: 'relationship',
              label: 'Autores',
              relationTo: 'users',
              hasMany: true,
              maxRows: 3,
              admin: {
                placeholder: 'Selecione os Autores do Post',
              },
              hooks: {
                beforeChange: [populateFirstAuthorHook],
              },
            },
            {
              name: 'populatedAuthors',
              type: 'array',
              label: 'Autores Populados',
              access: {
                update: () => false,
              },
              admin: {
                disabled: true,
                readOnly: true,
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                  label: 'ID',
                },
                {
                  name: 'name',
                  type: 'text',
                  label: 'Nome',
                },
              ],
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: 'Posts Relacionados',
              relationTo: 'posts',
              hasMany: true,
              maxRows: 3,
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              admin: {
                placeholder: 'Selecione Até 3 Posts Relacionados',
              },
            },
          ],
        },
        {
          label: 'SEO',
          name: 'meta',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'files',
              hasGenerateFn: true,
            }),
            MetaDescriptionField({
              hasGenerateFn: true,
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy, HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
    {
      name: 'notificationSent',
      type: 'checkbox',
      label: 'Notificação Enviada',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Marcado automaticamente quando o post é enviado aos inscritos da newsletter.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Tempo de Leitura (min)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculado automaticamente com base no conteúdo.',
      },
      hooks: {
        beforeChange: [calculateReadingTimeHook],
      },
    },
    editedByField,
  ],
  hooks: {
    beforeChange: [markForNotificationHook],
    afterChange: [revalidatePostHook, queuePostNotificationHook],
    afterRead: [populateAuthorsHook],
    afterDelete: [revalidateDeleteHook],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
}
