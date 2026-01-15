import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: '1.247', label: 'Acionamentos do Plantão' },
  { value: '892', label: 'Ocorrências Registradas' },
  { value: '654', label: 'Casos Resolvidos' },
  { value: '98%', label: 'Taxa de Satisfação' },
]

export function PrerogativesStats() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-violet-500/5 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-8 text-center">
        Atuação em Defesa das Prerrogativas - 2024
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-background/60 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
