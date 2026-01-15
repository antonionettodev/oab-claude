'use client'

import { useState, useRef } from 'react'
import { AIAvatar } from '@/components/artificial-intelligence/avatar'
import { AIHeader } from '@/components/artificial-intelligence/header'
import { AIProfileSelector } from '@/components/artificial-intelligence/profile-selector'
import { AIInputBar } from '@/components/artificial-intelligence/input-bar'
import { AIMessageList, type Message } from '@/components/artificial-intelligence/message-list'
import { AISuggestions } from '@/components/artificial-intelligence/suggestions'

const profileOptions = [
  { id: 'advogado', label: 'Advogado(a)' },
  { id: 'estudante', label: 'Estudante' },
  { id: 'cidadao', label: 'Cidadão' },
]

export default function ArtificialIntelligencePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState('advogado')
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = (content: string) => {
    const messageContent = content || inputValue
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: messageContent,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)
    setInputValue('')

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Obrigado pela sua pergunta. Como assistente jurídico da OAB-SC, posso ajudá-lo com informações sobre direitos, procedimentos e orientações legais. Como posso auxiliá-lo hoje?',
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 1500)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AIHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {!hasMessages ? (
          <div className="flex w-full max-w-2xl flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <AIAvatar />
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Olá, como posso ajudar?</h1>
                <p className="text-muted-foreground">
                  Sou o assistente jurídico da OAB-SC. Selecione seu perfil para uma experiência
                  personalizada.
                </p>
              </div>
            </div>

            <AIProfileSelector
              selectedProfile={selectedProfile}
              onSelectProfile={setSelectedProfile}
              profileOptions={profileOptions}
            />

            <AISuggestions onSuggestionClick={handleSend} />

            <div className="w-full">
              <AIInputBar
                value={inputValue}
                onChange={setInputValue}
                onSend={() => handleSend(inputValue)}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-2xl flex-1 flex-col">
            <AIMessageList
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
            <div className="sticky bottom-0 bg-background pb-4 pt-2">
              <AIInputBar
                value={inputValue}
                onChange={setInputValue}
                onSend={() => handleSend(inputValue)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
