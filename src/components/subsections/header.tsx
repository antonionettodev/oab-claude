import Link from 'next/link'
import { Building2, MapPin, Phone, Grid, MessageSquare, ChevronRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Subsection } from '@/payload-types'

interface SubsectionHeaderProps {
  subsection: Subsection
}

export function SubsectionHeader({ subsection }: SubsectionHeaderProps) {
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
                <Link href="/subsecoes" className="text-white/80 hover:text-white">
                  Subseções
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">{subsection.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mt-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                  Subseção
                </div>
                <div className="inline-block px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-xs border border-green-400/30 text-green-100">
                  Ativa
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Subseção de {subsection.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                {subsection.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{subsection.city} - SC</span>
                  </div>
                )}
                {subsection.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{subsection.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/subsecoes"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all"
            >
              <Grid className="w-5 h-5" />
              Todas as Subseções
            </Link>
            <a
              href={`mailto:${subsection.email || ''}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#0066cc] rounded-lg transition-all shadow-lg font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
