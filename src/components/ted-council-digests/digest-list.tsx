'use client'

import { FileText } from 'lucide-react'
import type { TedCouncilDigest } from '@/payload-types'
import { HighlightText } from './highlight-text'

interface DigestListProps {
  digests: TedCouncilDigest[]
  currentYear?: number
  searchTerm?: string
}

export function DigestList({ digests, currentYear, searchTerm = '' }: DigestListProps) {
  if (digests.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma ementa encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Não foram encontradas ementas com os filtros selecionados.
        </p>
      </div>
    )
  }

  // Agrupar por ano
  const digestsByYear = digests.reduce(
    (acc, digest) => {
      const year = digest.year
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(digest)
      return acc
    },
    {} as Record<number, TedCouncilDigest[]>,
  )

  const sortedYears = Object.keys(digestsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="space-y-8">
      {sortedYears.map((year) => (
        <div key={year}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{year}</h2>
          <div className="space-y-6">
            {digestsByYear[year].map((digest) => (
              <div
                key={digest.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0066cc] dark:text-blue-400 mb-1">
                      Processo n.{' '}
                      {searchTerm ? (
                        <HighlightText text={digest.processNumber} searchTerm={searchTerm} />
                      ) : (
                        digest.processNumber
                      )}
                    </p>
                    <p className="text-sm font-semibold text-[#0066cc] dark:text-blue-400">
                      ACÓRDÃO n.{' '}
                      {searchTerm ? (
                        <HighlightText text={digest.acordaoNumber} searchTerm={searchTerm} />
                      ) : (
                        digest.acordaoNumber
                      )}
                      /{digest.year}
                    </p>
                  </div>

                  {digest.information && (
                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {searchTerm ? (
                          <HighlightText text={digest.information} searchTerm={searchTerm} />
                        ) : (
                          digest.information
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
