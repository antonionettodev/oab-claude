import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirectsHook: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidando Redirecionamentos...`)

  revalidateTag('redirects')

  return doc
}
