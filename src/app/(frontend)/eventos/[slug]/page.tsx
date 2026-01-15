import type { Metadata } from 'next/types'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { EventHeader } from '@/components/events/header'
import { EventContent } from '@/components/events/content'
import { EventSidebar } from '@/components/events/sidebar'
import { generateMeta } from '@/lib/generate-meta'
import { Listener } from '@/components/payload/listener'
import { PayloadRedirects } from '@/components/payload/redirects'
import type { Speaker } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return events.docs.map(({ slug }) => ({ slug }))
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await params

  const decodedSlug = decodeURIComponent(slug)
  const url = '/eventos/' + decodedSlug
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) return <PayloadRedirects url={url} />

  const speakers = (event.speakers?.filter((s) => typeof s === 'object') as Speaker[]) || []

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <Listener />}

      <EventHeader event={event} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventContent event={event} speakers={speakers} />
          </div>
          <div className="lg:col-span-1">
            <EventSidebar event={event} />
          </div>
        </div>
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>
}): Promise<Metadata> {
  const { slug = '' } = await params
  const event = await queryEventBySlug({ slug: decodeURIComponent(slug) })
  return generateMeta({ doc: event })
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
