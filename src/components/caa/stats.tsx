import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: '12.500+', label: 'Advogados Assistidos' },
  { value: '850+', label: 'Auxílios Concedidos em 2024' },
  { value: '200+', label: 'Convênios Ativos' },
]

export function CAAStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
            <p className="text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
