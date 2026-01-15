import type { Metadata } from 'next/types'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

import { SubsectionHeader } from '@/components/subsections/header'
import { SubsectionTabs } from '@/components/subsections/tabs'
import type { SubsectionMember, SubsectionRoom, Post } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const subsections = await payload.find({
    collection: 'subsections',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return subsections.docs.map(({ slug }) => ({ slug }))
}

export default async function SubsectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug = '' } = await params

  const decodedSlug = decodeURIComponent(slug)
  const subsection = await querySubsectionBySlug({ slug: decodedSlug })

  if (!subsection) {
    notFound()
  }

  const members = await queryMembersBySubsection({ subsectionId: subsection.id })
  const rooms = await queryRoomsBySubsection({ subsectionId: subsection.id })
  const posts = await queryPostsBySubsection({ subsectionId: subsection.id })

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SubsectionHeader subsection={subsection} />
      <SubsectionTabs subsection={subsection} members={members} posts={posts} rooms={rooms} />
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>
}): Promise<Metadata> {
  const { slug = '' } = await params
  const subsection = await querySubsectionBySlug({ slug: decodeURIComponent(slug) })

  if (!subsection) {
    return {
      title: 'Subseção não encontrada | OAB/SC',
    }
  }

  return {
    title: `${subsection.title} | Subseções OAB/SC`,
    description: subsection.about || `Conheça a Subseção de ${subsection.title} da OAB/SC.`,
  }
}

const querySubsectionBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'subsections',
    limit: 1,
    depth: 2,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

const queryMembersBySubsection = cache(async ({ subsectionId }: { subsectionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'subsection-members',
    limit: 20,
    depth: 2,
    pagination: false,
    where: { subsection: { equals: subsectionId } },
    sort: 'position',
  })

  return result.docs as SubsectionMember[]
})

const queryRoomsBySubsection = cache(async ({ subsectionId }: { subsectionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'subsection-rooms',
    limit: 100,
    depth: 1,
    pagination: false,
    where: { subsection: { equals: subsectionId } },
    sort: 'title',
  })

  return result.docs as SubsectionRoom[]
})

const queryPostsBySubsection = cache(async ({ subsectionId }: { subsectionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    limit: 12,
    depth: 2,
    pagination: false,
    where: {
      subsection: { equals: subsectionId },
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })

  return result.docs as Post[]
})
