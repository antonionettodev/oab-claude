import type { Metadata } from 'next'

import type { File, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './merge-open-graph'
import { getServerSideURL } from './get-urls'

const getImageURL = (image?: File | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/oab-sc-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: { doc: Partial<Post> | null }): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? doc?.meta?.title + ' | OAB/SC' : 'OAB Santa Catarina'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
