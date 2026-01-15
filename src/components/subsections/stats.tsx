import { Building2, Globe, MapPin } from 'lucide-react'

interface SubsectionsStatsSectionProps {
  totalSubsections: number
  totalRegions: number
}

export function SubsectionsStatsSection({
  totalSubsections,
  totalRegions,
}: SubsectionsStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-8 h-8 text-[#0066cc] dark:text-blue-400" />
        </div>
        <p className="text-3xl text-gray-900 dark:text-gray-100 mb-1">{totalSubsections}</p>
        <p className="text-gray-600 dark:text-gray-400">Subseções Ativas</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-3xl text-gray-900 dark:text-gray-100 mb-1">{totalRegions}</p>
        <p className="text-gray-600 dark:text-gray-400">Regiões do Estado</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <p className="text-3xl text-gray-900 dark:text-gray-100 mb-1">295</p>
        <p className="text-gray-600 dark:text-gray-400">Municípios Atendidos</p>
      </div>
    </div>
  )
}
