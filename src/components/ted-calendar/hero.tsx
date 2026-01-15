import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function TedCalendarHeroSection() {
  return (
    <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm">
            Início
          </Link>
          <span className="text-white/50">/</span>
          <Link href="/ted" className="text-white/80 hover:text-white transition-colors text-sm">
            TED
          </Link>
          <span className="text-white/50">/</span>
          <span className="text-white text-sm">Calendário</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Calendário de Sessões</h1>
            <p className="text-white/90 text-lg">Tribunal de Ética e Disciplina - OAB/SC</p>
          </div>
        </div>
      </div>
    </div>
  )
}
