import { GraduationCap, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ESAHeader() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Início
          </Link>
        </Button>

        <div className="flex items-center gap-5">
          <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm">
            <GraduationCap className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Escola Superior de Advocacia - ESA/SC</h1>
            <p className="text-primary-foreground/80 text-lg">
              Educação continuada de excelência para advogados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
