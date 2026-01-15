---
description: Padrões para componentes no Next: arquivo kebab-case, componente exportado PascalCase com escopo, client/server, modularização de páginas.
globs: ["**/components/**/*.ts", "**/components/**/*.tsx", "**/app/**/*.ts", "**/app/**/*.tsx", "**/src/components/**/*.ts", "**/src/components/**/*.tsx"]
alwaysApply: false
---

# Componentes (Next / React)

## Arquivo vs função do componente
- Arquivo: **minúsculo + kebab-case**.
- O arquivo **não repete** o escopo do módulo quando a pasta já define.
- A **função exportada** do componente deve ser **PascalCase** e **incluir escopo**.
  - `components/posts/card.tsx` → exporta `PostCard` (ou `CardPost`)
  - `components/posts/header.tsx` → exporta `PostHeader`

## Funções que não são componentes
- Utilitários, handlers, etc: **camelCase** (primeira letra minúscula).

## Client vs Server
- Usar `use client` apenas quando necessário (state/effect/event handlers/browser APIs).
- Preferir Server Components quando possível.

## Páginas modularizadas
- Exceto páginas muito pequenas, separar por seções em componentes.
- Marcar corretamente se cada componente é client/server.
