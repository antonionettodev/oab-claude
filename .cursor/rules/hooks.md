---
description: Padrões de hooks: evitar redundância no nome do arquivo, use* no frontend, *Hook no backend, export com escopo quando relevante.
globs: ["**/hooks/**/*.ts", "**/hooks/**/*.tsx", "**/collections/**/hooks/**/*.ts", "**/collections/**/hooks/**/*.tsx", "**/src/hooks/**/*.ts", "**/src/hooks/**/*.tsx"]
alwaysApply: false
---

# Hooks

## Arquivos de hooks (evitar redundância)
- Evite `validate-hook.ts` dentro de `/hooks`.
  - ✅ `hooks/validate.ts`
  - ❌ `hooks/validate-hook.ts`

## Frontend hooks
- Sempre começam com `use` (React convention):
  - ✅ `useDebounce`
  - ✅ `useSomething`

## Backend hooks (Payload / hooks de collection)
- Não precisam começar com `use`, mas devem terminar com `Hook` (ou `Hooks` se plural):
  - ✅ `removeNumbersHook`
  - ✅ `sendNotificationHook`

## Escopo no nome exportado
- Se o hook/func será usado fora do módulo, incluir escopo no export:
  - ✅ `usePostFilters`
  - ✅ `sendPostNotificationHook`
