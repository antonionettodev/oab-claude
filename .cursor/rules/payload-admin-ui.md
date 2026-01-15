---
description: Admin UI no Payload: admin.group por domínio, labels pt-BR (singular/plural), placeholders/descriptions, organização de fields com tabs/group/row.
globs: ["**/collections/**/*.ts", "**/collections/**/*.tsx", "**/fields/**/*.ts", "**/fields/**/*.tsx", "**/src/fields/**/*.ts", "**/src/fields/**/*.tsx"]
alwaysApply: false
---

# Payload - Admin UI / Labels / Fields

## Grupos no painel
- Collections relacionadas devem ter `admin.group` com o mesmo nome para agrupar no painel.

## Labels e idioma
- Todos os fields devem ter `label` em português.
- Todas as collections devem ter labels em português:
  - `labels.singular`
  - `labels.plural`

## Placeholders e descriptions
- Sempre que possível:
  - definir `placeholder` (prioridade alta)
  - definir `description` (opcional, mas recomendado)

## Organização de fields em coleções grandes
- Usar `tabs`, `group`, `row` para organizar melhor.