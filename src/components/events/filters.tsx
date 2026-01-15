'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Commission } from '@/payload-types'

interface EventsFiltersSectionProps {
  commissions: Commission[]
  currentSearch: string
  currentType: string
  currentModality: string
  currentStatus: string
  currentCommission: string
}

export function EventsFiltersSection({
  commissions,
  currentSearch,
  currentType,
  currentModality,
  currentStatus,
  currentCommission,
}: EventsFiltersSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
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

  const hasActiveFilters =
    currentSearch || currentType || currentModality || currentStatus || currentCommission

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos..."
            defaultValue={currentSearch}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tipo */}
        <Select value={currentType} onValueChange={(value) => updateFilters('type', value)}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="event">Evento</SelectItem>
            <SelectItem value="course">Curso</SelectItem>
          </SelectContent>
        </Select>

        {/* Modalidade */}
        <Select value={currentModality} onValueChange={(value) => updateFilters('modality', value)}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-person">Presencial</SelectItem>
            <SelectItem value="hybrid">Híbrido</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={currentStatus} onValueChange={(value) => updateFilters('status', value)}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
            <SelectItem value="closed">Encerrado</SelectItem>
          </SelectContent>
        </Select>

        {/* Comissão */}
        <Select
          value={currentCommission}
          onValueChange={(value) => updateFilters('commission', value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Comissão" />
          </SelectTrigger>
          <SelectContent>
            {commissions.map((commission) => (
              <SelectItem key={commission.id} value={String(commission.id)}>
                {commission.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros:</span>

          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              Busca: {currentSearch}
              <button onClick={() => updateFilters('search', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {currentType && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {currentType === 'event' ? 'Evento' : 'Curso'}
              <button onClick={() => updateFilters('type', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {currentModality && (
            <Badge variant="secondary" className="gap-1">
              Modalidade:{' '}
              {currentModality === 'in-person'
                ? 'Presencial'
                : currentModality === 'hybrid'
                  ? 'Híbrido'
                  : 'Virtual'}
              <button onClick={() => updateFilters('modality', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {currentStatus && (
            <Badge variant="secondary" className="gap-1">
              Status:{' '}
              {currentStatus === 'active'
                ? 'Ativo'
                : currentStatus === 'cancelled'
                  ? 'Cancelado'
                  : 'Encerrado'}
              <button onClick={() => updateFilters('status', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {currentCommission && (
            <Badge variant="secondary" className="gap-1">
              Comissão:{' '}
              {commissions.find((c) => String(c.id) === currentCommission)?.title ||
                currentCommission}
              <button onClick={() => updateFilters('commission', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
            Limpar filtros
          </Button>
        </div>
      )}

      {isPending && <div className="text-sm text-muted-foreground">Carregando...</div>}
    </div>
  )
}
