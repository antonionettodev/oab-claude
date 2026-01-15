'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Commission, Subsection } from '@/payload-types'

interface FilterPanelProps {
  commissions: Commission[]
  subsections: Subsection[]
  currentModality: string
  currentStatus: string
  currentCommission: string
  currentCity: string
  onClose?: () => void
  isMobile?: boolean
}

export function EventsFilterPanel({
  commissions,
  subsections,
  currentModality,
  currentStatus,
  currentCommission,
  currentCity,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value && value !== '__all__') {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      params.delete('page')

      startTransition(() => {
        router.push(`/eventos?${params.toString()}`)
      })
    },
    [router, searchParams],
  )

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push('/eventos')
    })
  }, [router])

  const activeFiltersCount =
    (currentModality ? 1 : 0) +
    (currentStatus ? 1 : 0) +
    (currentCommission ? 1 : 0) +
    (currentCity ? 1 : 0)

  // Extrair cidades únicas das subseções
  const cities = [...new Set(subsections.map((s) => s.city).filter(Boolean))]

  return (
    <div
      className={`bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-[#334155] flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-[#0F172A] dark:to-[#1E293B]">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-[#F8FAFC]">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg transition-colors"
            aria-label="Fechar filtros"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="p-4 space-y-5">
        {/* Modalidade - Chips */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">
            Modalidade
          </Label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'in-person', label: 'Presencial' },
              { value: 'virtual', label: 'Online' },
              { value: 'hybrid', label: 'Híbrido' },
            ].map(({ value, label }) => {
              const isSelected = currentModality === value

              return (
                <button
                  key={value}
                  onClick={() => updateFilter('modality', isSelected ? '' : value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-[#334155] text-gray-700 dark:text-[#E2E8F0] hover:bg-gray-200 dark:hover:bg-[#475569]'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cidade - Select */}
        {cities.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">
              Cidade
            </Label>
            <Select
              value={currentCity || '__all__'}
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger className="w-full dark:bg-[#0F172A] dark:border-[#334155] dark:text-[#E2E8F0]">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1E293B] dark:border-[#334155]">
                <SelectItem value="__all__">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city!}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Comissão - Select */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">
            Comissão
          </Label>
          <Select
            value={currentCommission || '__all__'}
            onValueChange={(value) => updateFilter('commission', value)}
          >
            <SelectTrigger className="w-full dark:bg-[#0F172A] dark:border-[#334155] dark:text-[#E2E8F0]">
              <SelectValue placeholder="Todas as comissões" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1E293B] dark:border-[#334155] max-h-[300px]">
              <SelectItem value="__all__">Todas as comissões</SelectItem>
              {commissions.map((commission) => (
                <SelectItem key={commission.id} value={String(commission.id)}>
                  {commission.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 dark:text-[#F8FAFC]">Status</Label>
          <div className="space-y-2">
            {[
              { value: 'active', label: 'Inscrições abertas' },
              { value: 'closed', label: 'Encerrado' },
              { value: 'cancelled', label: 'Cancelado' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${value}`}
                  checked={currentStatus === value}
                  onCheckedChange={(checked) => updateFilter('status', checked ? value : '')}
                />
                <Label
                  htmlFor={`status-${value}`}
                  className="text-sm text-gray-700 dark:text-[#E2E8F0] font-normal cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-[#334155] space-y-2 bg-gray-50 dark:bg-[#0F172A]">
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-gray-300 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#334155] bg-transparent"
          disabled={isPending}
        >
          Limpar tudo
        </Button>
        {isMobile && onClose && (
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#0084ff] to-[#0070e0] dark:from-[#3B82F6] dark:to-[#2563EB] text-white"
          >
            Aplicar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
