import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface Course {
  id: number
  titulo: string
  categoria: 'Presencial' | 'Online' | 'Híbrido'
  duracao: string
  vagas: number
  data: string
  destaque: boolean
}

interface ESACourseCardProps {
  course: Course
  featured?: boolean
}

const categoryColors = {
  Presencial: 'bg-primary text-primary-foreground',
  Online: 'bg-emerald-500 text-white',
  Híbrido: 'bg-violet-500 text-white',
}

export function ESACourseCard({ course, featured = false }: ESACourseCardProps) {
  if (featured) {
    return (
      <Card className="group bg-gradient-to-br from-primary/5 via-violet-50/50 to-primary/10 border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className={categoryColors[course.categoria]}>{course.categoria}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {course.data}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-3 text-lg group-hover:text-primary transition-colors">
            {course.titulo}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
            <span>Duração: {course.duracao}</span>
            <span>Vagas: {course.vagas}</span>
          </div>
          <Button className="w-full" size="lg">
            Inscrever-se
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {course.categoria}
          </Badge>
        </div>
        <h3 className="font-medium text-foreground mb-3 text-sm group-hover:text-primary transition-colors">
          {course.titulo}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>{course.duracao}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {course.data}
          </span>
        </div>
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )
}
