import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'
import { titleField } from '@/fields/title'
import { generateCheckinPasswordHook } from './hooks/generate-checkin-password'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Evento',
    plural: 'Eventos',
  },
  defaultPopulate: {
    featuredImage: true,
    commission: true,
    subsection: true,
    speakers: true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Eventos',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informações Gerais',
          fields: [
            {
              type: 'group',
              label: 'Dados Básicos',
              fields: [
                titleField({
                  label: 'Título',
                  placeholder: 'Ex: Workshop de Direito Digital',
                  width: '100%',
                }),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      label: 'Tipo',
                      required: true,
                      defaultValue: 'event',
                      options: [
                        { label: 'Evento', value: 'event' },
                        { label: 'Curso', value: 'course' },
                      ],
                      admin: {
                        placeholder: 'Selecione o tipo',
                        width: '50%',
                      },
                    },
                    {
                      name: 'modality',
                      type: 'select',
                      label: 'Modalidade',
                      required: true,
                      defaultValue: 'in-person',
                      options: [
                        { label: 'Presencial', value: 'in-person' },
                        { label: 'Híbrido', value: 'hybrid' },
                        { label: 'Virtual', value: 'virtual' },
                      ],
                      admin: {
                        placeholder: 'Selecione a modalidade',
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startDate',
                      type: 'date',
                      label: 'Data de Início',
                      required: true,
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                          pickerAppearance: 'dayOnly',
                        },
                        width: '50%',
                      },
                    },
                    {
                      name: 'endDate',
                      type: 'date',
                      label: 'Data de Encerramento',
                      required: true,
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                          pickerAppearance: 'dayOnly',
                        },
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startTime',
                      type: 'text',
                      label: 'Horário de Início',
                      required: true,
                      admin: {
                        placeholder: 'Ex: 09:00',
                        width: '50%',
                      },
                      maxLength: 5,
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'endTime',
                      type: 'text',
                      label: 'Horário de Encerramento',
                      required: true,
                      admin: {
                        placeholder: 'Ex: 18:00',
                        width: '50%',
                      },
                      maxLength: 5,
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
                      name: 'commission',
                      type: 'relationship',
                      label: 'Comissão',
                      relationTo: 'commissions',
                      admin: {
                        placeholder: 'Selecione a comissão',
                        width: '50%',
                      },
                    },
                    {
                      name: 'subsection',
                      type: 'relationship',
                      label: 'Subseção',
                      relationTo: 'subsections',
                      admin: {
                        placeholder: 'Selecione a subseção',
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Localização',
              fields: [
                {
                  name: 'venue',
                  type: 'text',
                  label: 'Local',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Auditório da OAB-SC',
                    description: 'Nome do local onde será realizado',
                  },
                  maxLength: 200,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Descrição e Detalhes',
              fields: [
                textareaField({
                  name: 'description',
                  label: 'Descrição',
                  placeholder: 'Descreva o evento, objetivos, público-alvo e programação...',
                  description: 'Informações detalhadas',
                  maxLength: 2048,
                  required: true,
                }),
                {
                  name: 'hasCertificate',
                  type: 'checkbox',
                  label: 'Possui Certificado',
                  defaultValue: false,
                },
                {
                  name: 'included',
                  type: 'array',
                  label: 'O que está incluso?',
                  maxRows: 6,
                  admin: {
                    description: 'Adicione até 6 itens inclusos',
                  },
                  fields: [
                    {
                      name: 'item',
                      type: 'text',
                      label: 'Item',
                      required: true,
                      maxLength: 128,
                      admin: {
                        placeholder: 'Ex: Material didático impresso',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                  ],
                },
                {
                  name: 'requirements',
                  type: 'array',
                  label: 'Requisitos',
                  maxRows: 6,
                  admin: {
                    description: 'Adicione até 6 requisitos',
                  },
                  fields: [
                    {
                      name: 'requirement',
                      type: 'text',
                      label: 'Requisito',
                      required: true,
                      maxLength: 128,
                      admin: {
                        placeholder: 'Ex: Inscrição na OAB',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Palestrantes',
              fields: [
                {
                  name: 'speakers',
                  type: 'relationship',
                  label: 'Palestrantes',
                  relationTo: 'speakers',
                  hasMany: true,
                  admin: {
                    placeholder: 'Selecione os palestrantes',
                    description: 'Adicione os palestrantes do evento',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Mídia',
              fields: [
                {
                  name: 'featuredImage',
                  type: 'upload',
                  label: 'Foto de Destaque',
                  relationTo: 'files',
                  required: true,
                  admin: {
                    description: 'Imagem principal',
                  },
                },
                {
                  name: 'gallery',
                  type: 'array',
                  label: 'Fotos',
                  admin: {
                    description: 'Galeria de fotos do evento',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      label: 'Foto',
                      relationTo: 'files',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Programação',
          fields: [
            {
              name: 'program',
              type: 'array',
              label: 'Programação',
              admin: {
                description: 'Adicione os itens da programação',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      label: 'Data',
                      required: true,
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                          pickerAppearance: 'dayOnly',
                        },
                        width: '50%',
                      },
                    },
                    {
                      name: 'time',
                      type: 'text',
                      label: 'Horário',
                      required: true,
                      admin: {
                        placeholder: 'Ex: 14:30',
                        width: '50%',
                      },
                      maxLength: 5,
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  required: true,
                  admin: {
                    placeholder: 'Ex: Palestra Principal',
                  },
                  maxLength: 200,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'briefDescription',
                  type: 'textarea',
                  label: 'Descrição Breve',
                  admin: {
                    placeholder: 'Ex: Workshop de Arbitragem: Módulo I e II',
                  },
                  maxLength: 300,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'speaker',
                  type: 'relationship',
                  label: 'Palestrante',
                  relationTo: 'speakers',
                  admin: {
                    placeholder: 'Selecione o palestrante (opcional)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Inscrições e Valores',
          fields: [
            {
              type: 'group',
              label: 'Configuração de Inscrições',
              fields: [
                {
                  name: 'registrationType',
                  type: 'select',
                  label: 'Tipo de Inscrição',
                  required: true,
                  defaultValue: 'internal',
                  options: [
                    { label: 'Interna', value: 'internal' },
                    { label: 'Externa', value: 'external' },
                  ],
                  admin: {
                    placeholder: 'Selecione o tipo de inscrição',
                  },
                },
                {
                  name: 'externalRegistrationUrl',
                  type: 'text',
                  label: 'Link de Inscrição Externa',
                  admin: {
                    placeholder: 'Ex: https://exemplo.com/inscricao',
                    description: 'URL completa para inscrição em plataforma externa',
                    condition: (data, siblingData) => siblingData.registrationType === 'external',
                  },
                  maxLength: 500,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'ticketTypes',
                  type: 'array',
                  label: 'Tipos de Inscrição',
                  minRows: 1,
                  maxRows: 4,
                  required: true,
                  admin: {
                    description: 'Adicione os tipos de inscrição e valores (mínimo 1, máximo 4)',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'category',
                          type: 'text',
                          label: 'Categoria',
                          required: true,
                          admin: {
                            placeholder: 'Ex: Advogado',
                            width: '50%',
                          },
                          maxLength: 100,
                          hooks: {
                            beforeChange: [trimHook],
                          },
                        },
                        {
                          name: 'price',
                          type: 'number',
                          label: 'Valor (R$)',
                          required: true,
                          admin: {
                            placeholder: 'Ex: 200',
                            width: '50%',
                          },
                          min: 0,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'registrationLimit',
                      type: 'number',
                      label: 'Limite de Inscrições',
                      admin: {
                        placeholder: 'Ex: 100',
                        description: 'Número máximo de inscrições permitidas',
                        width: '50%',
                      },
                      min: 1,
                    },
                    {
                      name: 'refundDeadlineDays',
                      type: 'number',
                      label: 'Prazo para Reembolso (dias)',
                      admin: {
                        placeholder: 'Ex: 7',
                        description: 'Dias antes do evento para solicitar reembolso',
                        width: '50%',
                      },
                      min: 0,
                    },
                  ],
                },
                {
                  name: 'checkinPassword',
                  type: 'text',
                  label: 'Senha de Check-in',
                  admin: {
                    readOnly: true,
                    description: 'Código gerado automaticamente para check-in',
                  },
                  hooks: {
                    beforeChange: [generateCheckinPasswordHook],
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Desconto em Grupo',
              admin: {
                description: 'Configure descontos para compras em grupo',
              },
              fields: [
                {
                  name: 'groupDiscountDescription',
                  type: 'textarea',
                  label: 'Descrição',
                  admin: {
                    placeholder:
                      'Ex: Traga seus amigos e ganhe desconto! Quanto mais ingressos, maior o desconto.',
                  },
                  maxLength: 300,
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'groupDiscountMinPeople',
                      type: 'number',
                      label: 'Mínimo de Pessoas',
                      admin: {
                        placeholder: 'Ex: 3',
                        width: '50%',
                      },
                      min: 2,
                    },
                    {
                      name: 'groupDiscountMaxPeople',
                      type: 'number',
                      label: 'Máximo de Pessoas',
                      admin: {
                        placeholder: 'Ex: 10',
                        width: '50%',
                      },
                      min: 2,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'groupDiscountType',
                      type: 'select',
                      label: 'Tipo de Desconto',
                      options: [
                        { label: 'Porcentagem', value: 'percentage' },
                        { label: 'Valor Fixo', value: 'fixed' },
                      ],
                      admin: {
                        placeholder: 'Selecione o tipo',
                        width: '50%',
                      },
                    },
                    {
                      name: 'groupDiscountValue',
                      type: 'number',
                      label: 'Valor do Desconto',
                      admin: {
                        placeholder: 'Ex: 15',
                        description: '% ou R$ dependendo do tipo',
                        width: '50%',
                      },
                      min: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Ativo', value: 'active' },
        { label: 'Cancelado', value: 'cancelled' },
        { label: 'Encerrado', value: 'closed' },
      ],
      admin: {
        placeholder: 'Selecione o status',
        position: 'sidebar',
      },
    },
    slugField(),
    createdByField,
    editedByField,
  ],
}
