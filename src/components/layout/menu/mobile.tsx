'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Shield,
  Building2,
  GraduationCap,
  Newspaper,
  Phone,
  Home,
  MoreHorizontal,
  CreditCard,
  Scale,
  User,
  MessageCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type MenuSection =
  | 'servicos'
  | 'defesa'
  | 'institucional'
  | 'orgaos'
  | 'comunicacao'
  | 'contato'
  | 'mais'
  | null

interface MobileBottomNavProps {
  className?: string
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const [activeSheet, setActiveSheet] = useState<MenuSection>(null)

  const closeSheet = () => setActiveSheet(null)

  return (
    <>
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-lg md:hidden',
          className,
        )}
      >
        <div className="flex items-center justify-around h-16 px-2">
          <NavItem icon={Home} label="Início" href="/" />
          <NavItem
            icon={FileText}
            label="Serviços"
            onClick={() => setActiveSheet('servicos')}
            active={activeSheet === 'servicos'}
          />
          <NavItem
            icon={Shield}
            label="Defesa"
            onClick={() => setActiveSheet('defesa')}
            active={activeSheet === 'defesa'}
            highlight
          />
          <NavItem
            icon={Building2}
            label="OAB"
            onClick={() => setActiveSheet('institucional')}
            active={activeSheet === 'institucional'}
          />
          <NavItem
            icon={MoreHorizontal}
            label="Mais"
            onClick={() => setActiveSheet('mais')}
            active={activeSheet === 'mais'}
          />
        </div>
      </nav>

      <Sheet open={activeSheet === 'servicos'} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Serviços e Ferramentas
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-2 overflow-y-auto max-h-[calc(70vh-80px)]">
            <SheetLinkGroup title="Acesso Rápido">
              <SheetLink href="/anuidade" icon={CreditCard} onClick={closeSheet}>
                Anuidade e Boletos
              </SheetLink>
              <SheetLink href="/urh" icon={Scale} onClick={closeSheet}>
                Tabela de Honorários
              </SheetLink>
              <SheetLink href="/#" icon={User} onClick={closeSheet}>
                Área do Advogado
              </SheetLink>
            </SheetLinkGroup>
            <SheetLinkGroup title="Serviços">
              <SheetLink href="/#" onClick={closeSheet}>
                Inscrição e Cadastro
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Inscrição de Advogados
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Registro de Sociedades
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Atualização Cadastral
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Expedição de Documentos
              </SheetLink>
            </SheetLinkGroup>
            <SheetLinkGroup title="Sistemas">
              <SheetLink href="/#" onClick={closeSheet}>
                INSS Digital
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Peticionamento Eletrônico
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Suporte Eproc
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Consulta CNA
              </SheetLink>
            </SheetLinkGroup>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === 'defesa'} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Defesa e Ética
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(70vh-80px)]">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#E85D75] to-[#d94d65] hover:from-[#d94d65] hover:to-[#c93d55] text-white py-6 rounded-xl"
            >
              <Link href="/violacao-prerrogativas" onClick={closeSheet}>
                <ShieldAlert className="w-5 h-5 mr-2" />
                Registrar Violação de Prerrogativas
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  Prioritário
                </span>
              </Link>
            </Button>

            <SheetLinkGroup title="Prerrogativas">
              <SheetLink href="/#" onClick={closeSheet}>
                Plantão 24h (Defesapp)
              </SheetLink>
              <SheetLink href="/prerrogativas" onClick={closeSheet}>
                Legislação de Prerrogativas
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Registro de Ocorrência
              </SheetLink>
            </SheetLinkGroup>
            <SheetLinkGroup title="Tribunal de Ética (TED)">
              <SheetLink href="/ted" onClick={closeSheet}>
                O que é o TED
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Legislação e Normas
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Pedido de Representação
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Consulta de Processos
              </SheetLink>
            </SheetLinkGroup>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Institucional */}
      <Sheet open={activeSheet === 'institucional'} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Institucional
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-2 overflow-y-auto max-h-[calc(70vh-80px)]">
            <SheetLinkGroup title="Estrutura">
              <SheetLink href="/diretoria" onClick={closeSheet}>
                Diretoria
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Conselho Estadual
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Conselho Federal
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Câmaras Julgadoras
              </SheetLink>
            </SheetLinkGroup>
            <SheetLinkGroup title="Comissões e Subseções">
              <SheetLink href="/comissoes" onClick={closeSheet}>
                Comissões
              </SheetLink>
              <SheetLink href="/subsecoes" onClick={closeSheet}>
                Encontrar Subseção
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Inscrição para Membro
              </SheetLink>
            </SheetLinkGroup>
            <SheetLinkGroup title="Transparência">
              <SheetLink href="/#" onClick={closeSheet}>
                Portal da Transparência
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                LGPD
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Política de Privacidade
              </SheetLink>
            </SheetLinkGroup>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Mais */}
      <Sheet open={activeSheet === 'mais'} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <MoreHorizontal className="w-5 h-5 text-primary" />
              Mais opções
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(80vh-80px)]">
            {/* Card IA */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-[#E85D75] p-[2px]">
              <div className="bg-background rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Assistente Virtual</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary to-[#E85D75] rounded-full text-xs text-white">
                        <Sparkles className="w-3 h-3" />
                        Novo
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Atendimento 24h</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/inteligencia-artificial" onClick={closeSheet}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Conversar Agora
                  </Link>
                </Button>
              </div>
            </div>

            <SheetLinkGroup title="Órgãos Auxiliares" icon={GraduationCap}>
              <SheetLink href="/esa" onClick={closeSheet}>
                ESA - Escola Superior
              </SheetLink>
              <SheetLink href="/caixa-de-assistencia" onClick={closeSheet}>
                CAASC - Caixa de Assistência
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Sede Balneária
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Pousada de Itá
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Salas da OAB
              </SheetLink>
            </SheetLinkGroup>

            <SheetLinkGroup title="Eventos e Comunicação" icon={Newspaper}>
              <SheetLink href="/eventos" onClick={closeSheet}>
                Eventos
              </SheetLink>
              <SheetLink href="/posts" onClick={closeSheet}>
                Notícias
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Jornal do Advogado
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Publicações
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Vídeos
              </SheetLink>
            </SheetLinkGroup>

            <SheetLinkGroup title="Contato" icon={Phone}>
              <SheetLink href="/#" onClick={closeSheet}>
                Fale Conosco
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Ouvidoria
              </SheetLink>
              <SheetLink href="/#" onClick={closeSheet}>
                Localização
              </SheetLink>
            </SheetLinkGroup>

            {/* Info de contato */}
            <div className="p-4 bg-muted rounded-xl space-y-2">
              <p className="text-sm font-medium">Central de Atendimento</p>
              <p className="text-sm text-muted-foreground">(48) 3239-3500</p>
              <p className="text-sm font-medium mt-2">Plantão 24h</p>
              <p className="text-sm text-muted-foreground">(48) 3239-3641</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

// Subcomponentes locais

function NavItem({
  icon: Icon,
  label,
  href,
  onClick,
  active,
  highlight,
}: {
  icon: React.ElementType
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
  highlight?: boolean
}) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors',
        active && 'bg-primary/10',
        highlight && !active && 'text-[#E85D75]',
      )}
    >
      <Icon
        className={cn(
          'w-5 h-5',
          active ? 'text-primary' : highlight ? 'text-[#E85D75]' : 'text-muted-foreground',
        )}
      />
      <span
        className={cn(
          'text-xs',
          active
            ? 'text-primary font-medium'
            : highlight
              ? 'text-[#E85D75]'
              : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  )
}

function SheetLinkGroup({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 py-1">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function SheetLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string
  icon?: React.ElementType
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
    >
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      {children}
    </Link>
  )
}
