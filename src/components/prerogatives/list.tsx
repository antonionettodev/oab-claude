import { Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const prerogatives = [
  'Inviolabilidade do escritório e instrumentos de trabalho',
  'Comunicação livre com o cliente em local reservado',
  'Manifestação escrita sem censura',
  'Sustentação oral perante qualquer juízo ou tribunal',
  'Preferência na ordem de sustentação oral',
  'Acesso a estabelecimentos prisionais',
  'Acesso aos autos de processos findos ou em andamento',
  'Não ser preso em flagrante, salvo por crime inafiançável',
  'Prisão especial, quando aplicável',
  'Ter respeitada a imunidade profissional',
]

export function PrerogativesList() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Principais Prerrogativas do Advogado
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prerogatives.map((item, index) => (
          <Card key={index} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
