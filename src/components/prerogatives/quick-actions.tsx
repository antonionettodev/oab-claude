import { Clock, FileText, Scale } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const actions = [
  {
    icon: Clock,
    title: 'Plantão 24h',
    description: 'Acionamento imediato em casos de violação de prerrogativas',
    href: 'tel:+554832393641',
    linkText: 'Ligar agora',
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  {
    icon: FileText,
    title: 'Registro de Ocorrência',
    description: 'Formalize sua denúncia online',
    href: '/acionamento-ocorrencia',
    linkText: 'Registrar ocorrência',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Scale,
    title: 'Legislação',
    description: 'Consulte as leis que protegem o advogado',
    href: '/legislacao-prerrogativas',
    linkText: 'Ver legislação',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
]

export function PrerogativesQuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className={`p-3 ${action.iconBg} rounded-xl w-fit mb-4`}>
              <action.icon className={`w-7 h-7 ${action.iconColor}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
            <Link
              href={action.href}
              className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              {action.linkText} →
            </Link>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
