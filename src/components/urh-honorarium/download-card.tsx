'use client'

import { FileText, Download, Calendar } from 'lucide-react'
import type { File } from '@/payload-types'

export interface UrhDownloadCardProps {
  title: string
  file: File | number | null
  createdAt: string
  onDownload?: (fileUrl: string) => void
}

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)
  return `${size.toFixed(1)} ${sizes[i]}`
}

export function UrhDownloadCard({ title, file, createdAt, onDownload }: UrhDownloadCardProps) {
  const fileData = typeof file === 'object' && file !== null ? file : null
  const fileUrl = fileData?.url || ''
  const fileSize = fileData?.filesize || 0
  const formattedSize = formatFileSize(fileSize)

  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const handleDownload = () => {
    if (fileUrl) {
      if (onDownload) {
        onDownload(fileUrl)
      } else {
        window.open(fileUrl, '_blank')
      }
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0066cc] transition-all group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
            <FileText className="w-8 h-8 text-[#E85D75]" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-1 font-semibold">{title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span>{formattedSize}</span>
            </div>
          </div>
        </div>

        {fileUrl && (
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white px-6 py-3 rounded-full shadow-md hover:shadow-xl hover:scale-105 hover:cursor-pointer transition-all duration-200"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        )}
      </div>
    </div>
  )
}
