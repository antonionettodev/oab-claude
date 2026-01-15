import { UrhDownloadCard, type UrhDownloadCardProps } from './download-card'
import type { UrhHonorarium } from '@/payload-types'

interface UrhDownloadListProps {
  urhs: UrhHonorarium[]
  onDownload?: (fileUrl: string) => void
}

export function UrhDownloadList({ urhs, onDownload }: UrhDownloadListProps) {
  if (urhs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-600">Nenhuma tabela disponível no momento.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tabelas Disponíveis para Download</h2>

      <div className="space-y-4">
        {urhs.map((urh) => (
          <UrhDownloadCard
            key={urh.id}
            title={urh.title}
            file={urh.file}
            createdAt={urh.createdAt}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  )
}
