'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CAAHealthPlansProps {
  onNavigate: (section: string) => void
}

export function CAAHealthPlans({ onNavigate }: CAAHealthPlansProps) {
  const plans = [
    { name: 'Unimed', description: 'Cobertura nacional', color: 'bg-primary/10' },
    { name: 'Einstein Conecta', description: 'Telemedicina 24h', color: 'bg-green-500/10' },
    { name: 'Outros Convênios', description: 'Consulte opções', color: 'bg-purple-500/10' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos de Saúde</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div key={index} className={`text-center p-5 ${plan.color} rounded-xl`}>
              <h3 className="font-semibold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => onNavigate('caasc-planos-saude')}>
            Ver Planos Disponíveis
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Incluir/Excluir Dependente
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
