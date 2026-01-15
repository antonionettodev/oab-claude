'use client'

import { Search, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import type { CommissionArea } from '@/payload-types'
import { useDebounce } from '@/hooks/use-debounce'

interface CommissionsFiltersSectionProps {
  areas: CommissionArea[]
  currentSearch: string
  currentArea: string
}

export function CommissionsFiltersSection({
  areas,
  currentSearch,
  currentArea,
}: CommissionsFiltersSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)

  const isFirstRender = useRef(true)
  const debouncedSearch = useDebounce(searchValue, 500)

  useEffect(() => {
    if (isFirstRender.current && searchValue === currentSearch) {
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
      router.push(`/comissoes?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearch, router, searchParams])

  const handleAreaClick = (areaId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentArea === areaId) {
      params.delete('area')
    } else {
      params.set('area', areaId)
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/comissoes?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Todas as Comissões
      </h3>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="relative mb-6">
          {isPending ? (
            <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0066cc] animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
          <Input
            type="text"
            placeholder="Buscar comissões..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoComplete="off"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-blue-500 transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Area Filters */}
        <div>
          <label className="block text-sm mb-3 text-gray-700 dark:text-gray-300">
            Filtrar por Área:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('area')
                params.delete('page')
                startTransition(() => {
                  router.push(`/comissoes?${params.toString()}`, { scroll: false })
                })
              }}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm transition-all disabled:opacity-50 ${
                !currentArea
                  ? 'bg-[#0066cc] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => handleAreaClick(String(area.id))}
                disabled={isPending}
                className={`px-4 py-2 rounded-full text-sm transition-all disabled:opacity-50 ${
                  currentArea === String(area.id)
                    ? 'bg-[#0066cc] dark:bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
