import type { RefObject } from 'react'
import { Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: number
  sender: 'user' | 'ai'
  text: string
}

interface AIMessageListProps {
  messages: Message[]
  isTyping: boolean
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export function AIMessageList({ messages, isTyping, messagesEndRef }: AIMessageListProps) {
  return (
    <div className="max-h-96 overflow-y-auto space-y-4 px-1 scrollbar-thin">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn('flex gap-3', message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}
        >
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
              message.sender === 'ai'
                ? 'bg-gradient-to-br from-primary-400 to-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {message.sender === 'ai' ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>

          <div
            className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
              message.sender === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-md'
                : 'bg-card border border-border/50 text-card-foreground rounded-tl-md',
            )}
          >
            {message.text}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="bg-card border border-border/50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
            <div className="flex gap-1.5 items-center h-5">
              <span
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
