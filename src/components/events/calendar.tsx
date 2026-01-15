'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Event } from '@/payload-types'

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{
      date: Date
      isCurrentMonth: boolean
      isToday: boolean
      events: Array<{ id: number; title: string; status: string; slug?: string | null }>
    }> = []

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      })
    }

    // Dias do mês atual
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === date.getTime()
      })

      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents.map((e) => ({
          id: e.id,
          title: e.title,
          status: e.status,
          slug: e.slug,
        })),
      })
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      })
    }

    return days
  }

  const days = getDaysInMonth()
  const totalEvents = events.filter((e) => {
    const eventDate = new Date(e.startDate)
    return (
      eventDate.getMonth() === currentMonth.getMonth() &&
      eventDate.getFullYear() === currentMonth.getFullYear()
    )
  }).length

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0084ff] via-[#0070e0] to-[#0066cc] dark:from-[#3B82F6] dark:via-[#2563EB] dark:to-[#1E40AF] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <p className="text-blue-100 text-sm">
              {totalEvents} {totalEvents === 1 ? 'evento agendado' : 'eventos agendados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Mês anterior</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="h-8 px-3 text-white hover:bg-white/20 text-xs font-medium"
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Próximo mês</span>
            </Button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-white/90 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const hasEvents = day.events.length > 0
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6
            const firstEvent = day.events[0]

            const content = (
              <div key={index} className="flex flex-col items-center justify-center h-full">
                <span className={`text-sm ${day.isToday ? 'font-bold' : 'font-medium'}`}>
                  {day.date.getDate()}
                </span>

                {/* Event indicator */}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {day.events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          event.status === 'active'
                            ? 'bg-green-500'
                            : event.status === 'closed'
                              ? 'bg-gray-400'
                              : 'bg-red-500'
                        }`}
                        title={event.title}
                      />
                    ))}
                    {day.events.length > 3 && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                  </div>
                )}
              </div>
            )

            const className = `
              relative aspect-square rounded-xl p-2 transition-all duration-200
              ${day.isCurrentMonth ? 'text-gray-900 dark:text-[#F8FAFC]' : 'text-gray-400 dark:text-[#64748B]'}
              ${
                day.isToday
                  ? 'bg-gradient-to-br from-[#0084ff]/10 to-[#E85D75]/10 dark:from-[#3B82F6]/20 dark:to-[#F472B6]/20 ring-2 ring-[#0066cc] dark:ring-[#60A5FA]'
                  : hasEvents
                    ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-[#334155]/50'
              }
              ${!day.isCurrentMonth && 'opacity-40'}
              ${hasEvents && 'cursor-pointer'}
              ${isWeekend && day.isCurrentMonth && !hasEvents && 'bg-gray-50/50 dark:bg-[#1E293B]/50'}
            `

            return hasEvents && firstEvent ? (
              <Link
                key={index}
                href={`/eventos/${firstEvent.slug || firstEvent.id}`}
                className={className}
              >
                {content}
              </Link>
            ) : (
              <div key={index} className={className}>
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-[#334155]">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-[#94A3B8]">Inscrições abertas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-600 dark:text-[#94A3B8]">Encerrado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-[#94A3B8]">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
