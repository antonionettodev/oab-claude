'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, useTransition } from 'react'
import { Search, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import type { LegislationsType } from '@/payload-types'

interface LegislationsFiltersProps {
  currentSearch: string
  currentType: string
  types: LegislationsType[]
}

export function LegislationsFilters({
  currentSearch,
  currentType,
  types,
}: LegislationsFiltersProps) {
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

    // Só atualiza se o valor da busca realmente mudou
    if (debouncedSearch === currentSearch) {
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
      router.push(`/legislacoes?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearch, router, currentSearch])

  const handleTypeChange = (typeValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeValue === currentType) {
      params.delete('type')
    } else if (typeValue) {
      params.set('type', typeValue)
    } else {
      params.delete('type')
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/legislacoes?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div>
      <h3 className="text-gray-900 mb-4">Todas as Legislações</h3>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="relative mb-6">
          {isPending ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066cc] animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <Input
            type="text"
            placeholder="Buscar por título da legislação..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-4 py-3 !bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-[#0066cc] transition-colors placeholder:text-gray-500"
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm mb-3 text-gray-700">Filtrar por Tipo:</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleTypeChange('')}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                !currentType
                  ? 'bg-[#0066cc] text-white shadow-md hover:bg-[#0052a3] hover:text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </Button>
            {types.map((type) => {
              const typeId =
                typeof type === 'object' && type !== null ? String(type.id) : String(type)
              const typeTitle = typeof type === 'object' && type !== null ? type.title : ''
              return (
                <Button
                  key={typeId}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTypeChange(typeId)}
                  disabled={isPending}
                  className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                    currentType === typeId
                      ? 'bg-[#0066cc] text-white shadow-md hover:bg-[#0052a3] hover:text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {typeTitle}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
