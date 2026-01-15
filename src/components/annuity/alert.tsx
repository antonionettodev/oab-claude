import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AnnuityAlert() {
  return (
    <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">Importante</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        O pagamento da anuidade é obrigatório para manter sua inscrição ativa na OAB/SC. A
        inadimplência pode resultar em suspensão do exercício profissional.
      </AlertDescription>
    </Alert>
  )
}
