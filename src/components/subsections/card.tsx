import Link from 'next/link'
import { Building2, Phone, Mail, ChevronRight } from 'lucide-react'

import type { Subsection, SubsectionRegion } from '@/payload-types'

interface SubsectionCardProps {
  subsection: Subsection
}

export function SubsectionCard({ subsection }: SubsectionCardProps) {
  const region = subsection.region as SubsectionRegion | null
  const regionTitle = region?.title || 'Região não definida'

  const address = [subsection.street, subsection.district, subsection.city]
    .filter(Boolean)
    .join(', ')

  return (
    <Link
      href={`/subsecoes/${subsection.slug}`}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:border-[#0066cc]/30 dark:hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-[#0066cc] group-hover:text-white transition-colors text-[#0066cc] dark:text-blue-400">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
          {regionTitle}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors">
        {subsection.title}
      </h3>

      {address && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
          {address}
        </p>
      )}

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
        {subsection.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{subsection.phone}</span>
          </div>
        )}
        {subsection.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{subsection.email}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center text-[#0066cc] dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
        Ver detalhes
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  )
}
