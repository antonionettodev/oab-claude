'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface TedCalendarFiltersProps {
  currentYear: string
  availableYears: number[]
}

export function TedCalendarFilters({ currentYear, availableYears }: TedCalendarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (year && year !== '') {
      params.set('year', year)
    } else {
      params.delete('year')
    }

    startTransition(() => {
      router.push(`/ted-calendario?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#0066cc]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtrar por Ano</h3>
      </div>

      <div className="relative">
        <select
          id="year-select"
          value={currentYear}
          onChange={(e) => handleYearChange(e.target.value)}
          disabled={isPending}
          className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableYears
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>
    </div>
  )
}
