import type { CollectionAfterReadHook } from 'payload'
import { User } from '@/payload-types'

import type { FieldHook } from 'payload'

export const populateFirstAuthorHook: FieldHook = async ({ req, operation, value }) => {
  if (operation === 'create' && req.user) {
    if (value && Array.isArray(value) && value.length > 0) {
      return value
    }

    return [req.user.id]
  }

  return value
}

export const populateAuthorsHook: CollectionAfterReadHook = async ({
  doc,
  req,
  req: { payload },
}) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'users',
          depth: 0,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }

        if (authorDocs.length > 0) {
          doc.populatedAuthors = authorDocs.map((authorDoc) => ({
            id: authorDoc.id,
            name: authorDoc.name,
          }))
        }
      } catch {}
    }
  }

  return doc
}
