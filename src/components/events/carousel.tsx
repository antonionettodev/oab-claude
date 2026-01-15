'use client'

import { useState, useEffect } from 'react'
import { EventDetailCard } from './detail-card'
import type { Event } from '@/payload-types'

interface EventsCarouselProps {
  events: Event[]
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Autoplay
  useEffect(() => {
    if (isHovered || events.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isHovered, events.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (events.length === 0) return null

  if (events.length <= 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventDetailCard key={event.id} event={event} />
        ))}
      </div>
    )
  }

  const totalSlides = Math.ceil(events.length / 3)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carrossel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const startIdx = slideIndex * 3
            const slideEvents = events.slice(startIdx, startIdx + 3)

            return (
              <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slideEvents.map((event) => (
                    <EventDetailCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-6 h-2 bg-[#0066cc] dark:bg-[#60A5FA] rounded-full'
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-[#0066cc] dark:hover:bg-[#60A5FA] hover:scale-125'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
