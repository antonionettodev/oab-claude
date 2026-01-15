import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

export const revalidatePostHook: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidando Post: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidando Post Antigo: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDeleteHook: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')
  }

  return doc
}
