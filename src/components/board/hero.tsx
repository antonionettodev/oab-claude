import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function BoardHeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-8 px-4">
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
              <BreadcrumbPage className="text-white">Diretoria</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Users className="w-12 h-12" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Diretoria OAB/SC</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Conheça a história e a composição da Diretoria da Ordem dos Advogados do Brasil -
              Seccional Santa Catarina.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
