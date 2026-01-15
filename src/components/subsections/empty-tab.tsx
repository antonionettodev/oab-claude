import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubsectionEmptyTabProps {
  icon: LucideIcon
  title: string
  description: string
}

export function SubsectionEmptyTab({ icon: Icon, title, description }: SubsectionEmptyTabProps) {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{description}</p>
      <Button variant="outline">Em breve</Button>
    </div>
  )
}
