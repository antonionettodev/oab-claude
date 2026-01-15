'use client'

import { useSearchParams } from 'next/navigation'
import { Users } from 'lucide-react'
import type { Counselor } from '@/payload-types'
import { BoardPagination, itemsPerPage } from './pagination'

interface CounselorsTabProps {
  counselors: Counselor[]
  councilType: 'estadual' | 'federal'
}

/**
 * Formata o tipo de cargo para um label legível
 */
function formatPositionTypeLabel(positionType: string | null | undefined): string {
  if (!positionType) return ''
  return positionType === 'titular' ? 'Titular' : 'Suplente'
}

/**
 * Define a ordem de exibição dos cargos
 */
function getPositionTypeOrder(positionType: string | null | undefined): number {
  if (!positionType) return 999
  return positionType === 'titular' ? 1 : 2
}

export function CounselorsTab({ counselors, councilType }: CounselorsTabProps) {
  const searchParams = useSearchParams()
  const tabParam = councilType === 'estadual' ? 'conselho-estadual' : 'conselho-federal'
  const isActiveTab = searchParams.get(tabParam) === 'true'
  const currentPage = isActiveTab ? Number(searchParams.get('page')) || 1 : 1

  const sortedCounselors = [...counselors].sort((a, b) => {
    const aOrder = getPositionTypeOrder(a.positionType)
    const bOrder = getPositionTypeOrder(b.positionType)

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    if (a.positionType && !b.positionType) return -1
    if (!a.positionType && b.positionType) return 1
    return (a.title || '').localeCompare(b.title || '', 'pt-BR')
  })

  const totalPages = Math.ceil(sortedCounselors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCounselors = sortedCounselors.slice(startIndex, endIndex)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const councilLabel = councilType === 'estadual' ? 'Conselho Estadual' : 'Conselho Federal'

  if (counselors.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{councilLabel}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Nenhum membro cadastrado ainda.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{councilLabel}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Membros do {councilLabel.toLowerCase()} da OAB/SC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedCounselors.map((counselor) => {
          const initials = counselor.title
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

          return (
            <div
              key={counselor.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                  <span className="font-bold text-xl">{initials || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-1 bg-[#0066cc] text-white rounded text-xs mb-1">
                    {formatPositionTypeLabel(counselor.positionType)}
                  </span>
                </div>
              </div>
              <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {counselor.title}
              </h5>
              {counselor.oabNumber && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  OAB/SC {counselor.oabNumber}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <BoardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          tabIdentifier={tabParam as 'conselho-estadual' | 'conselho-federal'}
        />
      )}
    </div>
  )
}
