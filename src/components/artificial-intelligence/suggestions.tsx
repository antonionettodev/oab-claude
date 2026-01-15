'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  MessageCircle,
  FileText,
  Lightbulb,
  Scale,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AISuggestionsProps {
  onSuggestionClick: (text: string) => void
}

const suggestions = [
  {
    icon: MessageCircle,
    text: 'Documentos para inscrição Originária',
    description: 'Lista completa de requisitos',
    color: 'from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: FileText,
    text: 'Sociedade Individual de Advocacia',
    description: 'Passo a passo para constituição',
    color: 'from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Lightbulb,
    text: 'Aprovei na OAB, e agora?',
    description: 'Guia para novos advogados',
    color: 'from-amber-500/10 to-amber-600/10 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Scale,
    text: 'Melhorar petição com IA',
    description: 'Análise e sugestões inteligentes',
    color: 'from-violet-500/10 to-violet-600/10 text-violet-600 dark:text-violet-400',
  },
]

export function AISuggestions({ onSuggestionClick }: AISuggestionsProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => onSuggestionClick('Preciso reportar uma violação de prerrogativas')}
        className="w-full group"
      >
        <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20 hover:border-destructive/40 hover:shadow-lg hover:shadow-destructive/10 transition-all duration-300 cursor-pointer overflow-hidden">
          <CardContent className="flex items-center gap-4 p-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative z-10">
              <ShieldAlert className="w-7 h-7 text-destructive" />
            </div>

            <div className="flex-1 text-left relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">Violação de Prerrogativas</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground font-medium animate-pulse">
                  Urgente
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Canal prioritário para casos de violação
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-destructive/60 group-hover:text-destructive group-hover:translate-x-1 transition-all relative z-10" />
          </CardContent>
        </Card>
      </button>

      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Sugestões populares</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group text-left"
            >
              <Card
                className={cn(
                  'h-full border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden',
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform bg-gradient-to-br',
                      suggestion.color,
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">
                      {suggestion.text}
                    </span>
                    <span className="text-xs text-muted-foreground">{suggestion.description}</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
