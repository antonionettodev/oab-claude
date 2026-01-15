import { Target, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Subsection } from '@/payload-types'

interface SubsectionAboutTabProps {
  subsection: Subsection
}

export function SubsectionAboutTab({ subsection }: SubsectionAboutTabProps) {
  const fullAddress = [
    subsection.street,
    subsection.district,
    subsection.city,
    'SC',
    subsection.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : undefined

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Sobre a Subseção de {subsection.title}
        </h3>
        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          {subsection.about ? (
            <p>{subsection.about}</p>
          ) : (
            <>
              <p>
                A Subseção de {subsection.title} desempenha um papel fundamental na representação e
                defesa dos advogados da região. Com uma história de compromisso com a justiça e a
                cidadania, nossa subseção trabalha incansavelmente para fortalecer a advocacia
                local.
              </p>
              <p>
                Oferecemos suporte contínuo aos profissionais do direito, promovendo cursos,
                palestras e eventos que visam a atualização e o aprimoramento técnico. Além disso,
                atuamos ativamente na defesa das prerrogativas profissionais, garantindo o livre
                exercício da advocacia.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-[#0066cc] dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Região de abrangência
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {subsection.mission ||
              'Informações sobre a região de abrangência da subseção serão exibidas aqui.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-[#0066cc] dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Atendimento</h3>
          </div>
          <div className="space-y-5">
            {subsection.serviceHours && (
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Horário de Expediente</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{subsection.serviceHours}</p>
              </div>
            )}
            {fullAddress && (
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Endereço</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{fullAddress}</p>
              </div>
            )}
            <Button
              asChild
              variant="outline"
              className="w-full mt-4 gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="w-4 h-4" />
                Ver no Mapa
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
