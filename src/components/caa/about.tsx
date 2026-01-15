import { Card, CardContent } from '@/components/ui/card'

export function CAAAboutSection() {
  return (
    <Card className="border-l-4 border-l-primary bg-primary/5">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">Sobre a CAASC</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          A Caixa de Assistência dos Advogados de Santa Catarina (CAASC) é um órgão auxiliar da
          OAB/SC dedicado a promover o bem-estar e a proteção social dos advogados e advogadas
          inscritos na seccional.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Oferecemos uma ampla gama de serviços, benefícios e auxílios que visam garantir suporte em
          momentos importantes da vida profissional e pessoal dos advogados.
        </p>
      </CardContent>
    </Card>
  )
}
