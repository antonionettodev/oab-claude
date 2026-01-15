import Link from 'next/link'
import { FileText, ChevronRight } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function UrhHeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#E85D75] to-[#d94d65] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb className="mb-4">
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
              <BreadcrumbPage className="text-white">Tabela de Honorários</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <FileText className="w-12 h-12" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Tabela de Honorários</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Consulte e baixe as tabelas de honorários advocatícios da OAB/SC
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
