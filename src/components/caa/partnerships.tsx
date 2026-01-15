'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const categories = [
  'Educação',
  'Saúde',
  'Lazer',
  'Automotivo',
  'Tecnologia',
  'Gastronomia',
  'Bem-estar',
  'Serviços',
]

interface CAAPartnershipsProps {
  onNavigate: (section: string) => void
}

export function CAAPartnerships({ onNavigate }: CAAPartnershipsProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/10">
      <CardHeader>
        <CardTitle>Convênios e Parcerias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          A CAASC mantém convênios com diversas empresas e prestadores de serviços, garantindo
          descontos exclusivos para advogados inscritos na OAB/SC.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <div key={index} className="bg-background rounded-lg p-3 text-center">
              <p className="text-sm text-foreground">{category}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => onNavigate('caasc-convenios')}>
          Ver Lista Completa de Convênios
        </Button>
      </CardContent>
    </Card>
  )
}
