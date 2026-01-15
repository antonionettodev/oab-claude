import { Phone, Mail, MapPin, MessageSquare, Globe } from 'lucide-react'
import type { Subsection } from '@/payload-types'

interface SubsectionContactTabProps {
  subsection: Subsection
}

export function SubsectionContactTab({ subsection }: SubsectionContactTabProps) {
  const fullAddress = [
    subsection.street,
    subsection.district,
    subsection.city,
    'SC',
    subsection.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Canais de Atendimento
        </h3>
        <div className="space-y-6">
          {subsection.phone && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0066cc] dark:text-blue-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="font-medium text-gray-900 dark:text-white">{subsection.phone}</p>
              </div>
            </div>
          )}
          {subsection.email && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0066cc] dark:text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
                <p className="font-medium text-gray-900 dark:text-white">{subsection.email}</p>
              </div>
            </div>
          )}
          {subsection.website && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0066cc] dark:text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                <a
                  href={subsection.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 dark:text-white hover:text-[#0066cc] dark:hover:text-blue-400 transition-colors"
                >
                  {subsection.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          {fullAddress && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0066cc] dark:text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Endereço</p>
                <p className="font-medium text-gray-900 dark:text-white">{fullAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-2xl p-8 text-center flex flex-col justify-center items-center">
        <MessageSquare className="w-16 h-16 text-[#0066cc] dark:text-blue-400 mb-4" />
        <h3 className="text-gray-900 dark:text-gray-100 mb-3 text-xl font-semibold">
          Precisa de ajuda?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
          Entre em contato conosco para dúvidas, sugestões ou solicitações específicas da subseção.
        </p>
        <a
          href={`mailto:${subsection.email || ''}`}
          className="px-8 py-3 bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white rounded-full hover:shadow-lg transition-all w-full sm:w-auto inline-block"
        >
          Enviar Mensagem
        </a>
      </div>
    </div>
  )
}
