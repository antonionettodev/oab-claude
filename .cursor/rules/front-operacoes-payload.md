---
description: Convenções no front (Next + Payload): create/update/auth/delete via payload local em Server Actions; get em Server Components sem action obrigatória.
globs: ["**/app/**/*.ts", "**/app/**/*.tsx", "**/src/**/*.ts", "**/src/**/*.tsx"]
alwaysApply: false
---

# Next + Payload (operações)

## Mutations (create / update / auth / delete)
- Devem ser feitas usando o `payload` local dentro de **Server Actions**.

## Gets
- Devem ser feitos com o `payload` nativo em **Server Components**.
- Não precisam virar action obrigatoriamente.
