'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Scale, Users } from 'lucide-react'
import type { AdjudicatingChamber, MembersAdjudicatingChamber } from '@/payload-types'
import { AdjudicatingChamberPagination, itemsPerPage } from './pagination'

interface AdjudicatingChamberTabProps {
  chambers: AdjudicatingChamber[]
  membersByChamber: Record<number, MembersAdjudicatingChamber[]>
}

/**
 * Formata o valor do cargo para um label legível
 */
function formatPositionLabel(position: string | null | undefined): string {
  if (!position) return ''

  const labelMap: Record<string, string> = {
    presidente: 'Presidente',
    'vice-presidente': 'Vice-Presidente',
    relator: 'Relator',
    relatora: 'Relatora',
  }

  if (labelMap[position]) {
    return labelMap[position]
  }

  return position
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Define a ordem de exibição dos cargos
 */
function getPositionOrder(position: string | null | undefined): number {
  if (!position) return 999

  const order: Record<string, number> = {
    presidente: 1,
    'vice-presidente': 2,
    relator: 3,
    relatora: 4,
  }

  return order[position] || 999
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function AdjudicatingChamberTab({
  chambers,
  membersByChamber,
}: AdjudicatingChamberTabProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isInitialMount = useRef(true)
  const lastChamberId = useRef<number | null>(null)

  // Obter chamberId da URL ou usar a primeira câmara
  const getInitialChamberId = (): number | null => {
    const chamberFromUrl = searchParams.get('chamber')
    if (chamberFromUrl) {
      return Number(chamberFromUrl)
    }
    if (chambers.length > 0) {
      return chambers[0].id
    }
    return null
  }

  const [selectedChamberId, setSelectedChamberId] = useState<number | null>(() =>
    getInitialChamberId(),
  )

  // Inicializar com a primeira câmara se não houver na URL
  useEffect(() => {
    if (isInitialMount.current && chambers.length > 0) {
      const chamberFromUrl = searchParams.get('chamber')
      if (!chamberFromUrl) {
        const firstChamberId = chambers[0].id
        setSelectedChamberId(firstChamberId)
        lastChamberId.current = firstChamberId
        const params = new URLSearchParams(searchParams.toString())
        params.set('chamber', String(firstChamberId))
        params.set('page', '1')
        router.replace(`/camara-julgadora?${params.toString()}`, { scroll: false })
      } else {
        lastChamberId.current = Number(chamberFromUrl)
      }
      isInitialMount.current = false
    }
  }, [chambers, searchParams, router])

  // Sincronizar com URL quando mudar (apenas se a URL mudar externamente)
  useEffect(() => {
    if (!isInitialMount.current) {
      const chamberFromUrl = searchParams.get('chamber')
      if (chamberFromUrl) {
        const chamberId = Number(chamberFromUrl)
        // Só atualiza se for diferente do último valor conhecido
        if (chamberId !== lastChamberId.current) {
          setSelectedChamberId(chamberId)
          lastChamberId.current = chamberId
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Atualizar URL quando mudar a câmara selecionada manualmente
  const handleChamberChange = (chamberId: number) => {
    if (chamberId !== selectedChamberId) {
      setSelectedChamberId(chamberId)
      lastChamberId.current = chamberId
      const params = new URLSearchParams(searchParams.toString())
      params.set('chamber', String(chamberId))
      params.set('page', '1')
      router.push(`/camara-julgadora?${params.toString()}`, { scroll: false })
    }
  }

  const members = selectedChamberId ? membersByChamber[selectedChamberId] || [] : []

  // Obter página atual da URL
  const currentPageFromUrl = searchParams.get('page')
  const currentPage = currentPageFromUrl ? Number(currentPageFromUrl) || 1 : 1

  const sortedMembers = [...members].sort((a, b) => {
    const aOrder = getPositionOrder(a.position)
    const bOrder = getPositionOrder(b.position)

    if (aOrder !== 999 || bOrder !== 999) {
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
    }

    if (a.position && !b.position) return -1
    if (!a.position && b.position) return 1
    return (a.title || '').localeCompare(b.title || '', 'pt-BR')
  })

  // Paginação
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const selectedChamber = chambers.find((c) => c.id === selectedChamberId)

  if (chambers.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Câmara Julgadora
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Nenhuma câmara julgadora cadastrada ainda.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs das câmaras */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
            {chambers.map((chamber) => {
              const membersCount = membersByChamber[chamber.id]?.length || 0
              const isActive = selectedChamberId === chamber.id
              return (
                <button
                  key={chamber.id}
                  onClick={() => handleChamberChange(chamber.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#0066cc] text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{chamber.title}</span>
                  {membersCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {membersCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Conteúdo da câmara ativa */}
        <div className="p-6">
          {selectedChamberId && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {selectedChamber?.title}
              </h3>

              {paginatedMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum membro cadastrado para esta câmara julgadora.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedMembers.map((member) => {
                      const initials = getInitials(member.title || '')

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
                            {member.title}
                          </h5>
                          {member.oabNumber && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              OAB/SC {member.oabNumber}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {totalPages > 1 && selectedChamberId && (
                    <AdjudicatingChamberPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPrevPage={hasPrevPage}
                      chamberId={selectedChamberId}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
