'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Category } from '@/payload-types'
import { useDebounce } from '@/hooks/use-debounce'

interface PostsCategoryFiltersProps {
  categories: Category[]
  totalDocs: number
  currentSearch?: string
}

export function PostsCategoryFilters({
  categories,
  totalDocs,
  currentSearch = '',
}: PostsCategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentCategory = searchParams.get('category') || 'todas'

  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const isFirstRender = useRef(true)
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (isFirstRender.current && searchTerm === currentSearch) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch && debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim())
    } else {
      params.delete('search')
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/posts?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearch, router])

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === 'todas') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/posts?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mb-8 transition-colors">
      <div className="relative mb-4">
        {isPending ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066cc] animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <Input
          type="text"
          placeholder="Buscar notícias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />

        <button
          onClick={() => handleCategoryChange('todas')}
          disabled={isPending}
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 ${
            currentCategory === 'todas'
              ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Todas
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.title)}
            disabled={isPending}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 ${
              currentCategory === category.title
                ? 'bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalDocs} {totalDocs === 1 ? 'notícia encontrada' : 'notícias encontradas'}
          {currentSearch && (
            <>
              {' '}
              para &quot;<span className="font-semibold">{currentSearch}</span>&quot;
            </>
          )}
        </p>
      </div>
    </div>
  )
}
