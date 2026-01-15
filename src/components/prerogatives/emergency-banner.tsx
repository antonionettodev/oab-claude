import { Phone } from 'lucide-react'

export function PrerogativesEmergencyBanner() {
  return (
    <div className="bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-destructive-foreground/20 rounded-full animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-1">Plantão 24 Horas - Defesapp</h2>
              <p className="text-destructive-foreground/90">
                Defesa imediata das suas prerrogativas
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm mb-2 text-destructive-foreground/80">Ligue agora:</p>
            <a
              href="tel:+554832393641"
              className="text-3xl md:text-4xl font-bold hover:underline transition-all"
            >
              (48) 3239-3641
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
