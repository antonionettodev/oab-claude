'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Briefcase, GraduationCap, Users, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileOption {
  id: string
  label: string
}

interface AIProfileSelectorProps {
  selectedProfile: string
  onSelectProfile: (profile: string) => void
  profileOptions: ProfileOption[]
}

const profileIcons: Record<string, typeof Briefcase> = {
  advogado: Briefcase,
  estudante: GraduationCap,
  cidadao: Users,
}

export function AIProfileSelector({
  selectedProfile,
  onSelectProfile,
  profileOptions,
}: AIProfileSelectorProps) {
  const [open, setOpen] = useState(false)
  const currentProfile = profileOptions.find((p) => p.id === selectedProfile)
  const CurrentIcon = profileIcons[selectedProfile] || Users

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm text-muted-foreground">
        Selecione seu perfil para uma experiência personalizada
      </span>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-3 rounded-xl px-5 py-5 bg-card hover:bg-accent border-border/50 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CurrentIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">{currentProfile?.label}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                open && 'rotate-180',
              )}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-56 p-2">
          {profileOptions.map((option) => {
            const Icon = profileIcons[option.id] || Users
            const isSelected = option.id === selectedProfile
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => {
                  onSelectProfile(option.id)
                  setOpen(false)
                }}
                className={cn(
                  'cursor-pointer rounded-lg px-3 py-2.5 gap-3',
                  isSelected && 'bg-primary/10',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
