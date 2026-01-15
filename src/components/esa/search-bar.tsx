'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ESASearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function ESASearchBar({ value, onChange }: ESASearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar cursos e eventos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 py-6 text-base rounded-xl border-border/50 focus-visible:ring-primary"
      />
    </div>
  )
}
