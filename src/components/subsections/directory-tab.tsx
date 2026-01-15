import Image from 'next/image'
import type { SubsectionMember, File as PayloadFile } from '@/payload-types'

interface SubsectionDirectoryTabProps {
  members: SubsectionMember[]
}

const positionLabels: Record<string, string> = {
  presidente: 'Presidente',
  'vice-presidente': 'Vice-Presidente',
  'secretario-geral': 'Secretário(a)-Geral',
  'secretario-geral-adjunto': 'Secretário(a)-Geral Adjunto(a)',
  tesoureiro: 'Tesoureiro(a)',
  conselheiro: 'Conselheiro(a)',
}

const positionOrder = [
  'presidente',
  'vice-presidente',
  'secretario-geral',
  'secretario-geral-adjunto',
  'tesoureiro',
  'conselheiro',
]

export function SubsectionDirectoryTab({ members }: SubsectionDirectoryTabProps) {
  const sortedMembers = [...members].sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position)
    const bIndex = positionOrder.indexOf(b.position)
    return aIndex - bIndex
  })

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Diretoria</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Os membros da diretoria desta subseção serão listados aqui.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Diretoria e Conselho
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Conheça os advogados e advogadas eleitos para liderar a subseção na gestão atual.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMembers.map((member) => {
          const image = member.image as PayloadFile | null
          const initials = member.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

          return (
            <div
              key={member.id}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border dark:border-gray-600 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {image?.url ? (
                  <Image
                    src={image.url || '/placeholder.svg'}
                    alt={member.name || 'Membro'}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-xl">{initials || '?'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-1 bg-[#0066cc] text-white rounded text-xs mb-1">
                    {positionLabels[member.position] || member.position}
                  </span>
                </div>
              </div>
              <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {member.name}
              </h5>
              {member.oabNumber && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  OAB/SC {member.oabNumber}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
