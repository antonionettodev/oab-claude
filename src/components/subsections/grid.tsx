import { MapPin } from 'lucide-react'

import { SubsectionCard } from './card'
import { SubsectionsPagination } from './pagination'
import type { Subsection } from '@/payload-types'

interface SubsectionsGridSectionProps {
  subsections: Subsection[]
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function SubsectionsGridSection({
  subsections,
  totalDocs,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: SubsectionsGridSectionProps) {
  if (subsections.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma subseção encontrada
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Tente buscar por outra cidade ou ajustar os filtros
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Mostrando <strong>{subsections.length}</strong> de <strong>{totalDocs}</strong> subseções
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsections.map((subsection) => (
          <SubsectionCard key={subsection.id} subsection={subsection} />
        ))}
      </div>

      {totalPages > 1 && (
        <SubsectionsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      )}
    </div>
  )
}
