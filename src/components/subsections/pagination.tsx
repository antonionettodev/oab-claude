'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface SubsectionsPaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function SubsectionsPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: SubsectionsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))

    startTransition(() => {
      router.push(`/subsecoes?${params.toString()}`)
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
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage || isPending}
        className="flex items-center gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToPage(page)}
              disabled={isPending}
              className={`cursor-pointer ${
                page === currentPage ? 'bg-[#0066cc] hover:bg-[#0052a3]' : ''
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
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage || isPending}
        className="flex items-center gap-1 cursor-pointer"
      >
        Próximo
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
