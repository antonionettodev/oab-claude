'use client'

import { useState } from 'react'
import { ESAHeader } from '@/components/esa/header'
import { ESAStats } from '@/components/esa/stats'
import { ESAMission } from '@/components/esa/mission'
import { ESASearchBar } from '@/components/esa/search-bar'
import { ESACourseCard, type Course } from '@/components/esa/course-card'
import { ESATeacherCta } from '@/components/esa/teacher-cta'
import { ESAContactCards } from '@/components/esa/contact-cards'

const courses: Course[] = [
  {
    id: 1,
    titulo: 'Direito Processual Civil Avançado',
    categoria: 'Presencial',
    duracao: '40h',
    vagas: 50,
    data: '10/12/2024',
    destaque: true,
  },
  {
    id: 2,
    titulo: 'Compliance e LGPD na Advocacia',
    categoria: 'Online',
    duracao: '20h',
    vagas: 100,
    data: '15/12/2024',
    destaque: true,
  },
  {
    id: 3,
    titulo: 'Prática Trabalhista',
    categoria: 'Híbrido',
    duracao: '30h',
    vagas: 60,
    data: '05/01/2025',
    destaque: false,
  },
  {
    id: 4,
    titulo: 'Direito Tributário Aplicado',
    categoria: 'Presencial',
    duracao: '50h',
    vagas: 40,
    data: '20/01/2025',
    destaque: false,
  },
  {
    id: 5,
    titulo: 'Mediação e Arbitragem',
    categoria: 'Online',
    duracao: '25h',
    vagas: 80,
    data: '25/01/2025',
    destaque: false,
  },
  {
    id: 6,
    titulo: 'Direito Penal e Processo Penal',
    categoria: 'Presencial',
    duracao: '45h',
    vagas: 45,
    data: '01/02/2025',
    destaque: false,
  },
]

export default function EsaPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const featuredCourses = courses.filter((c) => c.destaque)
  const regularCourses = courses.filter(
    (c) => !c.destaque && c.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <ESAHeader />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <ESAStats />

        <ESAMission />

        <ESASearchBar value={searchTerm} onChange={setSearchTerm} />

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Cursos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCourses.map((course) => (
              <ESACourseCard key={course.id} course={course} featured />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Todos os Cursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularCourses.map((course) => (
              <ESACourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <ESATeacherCta />

        <ESAContactCards />
      </div>
    </div>
  )
}
