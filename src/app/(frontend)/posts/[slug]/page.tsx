import type { Metadata } from 'next/types'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostHeader } from '@/components/posts/header'
import { PostContent } from '@/components/posts/content'
import { RelatedPosts } from '@/components/posts/related-posts'
import { generateMeta } from '@/lib/generate-meta'
import { Listener } from '@/components/payload/listener'
import { PayloadRedirects } from '@/components/payload/redirects'
import { PostsCta } from '@/components/posts/cta'
import { PostCategories } from '@/components/posts/post-categories'
import { Category } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await params

  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const relatedPosts =
    post.relatedPosts
      ?.filter((p) => typeof p === 'object' && p !== null)
      .map((p) => (typeof p === 'object' ? p : null))
      .filter((p): p is NonNullable<typeof p> => p !== null) || []

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <Listener />}

      <PostHeader post={post} />
      <PostContent post={post} />
      <PostCategories categories={post.categories as Category[]} />
      <RelatedPosts posts={relatedPosts} />
      <PostsCta />
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>
}): Promise<Metadata> {
  const { slug = '' } = await params
  const post = await queryPostBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
