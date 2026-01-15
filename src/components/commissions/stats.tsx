import { Users, Briefcase, Layers } from 'lucide-react'

interface CommissionsStatsSectionProps {
  totalCommissions: number
  totalMembers: number
  totalAreas: number
}

export function CommissionsStatsSection({
  totalCommissions,
  totalMembers,
  totalAreas,
}: CommissionsStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Briefcase className="w-8 h-8 text-[#0066cc] dark:text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {totalCommissions}
        </p>
        <p className="text-gray-600 dark:text-gray-400">Comissões Ativas</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{totalMembers}</p>
        <p className="text-gray-600 dark:text-gray-400">Membros Ativos</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Layers className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{totalAreas}</p>
        <p className="text-gray-600 dark:text-gray-400">Áreas de Atuação</p>
      </div>
    </div>
  )
}
