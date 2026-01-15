'use client'

import { useState } from 'react'
import { Users, Scale } from 'lucide-react'
import type { Composition, TedMember } from '@/payload-types'

interface TedCompositionTabProps {
  compositions: Composition[]
  membersByComposition: Record<number, TedMember[]>
}

/**
 * Formata o valor do cargo para um label legível
 */
function formatPositionLabel(position: string | null | undefined): string {
  if (!position) return ''

  // Mapeamento de valores para labels formatados
  const labelMap: Record<string, string> = {
    presidente: 'Presidente',
    'vice-presidente': 'Vice Presidente',
    'secretario-geral': 'Secretário Geral',
    'secretaria-geral': 'Secretária Geral',
  }

  // Se existe no mapa, retorna o label formatado
  if (labelMap[position]) {
    return labelMap[position]
  }

  // Caso contrário, formata o valor: substitui hífens por espaços e capitaliza
  return position
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Ordem de prioridade dos cargos para ordenação
 */
function getPositionOrder(position: string | null | undefined): number {
  if (!position) return 999

  const order: Record<string, number> = {
    presidente: 1,
    'vice-presidente': 2,
    'secretario-geral': 3,
    'secretaria-geral': 4,
  }

  return order[position] || 999
}

function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export function TedCompositionTab({ compositions, membersByComposition }: TedCompositionTabProps) {
  const [activeCompositionId, setActiveCompositionId] = useState<number | null>(
    compositions.length > 0 ? compositions[0].id : null,
  )

  if (compositions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Composição</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Nenhuma composição cadastrada ainda.
        </p>
      </div>
    )
  }

  const activeMembers = activeCompositionId ? membersByComposition[activeCompositionId] || [] : []

  const sortedMembers = [...activeMembers].sort((a, b) => {
    const aOrder = getPositionOrder(a.position)
    const bOrder = getPositionOrder(b.position)

    if (aOrder !== 999 || bOrder !== 999) {
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
    }

    if (a.position && !b.position) return -1
    if (!a.position && b.position) return 1
    return (a.name || '').localeCompare(b.name || '', 'pt-BR')
  })

  return (
    <div className="space-y-6">
      {/* Tabs das composições */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
            {compositions.map((composition) => {
              const members = membersByComposition[composition.id] || []
              const isActive = activeCompositionId === composition.id
              return (
                <button
                  key={composition.id}
                  onClick={() => setActiveCompositionId(composition.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#0066cc] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{composition.title}</span>
                  {members.length > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {members.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Conteúdo da composição ativa */}
        <div className="p-6">
          {activeCompositionId && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {compositions.find((c) => c.id === activeCompositionId)?.title}
              </h3>

              {sortedMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum membro cadastrado para esta composição.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedMembers.map((member) => {
                    const initials = getInitials(member.name || '')

                    return (
                      <div
                        key={member.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                            <span className="font-bold text-xl">{initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            {member.position && (
                              <span className="inline-block px-2 py-1 bg-[#0066cc] text-white rounded text-xs mb-1">
                                {formatPositionLabel(member.position)}
                              </span>
                            )}
                          </div>
                        </div>
                        <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {member.name}
                        </h5>
                        {member.oabNumber && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            OAB/SC {member.oabNumber}
                          </p>
                        )}
                        {member.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            📍 {member.location}
                          </p>
                        )}
                        {member.memberType && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {member.memberType === 'titular' ? '👤 Titular' : '👤 Suplente'}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
