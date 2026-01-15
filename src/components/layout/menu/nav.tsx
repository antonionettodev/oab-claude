'use client'
import Link from 'next/link'
import {
  FileText,
  Shield,
  Building2,
  GraduationCap,
  Newspaper,
  Phone,
  CreditCard,
  Search,
  FileCheck,
  UserCog,
  Key,
  AlertTriangle,
  Scale,
  Gavel,
  Users,
  Building,
  MapPin,
  Globe,
  Calendar,
  Video,
  BookOpen,
  Heart,
  Headphones,
  MessageSquare,
  Mail,
  HelpCircle,
  Bot,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type React from 'react'

export type MenuSection =
  | 'servicos'
  | 'defesa'
  | 'institucional'
  | 'orgaos'
  | 'comunicacao'
  | 'contato'
  | null

interface HeaderNavProps {
  currentMenu: MenuSection
  onMenuClick: (menu: MenuSection) => void
  onMouseEnter: (menu: MenuSection) => void
  onMouseLeave: () => void
  onLinkClick: () => void
}

const menuItems: { id: MenuSection; label: string; icon: React.ElementType }[] = [
  { id: 'servicos', label: 'Serviços e Ferramentas', icon: FileText },
  { id: 'defesa', label: 'Defesa e Ética', icon: Shield },
  { id: 'institucional', label: 'Institucional', icon: Building2 },
  { id: 'orgaos', label: 'Órgãos', icon: GraduationCap },
  { id: 'comunicacao', label: 'Comunicação', icon: Newspaper },
  { id: 'contato', label: 'Contato', icon: Phone },
]

export function HeaderNav({
  currentMenu,
  onMenuClick,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}: HeaderNavProps) {
  return (
    <div className="relative" onMouseLeave={onMouseLeave}>
      <nav className="flex items-center justify-center gap-1 py-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            onMouseEnter={() => onMouseEnter(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              currentMenu === item.id
                ? 'bg-primary text-white shadow-md'
                : 'text-foreground hover:bg-muted',
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            <ChevronDown
              className={cn(
                'w-3 h-3 transition-transform',
                currentMenu === item.id && 'rotate-180',
              )}
            />
          </button>
        ))}
      </nav>

      {currentMenu && (
        <div
          className="absolute left-0 right-0 top-full z-50 pt-2"
          onMouseEnter={() => onMouseEnter(currentMenu)}
        >
          <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-xl border border-border p-6">
            {currentMenu === 'servicos' && <ServicesMenu onLinkClick={onLinkClick} />}
            {currentMenu === 'defesa' && <DefenseMenu onLinkClick={onLinkClick} />}
            {currentMenu === 'institucional' && <InstitutionalMenu onLinkClick={onLinkClick} />}
            {currentMenu === 'orgaos' && <DepartmentsMenu onLinkClick={onLinkClick} />}
            {currentMenu === 'comunicacao' && <CommunicationMenu onLinkClick={onLinkClick} />}
            {currentMenu === 'contato' && <ContactMenu onLinkClick={onLinkClick} />}
          </div>
        </div>
      )}
    </div>
  )
}

function MenuColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function MenuItem({
  href,
  icon: Icon,
  label,
  description,
  highlight,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  description?: string
  highlight?: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-2 rounded-lg transition-colors group',
        highlight ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted',
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          highlight
            ? 'bg-destructive/20 text-destructive'
            : 'bg-primary/10 text-primary group-hover:bg-primary/20',
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <span className={cn('font-medium text-sm', highlight && 'text-destructive')}>{label}</span>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </Link>
  )
}

function ServicesMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Financeiro">
        <MenuItem
          href="/anuidade"
          icon={CreditCard}
          label="Anuidade e Boletos"
          description="Consulta e emissão de boletos"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/urh"
          icon={Scale}
          label="Tabela de Honorários"
          description="Valores recomendados"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Cadastro e Acesso">
        <MenuItem
          href="/#"
          icon={UserCog}
          label="Área do Advogado"
          description="Painel pessoal"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileCheck}
          label="Inscrição e Cadastro"
          description="Novos advogados"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={UserCog}
          label="Atualização Cadastral"
          description="Alterar dados"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Ferramentas">
        <MenuItem
          href="/#"
          icon={Search}
          label="Consulta de Advogados"
          description="Busca no cadastro"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Key}
          label="INSS Digital"
          description="Acesso ao sistema"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileText}
          label="Peticionamento Eletrônico"
          description="Sistemas dos tribunais"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}

function DefenseMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Plantão e Urgências">
        <MenuItem
          href="/#"
          icon={Phone}
          label="Plantão 24h"
          description="Apoio em flagrantes"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={AlertTriangle}
          label="Registrar Violação"
          description="Denuncie imediatamente"
          highlight
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Prerrogativas">
        <MenuItem
          href="/prerrogativas"
          icon={Shield}
          label="Prerrogativas"
          description="Direitos do advogado"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Users}
          label="Comissão de Prerrogativas"
          description="Defesa da classe"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Tribunal de Ética">
        <MenuItem
          href="/ted"
          icon={Gavel}
          label="Apresentação do TED"
          description="Conheça o tribunal"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileText}
          label="Consulta de Processos"
          description="Acompanhar tramitação"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={BookOpen}
          label="Código de Ética"
          description="Normas profissionais"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}

function InstitutionalMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Estrutura">
        <MenuItem
          href="/diretoria"
          icon={Users}
          label="Diretoria"
          description="Gestão atual"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Building}
          label="Conselho Estadual"
          description="Composição"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Building2}
          label="Conselho Federal"
          description="Representação"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Organização">
        <MenuItem
          href="/comissoes"
          icon={Users}
          label="Comissões"
          description="Grupos temáticos"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/subsecoes"
          icon={MapPin}
          label="Subseções"
          description="Unidades regionais"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={BookOpen}
          label="História da OAB/SC"
          description="Nossa trajetória"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Transparência">
        <MenuItem
          href="/#"
          icon={Globe}
          label="Portal da Transparência"
          description="Dados públicos"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileText}
          label="Atos Normativos"
          description="Legislação interna"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileCheck}
          label="Relatórios de Gestão"
          description="Prestação de contas"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}

function DepartmentsMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Escola Superior">
        <MenuItem
          href="/esa"
          icon={GraduationCap}
          label="ESA - Escola Superior"
          description="Educação continuada"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={BookOpen}
          label="Cursos Disponíveis"
          description="Grade de cursos"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileCheck}
          label="Pós-Graduação"
          description="Especializações"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Assistência">
        <MenuItem
          href="/caixa-de-assistencia"
          icon={Heart}
          label="CAASC"
          description="Caixa de Assistência"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Users}
          label="Benefícios"
          description="Auxílios disponíveis"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileText}
          label="Convênios"
          description="Parcerias"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Lazer e Hospedagem">
        <MenuItem
          href="/#"
          icon={Building}
          label="Sede Balneária"
          description="Praia de Canasvieiras"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={MapPin}
          label="Pousada de Itá"
          description="Serra catarinense"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Calendar}
          label="Fazer Reserva"
          description="Sistema de reservas"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}

function CommunicationMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Eventos">
        <MenuItem
          href="/eventos"
          icon={Calendar}
          label="Agenda de Eventos"
          description="Próximas atividades"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileCheck}
          label="Inscrições Abertas"
          description="Participe"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={BookOpen}
          label="Eventos Anteriores"
          description="Arquivo"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Notícias">
        <MenuItem
          href="/posts"
          icon={Newspaper}
          label="Notícias"
          description="Últimas informações"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={FileText}
          label="Jornal do Advogado"
          description="Publicação oficial"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={BookOpen}
          label="Artigos e Colunas"
          description="Opinião"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Multimídia">
        <MenuItem
          href="/#"
          icon={Video}
          label="Vídeos"
          description="Canal de vídeos"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Headphones}
          label="Podcast"
          description="Áudio sob demanda"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Newspaper}
          label="Galeria de Fotos"
          description="Registros de eventos"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}

function ContactMenu({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <MenuColumn title="Fale Conosco">
        <MenuItem
          href="/#"
          icon={MessageSquare}
          label="Fale Conosco"
          description="Envie sua mensagem"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={HelpCircle}
          label="Ouvidoria"
          description="Canal oficial"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Mail}
          label="Assessoria de Imprensa"
          description="Contato para mídia"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Localização">
        <MenuItem
          href="/#"
          icon={Building}
          label="Sede da OAB/SC"
          description="Florianópolis"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/subsecoes"
          icon={MapPin}
          label="Subseções"
          description="Unidades regionais"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={Calendar}
          label="Horários de Atendimento"
          description="Funcionamento"
          onClick={onLinkClick}
        />
      </MenuColumn>
      <MenuColumn title="Atendimento Digital">
        <MenuItem
          href="/inteligencia-artificial"
          icon={Bot}
          label="Assistente Virtual"
          description="IA para dúvidas"
          highlight
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={HelpCircle}
          label="Perguntas Frequentes"
          description="Dúvidas comuns"
          onClick={onLinkClick}
        />
        <MenuItem
          href="/#"
          icon={MessageSquare}
          label="Chat Online"
          description="Atendimento ao vivo"
          onClick={onLinkClick}
        />
      </MenuColumn>
    </div>
  )
}
