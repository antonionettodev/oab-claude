import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ESATeacherCta() {
  return (
    <div className="bg-gradient-to-br from-violet-50 via-primary/5 to-violet-100/50 rounded-2xl p-8 border border-violet-100">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-5 bg-white rounded-2xl shadow-sm w-fit">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">Seja um Docente da ESA/SC</h2>
          <p className="text-muted-foreground">
            Compartilhe seu conhecimento com a advocacia catarinense e contribua para a formação de
            novos profissionais.
          </p>
        </div>
        <Button size="lg" className="md:w-auto w-full">
          Cadastrar-se como Docente
        </Button>
      </div>
    </div>
  )
}
