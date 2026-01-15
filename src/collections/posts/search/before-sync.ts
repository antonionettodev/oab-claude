import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const {
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    categories,
    populatedAuthors,
    meta,
    id,
    title,
  } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    excerpt,
    featuredImage: typeof featuredImage === 'object' ? featuredImage?.id : featuredImage,
    publishedAt,
    categories: [],
    populatedAuthors: [],
    meta: {
      title: meta?.title || title,
      description: meta?.description || excerpt,
      image: typeof meta?.image === 'object' ? meta?.image?.id : meta?.image,
    },
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []

    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Falha: categoria não encontrada ao sincronizar a coleção '${collection}' com o ID '${id}' para a busca.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((cat) => ({
      categoryId: String(cat.id),
      title: cat.title,
    }))
  }

  if (populatedAuthors && Array.isArray(populatedAuthors) && populatedAuthors.length > 0) {
    modifiedDoc.populatedAuthors = populatedAuthors.map(
      (author: { id: string | number; name: string }) => ({
        authorId: String(author.id),
        name: author.name,
      }),
    )
  }

  return modifiedDoc
}
