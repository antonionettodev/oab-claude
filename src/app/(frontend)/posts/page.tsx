import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PostsHeroSection } from '@/components/posts/hero'
import { PostsGridSection } from '@/components/posts/grid'

type SearchParams = {
  category?: string
  search?: string
  page?: string
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const dynamic = 'force-dynamic'

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const payload = await getPayload({ config: configPromise })

  const category = params.category
  const search = params.search
  const page = params.page ? parseInt(params.page) : 1

  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })

  const whereConditions: any[] = []

  if (search) {
    whereConditions.push({
      or: [
        { title: { like: search } },
        { excerpt: { like: search } },
        { 'meta.title': { like: search } },
        { 'meta.description': { like: search } },
        { 'categories.title': { like: search } },
        { slug: { like: search } },
      ],
    })
  }

  if (category && category !== 'todas') {
    whereConditions.push({
      'categories.title': { equals: category },
    })
  }

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    page,
    sort: '-publishedAt',
    ...(whereConditions.length > 0
      ? {
          where: {
            and: whereConditions,
          },
        }
      : {}),
  })

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <PostsHeroSection />
      <PostsGridSection
        posts={posts.docs}
        categories={categoriesData.docs}
        currentCategory={category}
        currentSearch={search}
        pagination={{
          page: posts.page || 1,
          totalPages: posts.totalPages || 1,
          totalDocs: posts.totalDocs,
        }}
      />
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Notícias | OAB/SC',
    description: 'Acompanhe as últimas notícias, eventos e atualizações da OAB Santa Catarina.',
  }
}
