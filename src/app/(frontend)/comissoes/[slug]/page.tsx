import type { Metadata } from 'next/types'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

import { CommissionHeader } from '@/components/commissions/header'
import { CommissionTabs } from '@/components/commissions/tabs'
import type { CommissionMember, Post, Event } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const commissions = await payload.find({
    collection: 'commissions',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return commissions.docs.map(({ slug }) => ({ slug }))
}

export default async function CommissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug = '' } = await params

  const decodedSlug = decodeURIComponent(slug)
  const commission = await queryCommissionBySlug({ slug: decodedSlug })

  if (!commission) {
    notFound()
  }

  const members = await queryMembersByCommission({ commissionId: commission.id })
  const posts = await queryPostsByCommission({ commissionId: commission.id })
  const events = await queryEventsByCommission({ commissionId: commission.id })

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <CommissionHeader commission={commission} membersCount={members.length} />
      <CommissionTabs commission={commission} members={members} posts={posts} events={events} />
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>
}): Promise<Metadata> {
  const { slug = '' } = await params
  const commission = await queryCommissionBySlug({ slug: decodeURIComponent(slug) })

  if (!commission) {
    return {
      title: 'Comissão não encontrada | OAB/SC',
    }
  }

  return {
    title: `${commission.title} | Comissões OAB/SC`,
    description: commission.about || `Conheça a ${commission.title} da OAB/SC.`,
  }
}

const queryCommissionBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'commissions',
    limit: 1,
    depth: 2,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

const queryMembersByCommission = cache(async ({ commissionId }: { commissionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'commission-members',
    limit: 100,
    depth: 2,
    pagination: false,
    where: { commission: { equals: commissionId } },
    sort: 'position',
  })

  return result.docs as CommissionMember[]
})

const queryPostsByCommission = cache(async ({ commissionId }: { commissionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    limit: 12,
    depth: 2,
    pagination: false,
    where: {
      commission: { equals: commissionId },
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })

  return result.docs as Post[]
})

const queryEventsByCommission = cache(async ({ commissionId }: { commissionId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    limit: 12,
    depth: 2,
    pagination: false,
    where: {
      commission: { equals: commissionId },
      status: { equals: 'active' },
    },
    sort: 'startDate',
  })

  return result.docs as Event[]
})
