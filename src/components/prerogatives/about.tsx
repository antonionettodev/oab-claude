import { Card, CardContent } from '@/components/ui/card'

export function PrerogativesAboutSection() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">O que são Prerrogativas?</h2>
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="p-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Prerrogativas são direitos e garantias assegurados aos advogados para o pleno exercício
            da profissão, garantindo a independência e a dignidade da advocacia. Estão previstas no
            Estatuto da Advocacia (Lei 8.906/94) e são essenciais para a defesa dos direitos dos
            cidadãos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A OAB/SC atua de forma incansável na defesa dessas prerrogativas, oferecendo suporte
            jurídico imediato através do Plantão 24h e acompanhamento de todos os casos de violação.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
