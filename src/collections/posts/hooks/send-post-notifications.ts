import type { CollectionAfterChangeHook } from 'payload'
import { CollectionBeforeChangeHook } from 'payload'
import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/lib/get-urls'

export const queuePostNotificationHook: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update') {
    return doc
  }

  const wasJustMarked = previousDoc?.notificationSent !== true && doc.notificationSent === true

  if (!wasJustMarked) {
    return doc
  }

  let postImageUrl: string | undefined

  if (doc.featuredImage && typeof doc.featuredImage === 'object') {
    const siteUrl = getServerSideURL()
    postImageUrl = doc.featuredImage.url ? `${siteUrl}${doc.featuredImage.url}` : undefined
  }

  try {
    await req.payload.jobs.queue({
      task: 'sendPostNotification',
      input: {
        postId: String(doc.id),
        postTitle: doc.title,
        postExcerpt: doc.excerpt,
        postSlug: doc.slug,
        postImageUrl: postImageUrl || '',
      },
    })

    req.payload.logger.info(`Job de notificação enfileirado para o post: ${doc.title}`)
  } catch (error) {
    req.payload.logger.error(
      `Erro ao enfileirar job de notificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    )
  }

  return doc
}

export const markForNotificationHook: CollectionBeforeChangeHook<Post> = async ({
  data,
  originalDoc,
  operation,
}) => {
  if (operation !== 'update') {
    return data
  }

  const wasJustPublished = originalDoc?._status !== 'published' && data._status === 'published'
  const alreadyNotified = originalDoc?.notificationSent === true

  if (wasJustPublished && !alreadyNotified) {
    data.notificationSent = true
  }

  return data
}
