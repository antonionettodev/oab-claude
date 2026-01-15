import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export function PrerogativesCommission() {
  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Comissão de Defesa das Prerrogativas
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          A Comissão de Defesa das Prerrogativas da OAB/SC atua de forma permanente na proteção dos
          direitos dos advogados, acompanhando casos, orientando a classe e promovendo ações
          institucionais.
        </p>
        <Button asChild>
          <Link href="/comissao-prerrogativas">Conheça a Comissão</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
