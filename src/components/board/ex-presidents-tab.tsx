'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Award } from 'lucide-react'
import type { Board, Management, File as PayloadFile } from '@/payload-types'
import { BoardPagination, itemsPerPage } from './pagination'

interface BoardExPresidentsTabProps {
  exPresidents: Array<{
    member: Board
    management: Management
  }>
}

export function BoardExPresidentsTab({ exPresidents }: BoardExPresidentsTabProps) {
  const searchParams = useSearchParams()
  const isExPresidentsTab = searchParams.get('ex-presidentes') === 'true'
  const currentPage = isExPresidentsTab ? Number(searchParams.get('page')) || 1 : 1

  const sortedPresidents = [...exPresidents].sort((a, b) => {
    if (b.management.managementStart !== a.management.managementStart) {
      return b.management.managementStart - a.management.managementStart
    }
    return b.management.managementEnd - a.management.managementEnd
  })

  const totalPages = Math.ceil(sortedPresidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPresidents = sortedPresidents.slice(startIndex, endIndex)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  if (sortedPresidents.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Ex. Presidentes
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Nenhum ex-presidente cadastrado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Ex. Presidentes
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Lista de ex-presidentes da OAB/SC.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPresidents.map(({ member, management }) => {
          const image = member.photo as PayloadFile | null
          const initials = member.title
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

          return (
            <div
              key={`${member.id}-${management.id}`}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {image?.url ? (
                  <Image
                    src={image.url || '/placeholder.svg'}
                    alt={member.title || 'Ex-Presidente'}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-2xl">{initials || '?'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 bg-[#0066cc] text-white rounded-md text-sm font-medium mb-1">
                    Presidente
                  </span>
                </div>
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {member.title}
              </h5>
              {member.oabNumber && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  OAB/SC {member.oabNumber}
                </p>
              )}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gestão: {management.managementStart} - {management.managementEnd}
                </p>
              </div>
              {member.biography && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                    {member.biography}
                  </p>
                </div>
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
          tabIdentifier="ex-presidentes"
        />
      )}
    </div>
  )
}
