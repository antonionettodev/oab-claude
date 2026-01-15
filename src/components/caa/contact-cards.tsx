'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, FileText, ArrowRight } from 'lucide-react'

export function CAAContactCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Fale com a CAASC</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Telefone:</span> (48) 3239-3500 - Ramal
              3530
            </p>
            <p>
              <span className="font-medium text-foreground">E-mail:</span> caasc@oabsc.org.br
            </p>
            <p>
              <span className="font-medium text-foreground">Horário:</span> Segunda a Sexta, 8h às
              18h
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Carteirinha Digital</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Acesse sua carteirinha digital e utilize seus benefícios de forma prática através do
            aplicativo OAB/SC.
          </p>
          <Button variant="link" className="p-0 h-auto text-primary">
            Acessar Carteirinha <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
