'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, ChevronDown } from 'lucide-react'
import type { Board, Management, File as PayloadFile } from '@/payload-types'
import { BoardPagination, itemsPerPage } from './pagination'

interface BoardPreviousManagementsTabProps {
  previousManagements: Management[]
  previousManagementsMembers: Record<number, Board[]>
}

function formatPositionLabel(position: string | null | undefined): string {
  if (!position) return ''

  const labelMap: Record<string, string> = {
    presidente: 'Presidente',
    'vice-presidente': 'Vice-Presidente',
    'secretario-geral': 'Secretário(a)-Geral',
    'secretario-geral-adjunto': 'Secretário(a)-Geral Adjunto(a)',
    tesoureiro: 'Tesoureiro(a)',
    'tesoureiro-adjunto': 'Tesoureiro(a) Adjunto(a)',
    'diretor-administrativo': 'Diretor(a) Administrativo(a)',
    'diretor-executivo': 'Diretor(a) Executivo(a)',
    'diretor-relacoes-institucionais': 'Diretor(a) de Relações Institucionais',
    'diretor-defesa-prerrogativas-valorizacao-advocacia':
      'Diretor(a) de Defesa das Prerrogativas e Valorização da Advocacia',
    'diretor-educacao-juridica': 'Diretor(a) de Educação Jurídica',
    'diretor-iniciacao-profissional': 'Diretor(a) de Iniciação Profissional',
    'diretor-tecnologia-inovacao': 'Diretor(a) de Tecnologia e Inovação',
    'diretor-inclusao-acessibilidade': 'Diretor(a) de Inclusão e Acessibilidade',
    'diretor-interiorizacao': 'Diretor(a) de Interiorização',
    'diretor-assuntos-penais': 'Diretor(a) de Assuntos Penais',
    'diretor-atendimento': 'Diretor(a) de Atendimento',
    'diretor-relacionamento-justica-federal': 'Diretor(a) de Relacionamento com a Justiça Federal',
    'diretor-relacionamento-justica-estadual':
      'Diretor(a) de Relacionamento com a Justiça Estadual',
    'diretor-relacionamento-justica-trabalho':
      'Diretor(a) de Relacionamento com a Justiça do Trabalho',
    'diretor-relacionamento-justica-eleitoral':
      'Diretor(a) de Relacionamento com a Justiça Eleitoral',
    'conselho-estadual-titular': 'Conselho Estadual Titular',
    'conselho-estadual-suplente': 'Conselho Estadual Suplente',
    'conselho-federal-titular': 'Conselho Federal Titular',
    'conselho-federal-suplente': 'Conselho Federal Suplente',
  }

  if (labelMap[position]) {
    return labelMap[position]
  }

  return position
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getPositionOrder(position: string | null | undefined): number {
  if (!position) return 999

  const order: Record<string, number> = {
    presidente: 1,
    'vice-presidente': 2,
    'secretario-geral': 3,
    'secretario-geral-adjunto': 4,
    tesoureiro: 5,
    'tesoureiro-adjunto': 6,
    'diretor-administrativo': 7,
    'diretor-executivo': 8,
    'diretor-relacoes-institucionais': 9,
    'diretor-defesa-prerrogativas-valorizacao-advocacia': 10,
    'diretor-educacao-juridica': 11,
    'diretor-iniciacao-profissional': 12,
    'diretor-tecnologia-inovacao': 13,
    'diretor-inclusao-acessibilidade': 14,
    'diretor-interiorizacao': 15,
    'diretor-assuntos-penais': 16,
    'diretor-atendimento': 17,
    'diretor-relacionamento-justica-federal': 18,
    'diretor-relacionamento-justica-estadual': 19,
    'diretor-relacionamento-justica-trabalho': 20,
    'diretor-relacionamento-justica-eleitoral': 21,
    'conselho-estadual-titular': 22,
    'conselho-estadual-suplente': 23,
    'conselho-federal-titular': 24,
    'conselho-federal-suplente': 25,
  }

  return order[position] || 999
}

export function BoardPreviousManagementsTab({
  previousManagements,
  previousManagementsMembers,
}: BoardPreviousManagementsTabProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPreviousManagementsTab = searchParams.get('gestoes-anteriores') === 'true'
  const currentPage = isPreviousManagementsTab ? Number(searchParams.get('page')) || 1 : 1

  const [selectedManagementId, setSelectedManagementId] = useState<number | null>(null)
  const prevSelectedManagementIdRef = React.useRef<number | null>(null)

  useEffect(() => {
    if (
      selectedManagementId &&
      selectedManagementId !== prevSelectedManagementIdRef.current &&
      isPreviousManagementsTab
    ) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('gestoes-anteriores', 'true')
      params.set('page', '1')
      router.push(`/diretoria?${params.toString()}`, { scroll: false })
      prevSelectedManagementIdRef.current = selectedManagementId
    } else if (selectedManagementId !== prevSelectedManagementIdRef.current) {
      prevSelectedManagementIdRef.current = selectedManagementId
    }
  }, [selectedManagementId, isPreviousManagementsTab, router, searchParams])

  const members = selectedManagementId ? previousManagementsMembers[selectedManagementId] || [] : []

  const sortedMembers = [...members].sort((a, b) => {
    const aOrder = getPositionOrder(a.position)
    const bOrder = getPositionOrder(b.position)

    if (aOrder !== 999 || bOrder !== 999) {
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
    }

    if (a.position && !b.position) return -1
    if (!a.position && b.position) return 1
    return (a.title || '').localeCompare(b.title || '', 'pt-BR')
  })

  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const selectedManagement = previousManagements.find((m) => m.id === selectedManagementId)

  if (previousManagements.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Gestões Anteriores
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Nenhuma gestão anterior cadastrada.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <label
          htmlFor="management-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Selecione uma gestão
        </label>
        <div className="relative">
          <select
            id="management-select"
            value={selectedManagementId || ''}
            onChange={(e) =>
              setSelectedManagementId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-2 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent appearance-none"
          >
            <option value="">Selecione uma gestão...</option>
            {previousManagements.map((management) => (
              <option key={management.id} value={management.id}>
                {management.managementStart} - {management.managementEnd}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {selectedManagementId && members.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Gestão {selectedManagement?.managementStart} - {selectedManagement?.managementEnd}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Nenhum membro cadastrado para esta gestão.
          </p>
        </div>
      )}

      {members.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Diretoria - Gestão {selectedManagement?.managementStart} -{' '}
            {selectedManagement?.managementEnd}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Membros da diretoria nesta gestão.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMembers.map((member) => {
              const image = member.photo as PayloadFile | null
              const initials = member.title
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={member.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {image?.url ? (
                      <Image
                        src={image.url || '/placeholder.svg'}
                        alt={member.title || 'Membro'}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                        <span className="font-bold text-xl">{initials || '?'}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-1 bg-[#0066cc] text-white rounded text-xs mb-1">
                        {formatPositionLabel(member.position)}
                      </span>
                    </div>
                  </div>
                  <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {member.title}
                  </h5>
                  {member.oabNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      OAB/SC {member.oabNumber}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              tabIdentifier="gestoes-anteriores"
            />
          )}
        </div>
      )}
    </div>
  )
}
