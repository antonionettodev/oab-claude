'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const aids = [
  {
    name: 'Auxílio Natalidade',
    value: 'R$ 1.500,00',
    requirements: 'Inscrição ativa há mais de 12 meses',
  },
  {
    name: 'Auxílio Saúde',
    value: 'Até R$ 5.000,00',
    requirements: 'Análise individual por comissão',
  },
  {
    name: 'Auxílio Calamidade',
    value: 'Até R$ 3.000,00',
    requirements: 'Situação de calamidade comprovada',
  },
  { name: 'SOS Mulher Advogada', value: 'Variável', requirements: 'Atendimento emergencial' },
]

export function CAAAidCards() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Auxílios SOS CAASC</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aids.map((aid, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20"
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">{aid.name}</h3>
              <p className="text-2xl font-bold text-primary mb-2">{aid.value}</p>
              <p className="text-muted-foreground text-sm mb-4">
                <span className="font-medium">Requisitos:</span> {aid.requirements}
              </p>
              <Button variant="link" className="p-0 h-auto text-primary">
                Solicitar Auxílio <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
