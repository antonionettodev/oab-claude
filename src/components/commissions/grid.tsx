import { Users, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import type { Commission, CommissionArea } from '@/payload-types'
import { CommissionsPagination } from './pagination'

interface CommissionsGridSectionProps {
  commissions: Commission[]
  totalDocs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function CommissionsGridSection({
  commissions,
  totalDocs,
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: CommissionsGridSectionProps) {
  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Mostrando <strong>{commissions.length}</strong> de <strong>{totalDocs}</strong> comissões
        </p>
      </div>

      {/* Grid */}
      {commissions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commissions.map((commission) => {
              const areaTitle =
                typeof commission.area === 'object' && commission.area
                  ? (commission.area as CommissionArea).title
                  : 'Sem área'

              return (
                <Link
                  key={commission.id}
                  href={`/comissoes/${commission.slug}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-[#0066cc] dark:hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Users className="w-6 h-6 text-[#0066cc] dark:text-blue-400" />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                      {areaTitle}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors">
                    {commission.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="capitalize">{commission.type}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <CommissionsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhuma comissão encontrada</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Tente ajustar os filtros ou termos de busca
          </p>
        </div>
      )}
    </div>
  )
}
