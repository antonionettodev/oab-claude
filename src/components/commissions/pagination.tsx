'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'

interface CommissionsPaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function CommissionsPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: CommissionsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const navigateToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())

      startTransition(() => {
        router.push(`/comissoes?${params.toString()}`)
      })
    },
    [router, searchParams],
  )

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={!hasPrevPage || isPending}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={!hasNextPage || isPending}
        className="flex items-center gap-1"
      >
        Próxima
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
