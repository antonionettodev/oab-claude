import { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import {
  GenerateTitle,
  GenerateURL,
  GenerateDescription,
  GenerateImage,
} from '@payloadcms/plugin-seo/types'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Post } from '@/payload-types'

import { beforeSyncWithSearch } from '@/collections/posts/search/before-sync'
import { getServerSideURL } from '@/lib/get-urls'
import { postSearchFields } from '@/collections/posts/search/search-field'
import { revalidateRedirectsHook } from '@/hooks/revalidate-redirects'

const generateTitle: GenerateTitle<Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | OAB/SC` : 'OAB Santa Catarina'
}

const generateURL: GenerateURL<Post> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const generateDescription: GenerateDescription<Post> = ({ doc }) => {
  return doc?.excerpt || ''
}

const generateImage: GenerateImage<Post> = ({ doc }) => {
  if (!doc?.featuredImage) {
    return ''
  }

  if (typeof doc.featuredImage === 'object') {
    return doc.featuredImage.id
  }

  return doc.featuredImage
}

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      files: true,
    },
    bucket: process.env.MINIO_BUCKET!,
    config: {
      endpoint: process.env.MINIO_ENDPOINT,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      region: process.env.MINIO_REGION,
      forcePathStyle: true,
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
    generateDescription,
    generateImage,
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: 'Pesquisa',
        plural: 'Pesquisas',
      },
      admin: {
        hidden: false,
        group: 'Sistema e Configurações',
        description:
          'Esta é uma lista de resultados de busca gerada automaticamente. Ela é usada na busca geral do site e é atualizada sozinha sempre que novos conteúdos são criados ou modificados no CMS.',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...postSearchFields]
      },
    },
  }),
  redirectsPlugin({
    collections: ['posts'],
    overrides: {
      labels: {
        singular: 'Redirecionamento',
        plural: 'Redirecionamentos',
      },
      admin: {
        group: 'Sistema e Configurações',
      },
      // @ts-expect-error
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              label: 'URL de Origem',
              admin: {
                description: 'Você precisará rebuildar o website ao alterar este campo.',
                placeholder: 'URL antiga que você deseja redirecionar',
              },
            }
          }

          if ('name' in field && field.name === 'to') {
            return {
              ...field,
              label: 'URL de Destino (Nova)',
              // @ts-expect-error
              fields: field.fields.map((sub) => {
                if (sub.name === 'type') {
                  return {
                    ...sub,
                    label: 'Tipo de Destino',
                    options: [
                      { label: 'Link Interno', value: 'reference' },
                      { label: 'URL Externa', value: 'custom' },
                    ],
                  }
                }

                if (sub.name === 'reference') {
                  return {
                    ...sub,
                    label: 'Documento Interno',
                  }
                }

                if (sub.name === 'url') {
                  return {
                    ...sub,
                    label: 'URL Externa',
                    admin: {
                      ...sub.admin,
                      placeholder: 'https://exemplo.com/nova-url',
                    },
                  }
                }

                return sub
              }),
            }
          }

          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirectsHook],
      },
    },
  }),
]
