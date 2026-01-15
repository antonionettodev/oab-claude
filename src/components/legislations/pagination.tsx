'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const itemsPerPage = 3

interface LegislationsPaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function LegislationsPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: LegislationsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))

    startTransition(() => {
      router.push(`/legislacoes?${params.toString()}`, { scroll: false })
    })
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage || isPending}
        className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
          hasPrevPage
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        {renderPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => goToPage(page)}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                page === currentPage
                  ? 'bg-[#0066cc] text-white shadow-md hover:bg-[#0052a3] hover:text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-gray-400">
              {page}
            </span>
          ),
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage || isPending}
        className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
          hasNextPage
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
        }`}
      >
        Próximo
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
