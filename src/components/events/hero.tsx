import { Calendar } from 'lucide-react'

export function EventsHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/10 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-blue-200 text-sm font-medium uppercase tracking-wider">
            OAB Santa Catarina
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Eventos e Cursos</h1>

        <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
          Encontre cursos, workshops e eventos da OAB-SC. Capacite-se e mantenha-se atualizado com
          as melhores oportunidades de desenvolvimento profissional.
        </p>
      </div>
    </section>
  )
}
