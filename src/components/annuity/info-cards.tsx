import { Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnnuityInfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            Vencimento 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Cota Única:</span> 15 de março
          </p>
          <p>
            <span className="font-medium text-foreground">1ª Parcela:</span> 15 de março
          </p>
          <p>
            <span className="font-medium text-foreground">Demais parcelas:</span> 15 de cada mês
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Valores 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Cota Única:</span> R$ 1.800,00{' '}
            <span className="text-green-600 dark:text-green-400">(10% desconto)</span>
          </p>
          <p>
            <span className="font-medium text-foreground">Parcelado:</span> 10x de R$ 200,00
          </p>
          <p>
            <span className="font-medium text-foreground">Advogado Iniciante:</span>{' '}
            <span className="text-green-600 dark:text-green-400">50% desconto</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
