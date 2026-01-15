'use client'

import { Heart, Shield, Building, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    icon: Heart,
    title: 'Planos de Saúde',
    description: 'Unimed, Einstein Conecta e outros convênios',
    link: 'caasc-planos-saude',
  },
  {
    icon: Shield,
    title: 'Auxílios SOS CAASC',
    description: 'Natalidade, Saúde, Calamidade, SOS Mulher',
    link: 'caasc-auxilios',
  },
  {
    icon: Building,
    title: 'Convênios e Parcerias',
    description: 'Descontos exclusivos para advogados',
    link: 'caasc-convenios',
  },
  {
    icon: CreditCard,
    title: 'Carteirinha Digital',
    description: 'Acesse seus benefícios pelo celular',
    link: 'caasc-carteirinha',
  },
]

interface CAAServicesGridProps {
  onNavigate: (section: string) => void
}

export function CAAServicesGrid({ onNavigate }: CAAServicesGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Principais Serviços</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300"
              onClick={() => onNavigate(service.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
