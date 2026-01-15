import { Shield, ChevronRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function PrerogativesHeader() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary-foreground/60">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary-foreground">
                Defesa de Prerrogativas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-foreground/10 rounded-xl">
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Defesa de Prerrogativas</h1>
            <p className="text-primary-foreground/80">
              Proteção aos direitos e prerrogativas da advocacia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
