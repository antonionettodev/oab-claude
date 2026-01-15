'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Scale, FileText, Search, Calendar, UserCircle } from 'lucide-react'
import type { Composition, TedMember } from '@/payload-types'
import { TedAboutTab } from './about-tab'
import { TedCompositionTab } from './composition-tab'
import { TedTeamTab } from './team-tab'

type TabKey =
  | 'sobre'
  | 'composicao'
  | 'ementarios'
  | 'legislacoes'
  | 'consulta-processos'
  | 'calendario'
  | 'equipe'

const tabs = [
  { key: 'sobre' as TabKey, label: 'Sobre', icon: Building2 },
  { key: 'composicao' as TabKey, label: 'Composição', icon: Users },
  { key: 'ementarios' as TabKey, label: 'Ementários', icon: Scale },
  { key: 'legislacoes' as TabKey, label: 'Legislações', icon: FileText },
  {
    key: 'consulta-processos' as TabKey,
    label: 'Consulta Processos TED',
    icon: Search,
  },
  { key: 'calendario' as TabKey, label: 'Calendário', icon: Calendar },
  { key: 'equipe' as TabKey, label: 'Equipe', icon: UserCircle },
]

interface TedTabsProps {
  compositions: Composition[]
  membersByComposition: Record<number, TedMember[]>
}

export function TedTabs({ compositions, membersByComposition }: TedTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('sobre')
  const router = useRouter()

  const handleTabClick = (tabKey: TabKey) => {
    if (tabKey === 'ementarios') {
      router.push('/ted-ementarios')
    } else if (tabKey === 'legislacoes') {
      router.push('/ted-legislacoes')
    } else if (tabKey === 'calendario') {
      router.push('/ted-calendario')
    } else if (tabKey === 'consulta-processos') {
      window.open(
        'https://servicos.oab-sc.org.br/hbconselhos/login/AutenticarAcesso.aspx?Destino=../pgsProcesso/ConsultarProcessosTEDViaSite.aspx',
        '_blank',
        'noopener,noreferrer',
      )
    } else {
      setActiveTab(tabKey)
    }
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
                  onClick={() => handleTabClick(tab.key)}
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
        {activeTab === 'sobre' && <TedAboutTab />}
        {activeTab === 'composicao' && (
          <TedCompositionTab
            compositions={compositions}
            membersByComposition={membersByComposition}
          />
        )}
        {activeTab === 'equipe' && <TedTeamTab />}
      </div>
    </>
  )
}
