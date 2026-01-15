'use client'

import { useState } from 'react'
import { FileText, Users, Newspaper, Calendar, Target, CheckCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Commission, CommissionMember, File, Post, Event } from '@/payload-types'
import { CommissionRelatedPosts } from './related-posts'
import { CommissionRelatedEvents } from './related-events'

interface CommissionTabsProps {
  commission: Commission
  members: CommissionMember[]
  posts: Post[]
  events: Event[]
}

type TabKey = 'apresentacao' | 'membros' | 'noticias' | 'agenda'

const tabs = [
  { key: 'apresentacao' as TabKey, label: 'Apresentação', icon: FileText },
  { key: 'membros' as TabKey, label: 'Membros', icon: Users },
  { key: 'noticias' as TabKey, label: 'Notícias', icon: Newspaper },
  { key: 'agenda' as TabKey, label: 'Agenda', icon: Calendar },
]

export function CommissionTabs({ commission, members, posts, events }: CommissionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('apresentacao')

  const directorship = members.filter((m) =>
    ['presidente', 'vice-presidente', 'secretario', 'secretario-adjunto'].includes(m.position),
  )
  const regularMembers = members.filter((m) => ['membro', 'membro-consultivo'].includes(m.position))

  const positionLabels: Record<string, string> = {
    presidente: 'Presidente',
    'vice-presidente': 'Vice-Presidente',
    secretario: 'Secretário(a)',
    'secretario-adjunto': 'Secretário(a) Adjunto(a)',
    membro: 'Membro',
    'membro-consultivo': 'Membro Consultivo',
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
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
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
        {activeTab === 'apresentacao' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Sobre a Comissão
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {commission.about || 'Descrição não disponível.'}
              </p>
            </div>

            {commission.focusAreas && commission.focusAreas.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-[#0066cc] dark:text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Áreas de Foco
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {commission.focusAreas.map((focusArea, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{focusArea.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-2xl p-8 text-center">
              <UserPlus className="w-16 h-16 text-[#0066cc] dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Participe desta Comissão
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Faça parte do trabalho institucional da OAB/SC e contribua para o fortalecimento da
                advocacia catarinense.
              </p>
              <Button className="px-8 py-3 bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white rounded-full hover:shadow-lg">
                Solicitar Inscrição
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'membros' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Membros da Comissão
            </h3>

            {directorship.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Diretoria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {directorship.map((membro) => {
                    const image = typeof membro.image === 'object' ? (membro.image as File) : null
                    return (
                      <div
                        key={membro.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          {image?.url ? (
                            <img
                              src={image.url || '/placeholder.svg'}
                              alt={membro.name}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                              <Users className="w-7 h-7" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-1 bg-[#0066cc] text-white rounded text-xs mb-1">
                              {positionLabels[membro.position] || membro.position}
                            </span>
                          </div>
                        </div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {membro.name}
                        </h5>
                        {membro.oabNumber && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            OAB: {membro.oabNumber}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {regularMembers.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Membros
                </h4>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                  {regularMembers.map((membro) => {
                    const image = typeof membro.image === 'object' ? (membro.image as File) : null
                    return (
                      <div
                        key={membro.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {image?.url ? (
                              <img
                                src={image.url || '/placeholder.svg'}
                                alt={membro.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {membro.name}
                              </p>
                              {membro.oabNumber && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  OAB: {membro.oabNumber}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {positionLabels[membro.position] || membro.position}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Nenhum membro cadastrado nesta comissão.
              </div>
            )}
          </div>
        )}

        {activeTab === 'noticias' && (
          <CommissionRelatedPosts posts={posts} commissionTitle={commission.title} />
        )}

        {activeTab === 'agenda' && (
          <CommissionRelatedEvents events={events} commissionTitle={commission.title} />
        )}
      </div>
    </>
  )
}
