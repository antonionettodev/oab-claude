'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface PostsPaginationProps {
  currentPage: number
  totalPages: number
}

export function PostsPagination({ currentPage, totalPages }: PostsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())

    startTransition(() => {
      router.push(`/posts?${params.toString()}`, { scroll: false })
    })
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          disabled={isPending}
          className={`cursor-pointer min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === 1
              ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          1
        </button>,
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-gray-500 dark:text-gray-400">
            ...
          </span>,
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={isPending}
          className={`cursor-pointer min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === i
              ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>,
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-gray-500 dark:text-gray-400">
            ...
          </span>,
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={isPending}
          className={`cursor-pointer min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === totalPages
              ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="cursor-pointer h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {isPending && <Loader2 className="w-5 h-5 text-[#0066cc] animate-spin mx-2" />}

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="cursor-pointer h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
