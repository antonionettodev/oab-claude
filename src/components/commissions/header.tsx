import Link from 'next/link'
import { ChevronRight, Users, Grid, UserPlus } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import type { Commission, CommissionArea } from '@/payload-types'

interface CommissionHeaderProps {
  commission: Commission
  membersCount: number
}

export function CommissionHeader({ commission, membersCount }: CommissionHeaderProps) {
  const area = typeof commission.area === 'object' ? (commission.area as CommissionArea) : null

  return (
    <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-white/80 hover:text-white">
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/comissoes" className="text-white/80 hover:text-white">
                  Comissões
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">{commission.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              {area && (
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs mb-2">
                  {area.title}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{commission.title}</h1>
              <p className="text-white/80">{membersCount} membros ativos</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              asChild
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <Link href="/comissoes">
                <Grid className="w-5 h-5 mr-2" />
                Todas as Comissões
              </Link>
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-[#0066cc] shadow-lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Inscrever-se
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
