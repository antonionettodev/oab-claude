import type { CollectionConfig } from 'payload'

import { nameField } from '@/fields/name'
import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { trimUppercaseHook } from '@/hooks/trim-uppercase'
import { trimHook } from '@/hooks/trim'
import { stripNonNumericCharactersHook } from '@/hooks/strip-non-numeric-characters'
import { formatPhoneHook } from '@/hooks/format-phone'

export const Lawyers: CollectionConfig = {
  slug: 'lawyers',
  labels: {
    singular: 'Advogado',
    plural: 'Advogados',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Gestão de Pessoas',
    defaultColumns: ['name', 'oabNumber', 'oabState', 'status', 'updatedAt'],
    description: 'Cadastro de advogados integrado com BR Conselhos',
  },
  auth: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados Pessoais',
          fields: [
            {
              type: 'group',
              label: 'Identificação',
              fields: [
                {
                  type: 'row',
                  fields: [
                    nameField({
                      required: true,
                      width: '50%',
                    }),
                    {
                      name: 'birthDate',
                      type: 'date',
                      label: 'Data de Nascimento',
                      admin: {
                        placeholder: 'Data de nascimento',
                        width: '25%',
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                    {
                      name: 'maritalStatus',
                      type: 'select',
                      label: 'Estado Civil',
                      options: [
                        { label: 'Solteiro(a)', value: 'solteiro' },
                        { label: 'Casado(a)', value: 'casado' },
                        { label: 'Divorciado(a)', value: 'divorciado' },
                        { label: 'Viúvo(a)', value: 'viuvo' },
                        { label: 'Separado(a)', value: 'separado' },
                        { label: 'União Estável', value: 'uniao-estavel' },
                      ],
                      admin: {
                        placeholder: 'Selecione o estado civil',
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cpf',
                      type: 'text',
                      label: 'CPF',
                      admin: {
                        placeholder: 'CPF do advogado',
                        width: '25%',
                      },
                      maxLength: 14,
                      hooks: {
                        beforeChange: [stripNonNumericCharactersHook],
                      },
                    },
                    {
                      name: 'rg',
                      type: 'text',
                      label: 'RG',
                      admin: {
                        placeholder: 'Número do RG',
                        width: '25%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'rgIssuer',
                      type: 'text',
                      label: 'Órgão Emissor',
                      admin: {
                        placeholder: 'Ex: SSP',
                        width: '25%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'rgIssueDate',
                      type: 'date',
                      label: 'Data de Emissão',
                      admin: {
                        placeholder: 'Data de emissão do RG',
                        width: '25%',
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Filiação',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'motherName',
                      type: 'text',
                      label: 'Nome da Mãe',
                      admin: {
                        placeholder: 'Nome completo da mãe',
                        width: '50%',
                      },
                      maxLength: 128,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'fatherName',
                      type: 'text',
                      label: 'Nome do Pai',
                      admin: {
                        placeholder: 'Nome completo do pai',
                        width: '50%',
                      },
                      maxLength: 128,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Dados Profissionais',
          fields: [
            {
              type: 'group',
              label: 'Registro OAB',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'oabNumber',
                      type: 'text',
                      label: 'Nº de Inscrição',
                      admin: {
                        placeholder: 'Número de registro no conselho',
                        width: '25%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'temporaryRegistration',
                      type: 'text',
                      label: 'Registro Temporário',
                      admin: {
                        placeholder: 'Registro temporário (se houver)',
                        width: '25%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'oabState',
                      type: 'select',
                      label: 'Seccional (UF)',
                      options: [
                        { label: 'AC', value: 'AC' },
                        { label: 'AL', value: 'AL' },
                        { label: 'AM', value: 'AM' },
                        { label: 'AP', value: 'AP' },
                        { label: 'BA', value: 'BA' },
                        { label: 'CE', value: 'CE' },
                        { label: 'DF', value: 'DF' },
                        { label: 'ES', value: 'ES' },
                        { label: 'GO', value: 'GO' },
                        { label: 'MA', value: 'MA' },
                        { label: 'MG', value: 'MG' },
                        { label: 'MS', value: 'MS' },
                        { label: 'MT', value: 'MT' },
                        { label: 'PA', value: 'PA' },
                        { label: 'PB', value: 'PB' },
                        { label: 'PE', value: 'PE' },
                        { label: 'PI', value: 'PI' },
                        { label: 'PR', value: 'PR' },
                        { label: 'RJ', value: 'RJ' },
                        { label: 'RN', value: 'RN' },
                        { label: 'RO', value: 'RO' },
                        { label: 'RR', value: 'RR' },
                        { label: 'RS', value: 'RS' },
                        { label: 'SC', value: 'SC' },
                        { label: 'SE', value: 'SE' },
                        { label: 'SP', value: 'SP' },
                        { label: 'TO', value: 'TO' },
                      ],
                      admin: {
                        placeholder: 'Selecione a seccional',
                        width: '25%',
                      },
                    },
                    {
                      name: 'subunit',
                      type: 'text',
                      label: 'Subseção/Subunidade',
                      admin: {
                        placeholder: 'Ex: OAB/SC',
                        width: '25%',
                      },
                      maxLength: 64,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Situação Profissional',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'status',
                      type: 'select',
                      label: 'Situação Atual',
                      options: [
                        { label: 'Ativo', value: 'ativo' },
                        { label: 'Inativo', value: 'inativo' },
                        { label: 'Suspenso', value: 'suspenso' },
                        { label: 'Licenciado', value: 'licenciado' },
                        { label: 'Cancelado', value: 'cancelado' },
                        { label: 'Falecido', value: 'falecido' },
                      ],
                      admin: {
                        placeholder: 'Selecione a situação',
                      },
                    },
                  ],
                },
                {
                  name: 'isDefaulter',
                  type: 'checkbox',
                  label: 'Inadimplente',
                  defaultValue: false,
                },
                {
                  name: 'isYoungLawyer',
                  type: 'checkbox',
                  label: 'Jovem Advogado',
                  defaultValue: false,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'judgmentDate',
                      type: 'date',
                      label: 'Data do Acórdão',
                      admin: {
                        placeholder: 'Data de aprovação',
                        width: '50%',
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                    {
                      name: 'internJudgmentDate',
                      type: 'date',
                      label: 'Data do Acórdão (Estagiário)',
                      admin: {
                        placeholder: 'Data de aprovação como estagiário',
                        width: '50%',
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contato',
          fields: [
            {
              type: 'group',
              label: 'Telefones e Email',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'commercialEmail',
                      type: 'email',
                      label: 'Email Comercial',
                      admin: {
                        placeholder: 'Email comercial',
                        width: '34%',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'commercialPhone',
                      type: 'text',
                      label: 'Telefone Comercial',
                      admin: {
                        placeholder: 'Telefone comercial',
                        width: '33%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [stripNonNumericCharactersHook],
                        afterRead: [formatPhoneHook],
                      },
                    },
                    {
                      name: 'commercialPhone2',
                      type: 'text',
                      label: 'Telefone Comercial 2',
                      admin: {
                        placeholder: 'Telefone comercial secundário',
                        width: '33%',
                      },
                      maxLength: 20,
                      hooks: {
                        beforeChange: [stripNonNumericCharactersHook],
                        afterRead: [formatPhoneHook],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Endereço de Correspondência',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'postalCode',
                      type: 'text',
                      label: 'CEP',
                      admin: {
                        placeholder: 'CEP',
                        width: '20%',
                      },
                      maxLength: 9,
                      hooks: {
                        beforeChange: [stripNonNumericCharactersHook],
                      },
                    },
                    {
                      name: 'street',
                      type: 'text',
                      label: 'Logradouro',
                      admin: {
                        placeholder: 'Rua, Avenida, etc.',
                        width: '50%',
                      },
                      maxLength: 128,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'streetNumber',
                      type: 'text',
                      label: 'Número',
                      admin: {
                        placeholder: 'Nº',
                        width: '15%',
                      },
                      maxLength: 10,
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'complement',
                      type: 'text',
                      label: 'Complemento',
                      admin: {
                        placeholder: 'Apto, Sala, etc.',
                        width: '15%',
                      },
                      maxLength: 64,
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'neighborhood',
                      type: 'text',
                      label: 'Bairro',
                      admin: {
                        placeholder: 'Bairro',
                        width: '30%',
                      },
                      maxLength: 64,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      label: 'Município',
                      admin: {
                        placeholder: 'Cidade',
                        width: '30%',
                      },
                      maxLength: 64,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                    {
                      name: 'state',
                      type: 'select',
                      label: 'Estado',
                      options: [
                        { label: 'AC', value: 'AC' },
                        { label: 'AL', value: 'AL' },
                        { label: 'AM', value: 'AM' },
                        { label: 'AP', value: 'AP' },
                        { label: 'BA', value: 'BA' },
                        { label: 'CE', value: 'CE' },
                        { label: 'DF', value: 'DF' },
                        { label: 'ES', value: 'ES' },
                        { label: 'GO', value: 'GO' },
                        { label: 'MA', value: 'MA' },
                        { label: 'MG', value: 'MG' },
                        { label: 'MS', value: 'MS' },
                        { label: 'MT', value: 'MT' },
                        { label: 'PA', value: 'PA' },
                        { label: 'PB', value: 'PB' },
                        { label: 'PE', value: 'PE' },
                        { label: 'PI', value: 'PI' },
                        { label: 'PR', value: 'PR' },
                        { label: 'RJ', value: 'RJ' },
                        { label: 'RN', value: 'RN' },
                        { label: 'RO', value: 'RO' },
                        { label: 'RR', value: 'RR' },
                        { label: 'RS', value: 'RS' },
                        { label: 'SC', value: 'SC' },
                        { label: 'SE', value: 'SE' },
                        { label: 'SP', value: 'SP' },
                        { label: 'TO', value: 'TO' },
                      ],
                      admin: {
                        placeholder: 'UF',
                        width: '20%',
                      },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: 'País',
                      defaultValue: 'Brasil',
                      admin: {
                        placeholder: 'País',
                        width: '20%',
                      },
                      maxLength: 64,
                      hooks: {
                        beforeChange: [trimUppercaseHook],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
