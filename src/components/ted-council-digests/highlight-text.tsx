'use client'

import { useMemo } from 'react'

interface HighlightTextProps {
  text: string
  searchTerm: string
}

/**
 * Componente que destaca o termo de busca no texto
 */
export function HighlightText({ text, searchTerm }: HighlightTextProps) {
  const highlightedText = useMemo(() => {
    if (!searchTerm || !text) {
      return text
    }

    // Escapa caracteres especiais do regex
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedSearch})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      // Quando usamos split com grupos de captura, as partes alternam:
      // partes em índices ímpares são os matches
      // Mas também podemos verificar diretamente se a parte corresponde ao termo
      const isMatch = regex.test(part)
      // Resetar o lastIndex do regex para evitar problemas
      regex.lastIndex = 0

      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-gray-100 px-1 rounded"
          >
            {part}
          </mark>
        )
      }
      return <span key={index}>{part}</span>
    })
  }, [text, searchTerm])

  return <>{highlightedText}</>
}
