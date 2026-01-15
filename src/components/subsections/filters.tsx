'use client'

import type React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, useTransition } from 'react'
import { Search, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

interface SubsectionRegion {
  id: number
  title: string
}

interface SubsectionsFiltersProps {
  regions: SubsectionRegion[]
  currentSearch: string
  currentRegion: string
}

export function SubsectionsFilters({
  regions,
  currentSearch,
  currentRegion,
}: SubsectionsFiltersProps) {
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
      router.push(`/subsecoes?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearch, router])

  const handleRegionChange = (regionId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (regionId === currentRegion) {
      params.delete('region')
    } else if (regionId) {
      params.set('region', regionId)
    } else {
      params.delete('region')
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/subsecoes?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div>
      <h3 className="text-gray-900 dark:text-gray-100 mb-4">Todas as Subseções</h3>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="relative mb-6">
          {isPending ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066cc] animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
          <Input
            type="text"
            placeholder="Buscar por cidade ou nome da subseção..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-blue-500 transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm mb-3 text-gray-700 dark:text-gray-300">
            Filtrar por Região:
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRegionChange('')}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                !currentRegion
                  ? 'bg-[#0066cc] dark:bg-blue-600 text-white shadow-md hover:bg-[#0052a3] hover:text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todas
            </Button>
            {regions.map((region) => (
              <Button
                key={region.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRegionChange(String(region.id))}
                disabled={isPending}
                className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                  currentRegion === String(region.id)
                    ? 'bg-[#0066cc] dark:bg-blue-600 text-white shadow-md hover:bg-[#0052a3] hover:text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {region.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
