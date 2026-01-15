'use client'

import type React from 'react'
import { Button } from '@/components/ui/button'
import { Send, Mic, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIInputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function AIInputBar({ value, onChange, onSend, disabled }: AIInputBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'flex items-center gap-2 bg-card border border-border/50 rounded-2xl px-4 py-3',
          'shadow-lg shadow-primary/5 transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 focus-within:shadow-primary/10',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
          aria-label="Anexar arquivo"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite sua pergunta jurídica..."
          disabled={disabled}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base min-w-0"
        />

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Gravar áudio"
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={cn(
              'rounded-xl transition-all',
              value.trim() && !disabled
                ? 'bg-primary hover:bg-primary-600 shadow-lg shadow-primary/25'
                : 'bg-muted text-muted-foreground',
            )}
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Pressione Enter para enviar ou peça para{' '}
        <button className="text-primary hover:underline font-medium">falar com um humano</button>
      </p>
    </div>
  )
}
