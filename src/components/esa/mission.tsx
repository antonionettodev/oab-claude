import { Target } from 'lucide-react'

export function ESAMission() {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary rounded-xl p-6 flex gap-4">
      <div className="p-3 bg-primary/10 rounded-xl h-fit">
        <Target className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Nossa Missão</h2>
        <p className="text-muted-foreground leading-relaxed">
          A ESA/SC tem como missão promover a educação continuada de alta qualidade para os
          advogados de Santa Catarina, oferecendo cursos, palestras, seminários e eventos que
          contribuam para o aperfeiçoamento técnico e profissional da advocacia catarinense.
        </p>
      </div>
    </div>
  )
}
