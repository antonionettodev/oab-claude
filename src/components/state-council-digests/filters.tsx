'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

interface StateCouncilDigestsFiltersProps {
  currentSearch: string
  currentYearStart: string
  currentYearEnd: string
  availableYears: number[]
}

export function StateCouncilDigestsFilters({
  currentSearch,
  currentYearStart,
  currentYearEnd,
  availableYears,
}: StateCouncilDigestsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [yearStart, setYearStart] = useState(currentYearStart)
  const [yearEnd, setYearEnd] = useState(currentYearEnd)
  const [yearError, setYearError] = useState('')
  const isFirstRender = useRef(true)
  const debouncedSearch = useDebounce(searchValue, 500)

  // Validar anos quando mudarem
  useEffect(() => {
    if (yearStart && yearEnd) {
      const start = Number.parseInt(yearStart, 10)
      const end = Number.parseInt(yearEnd, 10)
      if (start > end) {
        setYearError('O ano inicial deve ser menor ou igual ao ano final')
      } else {
        setYearError('')
      }
    } else {
      setYearError('')
    }
  }, [yearStart, yearEnd])

  useEffect(() => {
    if (isFirstRender.current && searchValue === currentSearch) {
      isFirstRender.current = false
      return
    }

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
      router.push(`/ementarios-conselho-estadual?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearch, router, currentSearch, searchParams])

  const handleSearch = () => {
    // Não permitir busca se houver erro de validação
    if (yearError) {
      return
    }

    const params = new URLSearchParams()

    if (searchValue && searchValue.trim()) {
      params.set('search', searchValue.trim())
    } else {
      params.delete('search')
    }

    if (yearStart) {
      params.set('yearStart', yearStart)
    } else {
      params.delete('yearStart')
    }

    if (yearEnd) {
      params.set('yearEnd', yearEnd)
    } else {
      params.delete('yearEnd')
    }

    params.delete('page')

    startTransition(() => {
      router.push(`/ementarios-conselho-estadual?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Pesquisar Ementas
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ano Início */}
          <div>
            <label
              htmlFor="year-start"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Ano Início
            </label>
            <select
              id="year-start"
              value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent ${
                yearError
                  ? 'border-orange-400 dark:border-orange-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Selecione o ano</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Ano Fim */}
          <div>
            <label
              htmlFor="year-end"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Ano Fim
            </label>
            <select
              id="year-end"
              value={yearEnd}
              onChange={(e) => setYearEnd(e.target.value)}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent ${
                yearError
                  ? 'border-orange-400 dark:border-orange-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Selecione o ano</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Busca por Texto */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Texto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Digite o texto para buscar..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {yearError && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4">
            <p className="text-sm text-orange-700 dark:text-orange-400">{yearError}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            disabled={isPending || !!yearError}
            className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Pesquisando...' : 'PESQUISAR'}
          </Button>
        </div>
      </div>
    </div>
  )
}
