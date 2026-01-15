import type { Metadata } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BoardHeroSection } from '@/components/board/hero'
import { BoardTabs } from '@/components/board/tabs'
import type { Board, Management, Counselor } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Diretoria | OAB/SC',
  description:
    'Conheça a história e a composição da Diretoria da Ordem dos Advogados do Brasil - Seccional Santa Catarina.',
}

export default async function DiretoriaPage() {
  const currentManagement = await getCurrentManagement()
  const currentMembers = currentManagement
    ? await getBoardMembersByManagement({ managementId: currentManagement.id })
    : []
  const previousManagements = await getPreviousManagements({
    currentManagementId: currentManagement?.id,
  })
  const previousManagementsMembers = await getPreviousManagementsMembers({
    managementIds: previousManagements.map((m) => m.id),
  })
  const exPresidents = await getExPresidents({
    currentManagementId: currentManagement?.id,
  })
  const estadualCounselors = await getCounselorsByType({ councilType: 'estadual' })
  const federalCounselors = await getCounselorsByType({ councilType: 'federal' })

  return (
    <main>
      <BoardHeroSection />

      <BoardTabs
        currentMembers={currentMembers}
        previousManagements={previousManagements}
        previousManagementsMembers={previousManagementsMembers}
        exPresidents={exPresidents}
        estadualCounselors={estadualCounselors}
        federalCounselors={federalCounselors}
      />
    </main>
  )
}

const getCurrentManagement = cache(async (): Promise<Management | null> => {
  const payload = await getPayload({ config: configPromise })
  const currentYear = new Date().getFullYear()

  const result = await payload.find({
    collection: 'managements',
    limit: 1,
    depth: 0,
    pagination: false,
    where: {
      and: [
        {
          managementStart: {
            less_than_equal: currentYear,
          },
        },
        {
          managementEnd: {
            greater_than_equal: currentYear,
          },
        },
      ],
    },
    sort: '-managementStart',
  })

  return result.docs?.[0] || null
})

const getBoardMembersByManagement = cache(
  async ({ managementId }: { managementId: number }): Promise<Board[]> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'board',
      limit: 100,
      depth: 1,
      pagination: false,
      where: {
        management: {
          equals: managementId,
        },
      },
      sort: 'position',
    })

    return result.docs as Board[]
  },
)

const getPreviousManagements = cache(
  async ({
    currentManagementId,
  }: {
    currentManagementId?: number | null
  }): Promise<Management[]> => {
    const payload = await getPayload({ config: configPromise })
    const currentYear = new Date().getFullYear()

    const whereConditions: any[] = [
      {
        managementEnd: {
          less_than: currentYear,
        },
      },
    ]

    if (currentManagementId) {
      whereConditions.push({
        id: {
          not_equals: currentManagementId,
        },
      })
    }

    const result = await payload.find({
      collection: 'managements',
      limit: 100,
      depth: 0,
      pagination: false,
      where: {
        and: whereConditions,
      },
      sort: '-managementStart',
    })

    return result.docs as Management[]
  },
)

const getPreviousManagementsMembers = cache(
  async ({ managementIds }: { managementIds: number[] }): Promise<Record<number, Board[]>> => {
    if (managementIds.length === 0) {
      return {}
    }

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'board',
      limit: 1000,
      depth: 1,
      pagination: false,
      where: {
        management: {
          in: managementIds,
        },
      },
      sort: 'position',
    })

    const membersByManagement: Record<number, Board[]> = {}

    result.docs.forEach((member) => {
      const managementId =
        typeof member.management === 'object' && member.management
          ? member.management.id
          : typeof member.management === 'number'
            ? member.management
            : null

      if (managementId) {
        if (!membersByManagement[managementId]) {
          membersByManagement[managementId] = []
        }
        membersByManagement[managementId].push(member as Board)
      }
    })

    return membersByManagement
  },
)

const getExPresidents = cache(
  async ({
    currentManagementId,
  }: {
    currentManagementId?: number | null
  }): Promise<Array<{ member: Board; management: Management }>> => {
    const payload = await getPayload({ config: configPromise })
    const currentYear = new Date().getFullYear()

    // Buscar gestões anteriores
    const whereConditions: any[] = [
      {
        managementEnd: {
          less_than: currentYear,
        },
      },
    ]

    if (currentManagementId) {
      whereConditions.push({
        id: {
          not_equals: currentManagementId,
        },
      })
    }

    const managementsResult = await payload.find({
      collection: 'managements',
      limit: 100,
      depth: 0,
      pagination: false,
      where: {
        and: whereConditions,
      },
      sort: '-managementStart',
    })

    const previousManagementIds = managementsResult.docs.map((m) => m.id)

    if (previousManagementIds.length === 0) {
      return []
    }

    // Buscar membros com cargo de presidente das gestões anteriores
    const membersResult = await payload.find({
      collection: 'board',
      limit: 1000,
      depth: 1,
      pagination: false,
      where: {
        and: [
          {
            management: {
              in: previousManagementIds,
            },
          },
          {
            position: {
              equals: 'presidente',
            },
          },
        ],
      },
      sort: '-createdAt',
    })

    // Criar array com membro e gestão correspondente
    const exPresidents: Array<{ member: Board; management: Management }> = []

    membersResult.docs.forEach((member) => {
      const managementId =
        typeof member.management === 'object' && member.management
          ? member.management.id
          : typeof member.management === 'number'
            ? member.management
            : null

      if (managementId) {
        const management = managementsResult.docs.find((m) => m.id === managementId)
        if (management) {
          exPresidents.push({
            member: member as Board,
            management: management as Management,
          })
        }
      }
    })

    return exPresidents
  },
)

const getCounselorsByType = cache(
  async ({ councilType }: { councilType: 'estadual' | 'federal' }): Promise<Counselor[]> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'counselors',
      limit: 1000,
      depth: 1,
      pagination: false,
      where: {
        councilType: {
          equals: councilType,
        },
      },
      sort: 'title',
    })

    return result.docs as Counselor[]
  },
)
