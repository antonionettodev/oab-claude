---
description: Convenções gerais de pastas/arquivos (kebab-case), organização por módulo e regras de modularização/reuso.
alwaysApply: true
---

# Convenção Geral (obrigatória)

## Nomes de pastas e arquivos
- Pastas e arquivos devem ser **minúsculas + kebab-case** (separado por hífen).
- Evite nomes redundantes quando o contexto já está definido pela pasta.

## Organização por módulo/domínio
- Componentes de um módulo/página devem ficar em: `components/<modulo>/`
  - Ex.: `posts` → `components/posts/`

## Evitar redundância no nome do arquivo
- Se o componente é específico de `posts`, não repetir `post` no nome do arquivo, porque a pasta já define o escopo.
  - ✅ `components/posts/card.tsx`
  - ✅ `components/posts/header.tsx`
  - ❌ `components/posts/post-card.tsx`

## Quando extrair para arquivo reutilizável
- Se um código/função é usado **muitas vezes e em vários contextos**, extraia para algo reutilizável.
- Se é usado **apenas em um contexto**, mantenha local (evite criar arquivo/pasta só por “organização”).
