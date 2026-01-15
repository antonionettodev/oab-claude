import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function PrerogativesAlert() {
  return (
    <Alert className="border-amber-500/50 bg-amber-500/10">
      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-foreground font-semibold">Importante!</AlertTitle>
      <AlertDescription className="text-muted-foreground space-y-2">
        <p>
          Em caso de violação de prerrogativas, acione imediatamente o Plantão 24h. A atuação rápida
          é fundamental para garantir seus direitos e evitar danos maiores ao exercício da
          profissão.
        </p>
        <p>
          Após o acionamento, registre formalmente a ocorrência para que a OAB/SC possa acompanhar e
          adotar as medidas cabíveis.
        </p>
      </AlertDescription>
    </Alert>
  )
}
