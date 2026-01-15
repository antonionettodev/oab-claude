import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { titleField } from '@/fields/title'
import { validateBoardPositionHook } from './hooks/validate-board-position'

export const Board: CollectionConfig = {
  slug: 'board',
  labels: {
    singular: 'Membro da Diretoria',
    plural: 'Membros da Diretoria',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Diretoria',
    defaultColumns: ['title', 'oabNumber', 'management'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados do Membro',
          fields: [
            titleField({
              label: 'Nome',
              placeholder: 'Ex: João da Silva',
            }),
            {
              name: 'oabNumber',
              type: 'text',
              label: 'Nº da OAB',
              required: true,
              admin: {
                placeholder: 'Ex: 12345',
              },
              maxLength: 20,
              hooks: {
                beforeChange: [trimHook],
              },
            },
            {
              name: 'photo',
              type: 'upload',
              label: 'Foto do Membro',
              relationTo: 'files',
              required: false,
              admin: {
                description: 'Foto do membro da diretoria',
              },
            },
          ],
        },
        {
          label: 'Cargo e Gestão',
          fields: [
            {
              name: 'management',
              type: 'relationship',
              label: 'Gestão',
              relationTo: 'managements',
              required: true,
              admin: {
                placeholder: 'Selecione a gestão',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Cargo',
              required: true,
              options: [
                {
                  label: 'Presidente',
                  value: 'presidente',
                },
                {
                  label: 'Vice-Presidente',
                  value: 'vice-presidente',
                },
                {
                  label: 'Secretário(a)-Geral',
                  value: 'secretario-geral',
                },
                {
                  label: 'Secretário(a)-Geral Adjunto',
                  value: 'secretario-geral-adjunto',
                },
                {
                  label: 'Tesoureiro(a)',
                  value: 'tesoureiro',
                },
                {
                  label: 'Tesoureiro(a) Adjunto(a)',
                  value: 'tesoureiro-adjunto',
                },
                {
                  label: 'Diretor(a) Administrativo(a)',
                  value: 'diretor-administrativo',
                },
                {
                  label: 'Diretor(a) Executivo(a)',
                  value: 'diretor-executivo',
                },
                {
                  label: 'Diretor(a) de Relações Institucionais',
                  value: 'diretor-relacoes-institucionais',
                },
                {
                  label: 'Diretor(a) de Defesa das Prerrogativas e Valorização da Advocacia',
                  value: 'diretor-defesa-prerrogativas-valorizacao-advocacia',
                },
                {
                  label: 'Diretor(a) de Educação Jurídica',
                  value: 'diretor-educacao-juridica',
                },
                {
                  label: 'Diretor(a) de Iniciação Profissional',
                  value: 'diretor-iniciacao-profissional',
                },
                {
                  label: 'Diretor(a) de Tecnologia e Inovação',
                  value: 'diretor-tecnologia-inovacao',
                },
                {
                  label: 'Diretor(a) de Inclusão e Acessibilidade',
                  value: 'diretor-inclusao-acessibilidade',
                },
                {
                  label: 'Diretor(a) de Interiorização',
                  value: 'diretor-interiorizacao',
                },
                {
                  label: 'Diretor(a) de Assuntos Penais',
                  value: 'diretor-assuntos-penais',
                },
                {
                  label: 'Diretor(a) de Atendimento',
                  value: 'diretor-atendimento',
                },
                {
                  label: 'Diretor(a) de Relacionamento com a Justiça Federal',
                  value: 'diretor-relacionamento-justica-federal',
                },
                {
                  label: 'Diretor(a) de Relacionamento com a Justiça Estadual',
                  value: 'diretor-relacionamento-justica-estadual',
                },
                {
                  label: 'Diretor(a) de Relacionamento com a Justiça do Trabalho',
                  value: 'diretor-relacionamento-justica-trabalho',
                },
                {
                  label: 'Diretor(a) de Relacionamento com a Justiça Eleitoral',
                  value: 'diretor-relacionamento-justica-eleitoral',
                },
                {
                  label: 'Conselho Estadual Titular',
                  value: 'conselho-estadual-titular',
                },
                {
                  label: 'Conselho Estadual Suplente',
                  value: 'conselho-estadual-suplente',
                },
                {
                  label: 'Conselho Federal Titular',
                  value: 'conselho-federal-titular',
                },
                {
                  label: 'Conselho Federal Suplente',
                  value: 'conselho-federal-suplente',
                },
              ],
              admin: {
                placeholder: 'Selecione o cargo',
              },
            },
            {
              name: 'biography',
              type: 'textarea',
              label: 'Biografia Institucional',
              required: false,
              admin: {
                description: 'Biografia institucional do(a) presidente',
                condition: (data) => data?.position === 'presidente',
              },
              maxLength: 1024,
            },
          ],
        },
      ],
    },

    createdByField,
    editedByField,
  ],
  hooks: {
    beforeValidate: [validateBoardPositionHook],
  },
}
