---
description: Padrão obrigatório de UI: todo código de interface deve ser escrito em Next.js (App Router) + TailwindCSS + shadcn/ui, respeitando as convenções do projeto (kebab-case em arquivos/pastas, componentes por módulo, PascalCase com escopo, hooks, e operações com Payload via Server Actions).
alwaysApply: true
---

# Padrão obrigatório de UI (Next.js + Tailwind + shadcn/ui)

> Esta regra complementa (e deve obedecer) todas as convenções já definidas no projeto:  
> - pastas/arquivos em **minúsculas + kebab-case**  
> - componentes por módulo em `components/<modulo>/` sem nome redundante no arquivo  
> - nome do componente exportado em **PascalCase** com **escopo** (ex.: `PostHeader`)  
> - hooks conforme convenção (frontend `use*`, backend `*Hook`)  
> - operações com Payload: **GET em Server Components** e **mutations em Server Actions**

## Stack obrigatória
- Todo código de interface deve ser escrito em **Next.js (App Router)**.
- **Nunca gerar React genérico** (CRA, Vite React, JSX solto).
- Estilos devem ser feitos **exclusivamente com TailwindCSS**.
- Componentes base de UI devem **priorizar shadcn/ui** (Button, Card, Dialog, Sheet, Tabs, Dropdown, Input, Select, Table etc.).
- Ícones: preferir `lucide-react`.

## Aplicação (sempre)
Estas regras se aplicam **sempre**, inclusive quando:
- Criar UI do zero
- Reescrever/refatorar UI existente
- Colar código externo (Figma, exemplos, React puro)
- Ajustar layout/estilos/estrutura

Sempre adaptar para o stack e convenções do projeto.

## Preservação de design
- Manter fielmente: layout, espaçamentos, tipografia, hierarquia visual e cores.
- Implementar estados: hover, focus, active, disabled (Tailwind).
- Garantir responsividade com breakpoints do Tailwind.

## Modularização e organização de arquivos (obrigatória)
- Evitar arquivos monolíticos.
- Separar UI em componentes por seção/bloco (ex.: `hero`, `features`, `cta`, `pricing`, `faq`).
- Componentes específicos de uma página/módulo devem ficar em: `components/<modulo>/`.

### Nome de arquivo vs nome do componente (sem redundância)
- Arquivo: **minúsculas + kebab-case**, sem repetir escopo quando a pasta já define.
  - ✅ `components/posts/header.tsx`
  - ✅ `components/posts/card.tsx`
  - ❌ `components/posts/post-card.tsx`
- Export do componente: **PascalCase** com **escopo** (porque será usado fora da pasta).
  - `components/posts/header.tsx` → `export function PostHeader() {}`
  - `components/posts/card.tsx` → `export function PostCard() {}`

## Server vs Client Components (Next)
- Componentes devem ser **Server Components por padrão**.
- Usar `use client` **somente quando necessário**:
  - state
  - effects
  - handlers de eventos
  - bibliotecas client-only / browser-only APIs
- Nunca marcar como client “por padrão”.

## Integração com dados (Next + Payload)
- Leitura (GET): preferir **Server Components** usando o objeto local do Payload.
- Mutations (create/update/delete/auth): usar **Server Actions** com o objeto local do Payload.
- Evitar fetch client-side sem necessidade.

## Reuso vs código local
- Se um trecho é usado em muitos contextos, extrair para reutilizável.
- Se é usado só em um componente/contexto, manter local para evitar pastas/arquivos desnecessários.

## Saída esperada ao gerar/adaptar UI
Ao criar ou adaptar UI, sempre entregar:
- Estrutura de arquivos sugerida (paths em kebab-case)
- Componentes modularizados em `components/<modulo>/`
- Página Next que compõe os componentes (`app/<rota>/page.tsx`)
- Indicação explícita de quais componentes são `use client` (apenas quando necessário)
