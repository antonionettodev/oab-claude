---
description: Padrões de Payload: collections em collections/<nome>/index.ts, hooks/fields/access/endpoints por pasta, domínios agrupados.
globs: ["**/collections/**/*.ts", "**/collections/**/*.tsx", "**/src/collections/**/*.ts", "**/src/collections/**/*.tsx"]
alwaysApply: false
---

# Payload - Collections

## Estrutura base
- Collections devem ficar em `collections/<collection>/index.ts` (arquivo com a config).
  - ✅ `collections/posts/index.ts`

## Itens específicos da collection
- Se hooks/fields/access/endpoints forem grandes, separar dentro da própria collection:
  - `collections/<collection>/hooks/<nome>.ts`
  - `collections/<collection>/fields/<nome>.ts`
  - `collections/<collection>/access/<nome>.ts`
  - `collections/<collection>/endpoints/<nome>.ts`

## Compartilhados
- Hooks reutilizados por várias collections: `src/hooks/`
- Fields reutilizados por várias collections: `src/fields/`

## Agrupamento por domínio
- Se várias collections pertencem ao mesmo domínio/contexto, agrupar em pasta:
  - `collections/subsections/index.ts`
  - `collections/subsections/members/index.ts`
- Se `members` tiver hooks/fields próprios, seguir a mesma regra dentro de `members/`.
