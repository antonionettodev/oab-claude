'use client'

import { CreditCard, ChevronRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface AnnuityHeaderProps {
  onNavigate: (section: string) => void
}

export function AnnuityHeader({ onNavigate }: AnnuityHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-12 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onNavigate('inicio')}
                className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer transition-colors"
              >
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary-foreground/50">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary-foreground font-medium">
                Anuidade e Boletos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <CreditCard className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Anuidade e Boletos</h1>
            <p className="text-primary-foreground/80 text-lg">
              Emita guias, consulte débitos e regularize sua situação
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
