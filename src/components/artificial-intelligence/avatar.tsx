'use client'

import { Sparkles } from 'lucide-react'

export function AIAvatar() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring" />
        <div
          className="absolute -inset-2 rounded-full bg-primary/5 animate-pulse-ring"
          style={{ animationDelay: '0.5s' }}
        />

        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary-400 via-primary to-primary-600 flex items-center justify-center shadow-xl shadow-primary/30 animate-float">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground relative z-10" />
        </div>

        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-background shadow-lg">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
      </div>
    </div>
  )
}
