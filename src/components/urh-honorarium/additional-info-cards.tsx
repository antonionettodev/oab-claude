'use client'

import Link from 'next/link'

interface UrhAdditionalInfoCardsProps {
  onNavigateContact?: () => void
  onOpenCalculator?: () => void
}

export function UrhAdditionalInfoCards({
  onNavigateContact,
  onOpenCalculator,
}: UrhAdditionalInfoCardsProps) {
  const handleContactClick = () => {
    if (onNavigateContact) {
      onNavigateContact()
    } else {
      window.location.href = '/contato'
    }
  }

  const handleCalculatorClick = () => {
    if (onOpenCalculator) {
      onOpenCalculator()
    } else {
      console.log('Abrir calculadora')
    }
  }

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 transition-colors">
        <h3 className="text-gray-900 mb-3 font-semibold">Dúvidas sobre a Tabela?</h3>
        <p className="text-gray-700 text-sm mb-4">
          Entre em contato com nossa equipe para esclarecimentos sobre a aplicação da tabela de
          honorários.
        </p>
        <Link
          href="/contato"
          onClick={handleContactClick}
          className="text-[#0066cc] hover:underline text-sm font-medium inline-flex items-center gap-1"
        >
          Fale Conosco →
        </Link>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-xl p-6 transition-colors">
        <h3 className="text-gray-900 mb-3 font-semibold">Calculadora de Honorários</h3>
        <p className="text-gray-700 text-sm mb-4">
          Utilize nossa ferramenta online para calcular honorários de forma rápida e precisa.
        </p>
        <button
          className="text-[#0066cc] hover:underline text-sm font-medium inline-flex items-center gap-1"
          onClick={handleCalculatorClick}
        >
          Em breve!
        </button>
      </div>
    </div>
  )
}
