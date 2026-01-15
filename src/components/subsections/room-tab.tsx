import { DoorOpen, Phone, Mail, Clock } from 'lucide-react'
import type { SubsectionRoom } from '@/payload-types'

interface SubsectionRoomTabProps {
  rooms: SubsectionRoom[]
}

export function SubsectionRoomTab({ rooms }: SubsectionRoomTabProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <DoorOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Salas da Subseção
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          Nenhuma sala cadastrada para esta subseção.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col"
        >
          <div className="mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#0066cc] dark:text-blue-400 inline-block">
              <DoorOpen className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{room.title}</h3>

          {room.address && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 grow line-clamp-2">
              {room.address}
            </p>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
            {room.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{room.phone}</span>
              </div>
            )}
            {room.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{room.email}</span>
              </div>
            )}
            {room.serviceHours && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{room.serviceHours}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
