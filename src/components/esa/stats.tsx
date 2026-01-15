import { BookOpen, Users, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    icon: BookOpen,
    value: '150+',
    label: 'Cursos por Ano',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Users,
    value: '5.000+',
    label: 'Advogados Capacitados',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
  },
  {
    icon: Award,
    value: '95%',
    label: 'Satisfação dos Alunos',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
]

export function ESAStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
        >
          <CardContent className="p-6 text-center">
            <div
              className={`p-4 ${stat.bgColor} rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
            <p className="text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
