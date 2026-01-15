import { Heart } from 'lucide-react'

export function CAAHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-12 px-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Heart className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Caixa de Assistência dos Advogados</h1>
            <p className="text-primary-foreground/80 text-lg">
              Benefícios e assistência para a advocacia catarinense
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
