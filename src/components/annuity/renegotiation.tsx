'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnnuityRenegotiationProps {
  onNavigate: (section: string) => void
}

export function AnnuityRenegotiation({ onNavigate }: AnnuityRenegotiationProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-primary/10 to-primary/5 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl">Renegociação de Débitos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Possui débitos em aberto? A OAB/SC oferece condições especiais para renegociação. Entre em
          contato com nossa Tesouraria para regularizar sua situação.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => onNavigate('contato')}>Falar com Tesouraria</Button>
          <Button variant="outline" onClick={() => console.log('Simular renegociação')}>
            Simular Renegociação
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
