import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import { UrhHeroSection } from '@/components/urh-honorarium/hero'
import { UrhInfoBox } from '@/components/urh-honorarium/info-box'
import { UrhDownloadList } from '@/components/urh-honorarium/download-list'
import { UrhAdditionalInfoCards } from '@/components/urh-honorarium/additional-info-cards'
import type { UrhHonorarium } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tabela de Honorários | OAB/SC',
  description: 'Consulte e baixe as tabelas de honorários advocatícios da OAB/SC',
}

export default async function UrhHonorariumPage() {
  const urhs = await queryUrhHonorariums()

  return (
    <main className="bg-gray-50">
      <UrhHeroSection />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <UrhInfoBox />
          <UrhDownloadList urhs={urhs} />
          <UrhAdditionalInfoCards />
        </div>
      </div>
    </main>
  )
}

const queryUrhHonorariums = cache(async (): Promise<UrhHonorarium[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'urh-honorarium',
    limit: 100,
    depth: 2,
    pagination: false,
    sort: '-createdAt',
  })

  return result.docs as UrhHonorarium[]
})
