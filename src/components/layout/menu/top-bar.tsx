import Link from 'next/link'
import { Youtube, Instagram, Facebook, Scale, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type React from 'react'
import Image from 'next/image'

const LOGO_OAB_SC = '/logo.svg'

export function HeaderTopBar() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <Link href="/" className="h-16 w-32 shrink-0 hover:opacity-80 transition-opacity">
          <Image
            src={LOGO_OAB_SC || '/placeholder.svg'}
            width={128}
            height={64}
            alt="OAB Santa Catarina"
            className="h-full w-full object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          <SocialIcon
            href="https://www.youtube.com/user/telematicaoab"
            icon={Youtube}
            label="YouTube"
          />
          <SocialIcon
            href="https://www.instagram.com/oabsantacatarina"
            icon={Instagram}
            label="Instagram"
          />
          <SocialIcon href="https://www.facebook.com/oabsc/" icon={Facebook} label="Facebook" />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/esa"
            className="font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            ESA
          </Link>
          <span className="text-destructive">|</span>
          <Link
            href="/caixa-de-assistencia"
            className="font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            CAASC
          </Link>
          <span className="text-destructive">|</span>
          <Link
            href="/comissoes"
            className="font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            COMISSÕES
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          className="bg-gradient-to-b from-[#E85D75] to-[#d94d65] hover:from-[#d94d65] hover:to-[#c93d55] text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <Link href="/urh">
            <Scale className="w-4 h-4 mr-2" />
            Tabela de Honorários
          </Link>
        </Button>

        <Button
          asChild
          className="bg-gradient-to-b from-primary to-[#0070e0] hover:from-[#0070e0] hover:to-[#0060c0] text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <Link href="/#">
            <User className="w-4 h-4 mr-2" />
            Login ADV
          </Link>
        </Button>
      </div>
    </div>
  )
}

function SocialIcon({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 rounded-full bg-gradient-to-b from-primary to-[#0070e0] hover:scale-110 text-white flex items-center justify-center transition-all shadow-sm"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </a>
  )
}
