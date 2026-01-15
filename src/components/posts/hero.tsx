import Link from 'next/link'
import { Newspaper, ChevronRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function PostsHeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-white/80 hover:text-white cursor-pointer flex items-center gap-1"
                >
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/60">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Últimas Notícias</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Newspaper className="w-12 h-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Últimas Notícias</h1>
            <p className="text-white/80">Fique por dentro de tudo que acontece na OAB/SC</p>
          </div>
        </div>
      </div>
    </div>
  )
}
