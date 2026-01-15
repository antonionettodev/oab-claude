'use client'

import { useSearchParams } from 'next/navigation'
import { LegislationDownloadCard } from './download-card'
import { LegislationsPagination, itemsPerPage } from './pagination'
import type { Legislation } from '@/payload-types'

interface LegislationDownloadListProps {
  legislations: Legislation[]
  onDownload?: (fileUrl: string) => void
}

export function LegislationDownloadList({
  legislations,
  onDownload,
}: LegislationDownloadListProps) {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const totalPages = Math.ceil(legislations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLegislations = legislations.slice(startIndex, endIndex)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  if (legislations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600">Nenhuma legislação disponível no momento.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Legislações Disponíveis para Download
        </h2>
        <p className="text-gray-600">
          Mostrando <strong>{paginatedLegislations.length}</strong> de{' '}
          <strong>{legislations.length}</strong> legislações
        </p>
      </div>

      <div className="space-y-4">
        {paginatedLegislations.map((legislation) => {
          const typeTitle =
            typeof legislation.type === 'object' && legislation.type !== null
              ? legislation.type.title
              : ''
          return (
            <LegislationDownloadCard
              key={legislation.id}
              title={legislation.title}
              typeTitle={typeTitle}
              file={legislation.file}
              createdAt={legislation.createdAt}
              onDownload={onDownload}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <LegislationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      )}
    </div>
  )
}
