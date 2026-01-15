import { Phone, Mail, Clock, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ESAContactCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Fale com a ESA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>
              <strong className="text-foreground">Telefone:</strong> (48) 3239-3500 - Ramal 3520
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>
              <strong className="text-foreground">E-mail:</strong> esa@oabsc.org.br
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              <strong className="text-foreground">Horário:</strong> Segunda a Sexta, 8h às 18h
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Certificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Acesse o sistema para emitir seus certificados de cursos concluídos.
          </p>
          <Button variant="link" className="p-0 h-auto text-primary">
            Emitir Certificado →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
