'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Users, Clock, Award, Scale } from 'lucide-react'
import type { Board, Management, Counselor } from '@/payload-types'
import { BoardCurrentManagementTab } from './current-management-tab'
import { BoardPreviousManagementsTab } from './previous-managements-tab'
import { BoardExPresidentsTab } from './ex-presidents-tab'
import { CounselorsTab } from './counselors-tab'

type TabKey =
  | 'gestao-atual'
  | 'gestoes-anteriores'
  | 'ex-presidentes'
  | 'conselho-estadual'
  | 'conselho-federal'

const tabs = [
  { key: 'gestao-atual' as TabKey, label: 'Gestão Atual', icon: Users },
  { key: 'gestoes-anteriores' as TabKey, label: 'Gestões Anteriores', icon: Clock },
  { key: 'ex-presidentes' as TabKey, label: 'Ex. Presidentes', icon: Award },
  { key: 'conselho-estadual' as TabKey, label: 'Conselho Estadual', icon: Scale },
  { key: 'conselho-federal' as TabKey, label: 'Conselho Federal', icon: Scale },
]

interface BoardTabsProps {
  currentMembers: Board[]
  previousManagements: Management[]
  previousManagementsMembers: Record<number, Board[]>
  exPresidents: Array<{
    member: Board
    management: Management
  }>
  estadualCounselors: Counselor[]
  federalCounselors: Counselor[]
}

export function BoardTabs({
  currentMembers,
  previousManagements,
  previousManagementsMembers,
  exPresidents,
  estadualCounselors,
  federalCounselors,
}: BoardTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const getActiveTabFromUrl = (): TabKey | null => {
    if (searchParams.get('conselho-federal') === 'true') return 'conselho-federal'
    if (searchParams.get('conselho-estadual') === 'true') return 'conselho-estadual'
    if (searchParams.get('ex-presidentes') === 'true') return 'ex-presidentes'
    if (searchParams.get('gestao-atual') === 'true') return 'gestao-atual'
    if (searchParams.get('gestoes-anteriores') === 'true') return 'gestoes-anteriores'
    return null
  }

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const tabFromUrl = getActiveTabFromUrl()
    return tabFromUrl || 'gestao-atual'
  })

  useEffect(() => {
    const tabFromUrl = getActiveTabFromUrl()
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    const params = new URLSearchParams()

    if (tab === 'ex-presidentes') {
      params.set('ex-presidentes', 'true')
      params.set('page', '1')
    } else if (tab === 'gestao-atual') {
      params.set('gestao-atual', 'true')
      params.set('page', '1')
    } else if (tab === 'gestoes-anteriores') {
      params.set('gestoes-anteriores', 'true')
      params.set('page', '1')
    } else if (tab === 'conselho-estadual') {
      params.set('conselho-estadual', 'true')
      params.set('page', '1')
    } else if (tab === 'conselho-federal') {
      params.set('conselho-federal', 'true')
      params.set('page', '1')
    }

    const queryString = params.toString()
    router.push(`/diretoria${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {activeTab === 'gestao-atual' && <BoardCurrentManagementTab members={currentMembers} />}
        {activeTab === 'gestoes-anteriores' && (
          <BoardPreviousManagementsTab
            previousManagements={previousManagements}
            previousManagementsMembers={previousManagementsMembers}
          />
        )}
        {activeTab === 'ex-presidentes' && <BoardExPresidentsTab exPresidents={exPresidents} />}
        {activeTab === 'conselho-estadual' && (
          <CounselorsTab counselors={estadualCounselors} councilType="estadual" />
        )}
        {activeTab === 'conselho-federal' && (
          <CounselorsTab counselors={federalCounselors} councilType="federal" />
        )}
      </div>
    </>
  )
}
