import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { textareaField } from '@/fields/textarea'
import { titleField } from '@/fields/title'
import { slugField } from 'payload'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

import { generateCheckinPasswordHook } from './hooks/generateCheckinPasswordHook'
import { generateEventQRCodeHook } from './hooks/generateEventQRCodeHook'
import { validateEventDatesHook } from './hooks/validateEventDatesHook'
import { updateEventStatusHook } from './hooks/updateEventStatusHook'
import {
  checkinEndpoint,
  downloadCertificateEndpoint,
  issueCertificateEndpoint,
  lookupParticipantEndpoint,
  requestRefundEndpoint,
  searchRegistrationEndpoint,
  selfCheckinEndpoint,
  updatePaymentEndpoint,
  validateCertificateEndpoint,
  validatePaymentEndpoint,
  validateQRCodeEndpoint,
} from './endpoints'

/**
 * Collection: Eventos
 *
 * Collection principal para gerenciamento de eventos e cursos.
 *
 * Tipos de Evento:
 * - Externo (Grande Porte): QR Code individual por ingresso, check-in por funcionário
 * - Interno (Subseções/Cursos Menores): QR Code fixo do evento, auto check-in
 *
 * Funcionalidades:
 * - Múltiplas salas (conferências)
 * - Múltiplos tipos de ingresso
 * - Desconto em grupo progressivo
 * - Certificados
 * - Check-in com validação de pagamento
 */
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
    defaultColumns: ['title', 'eventType', 'startDate', 'status', 'registrationCount'],
    description: 'Gerenciamento de eventos e cursos',
  },
  access: {
    read: anyone,
  },
  hooks: {
    beforeValidate: [validateEventDatesHook],
    beforeChange: [updateEventStatusHook],
    afterChange: [generateEventQRCodeHook],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // =====================================================
        // TAB 1: INFORMAÇÕES GERAIS
        // =====================================================
        {
          label: 'Informações Gerais',
          fields: [
            {
              type: 'group',
              label: 'Dados Básicos',
              fields: [
                titleField({
                  label: 'Título do Evento',
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
                        { label: 'Conferência', value: 'conference' },
                        { label: 'Workshop', value: 'workshop' },
                        { label: 'Seminário', value: 'seminar' },
                        { label: 'Palestra', value: 'lecture' },
                      ],
                      admin: {
                        placeholder: 'Selecione o tipo',
                        width: '33%',
                      },
                    },
                    {
                      name: 'eventType',
                      type: 'select',
                      label: 'Formato do Evento',
                      required: true,
                      defaultValue: 'internal',
                      options: [
                        {
                          label: 'Interno (Auto Check-in)',
                          value: 'internal',
                        },
                        {
                          label: 'Externo (Check-in por Funcionário)',
                          value: 'external',
                        },
                      ],
                      admin: {
                        placeholder: 'Selecione o formato',
                        description:
                          'Interno: QR Code fixo no local. Externo: QR Code individual por ingresso.',
                        width: '33%',
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
                        width: '34%',
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
                        width: '25%',
                      },
                    },
                    {
                      name: 'endDate',
                      type: 'date',
                      label: 'Data de Término',
                      required: true,
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy',
                          pickerAppearance: 'dayOnly',
                        },
                        width: '25%',
                      },
                    },
                    {
                      name: 'startTime',
                      type: 'text',
                      label: 'Horário de Início',
                      required: true,
                      maxLength: 5,
                      admin: {
                        placeholder: 'Ex: 09:00',
                        width: '25%',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'endTime',
                      type: 'text',
                      label: 'Horário de Término',
                      required: true,
                      maxLength: 5,
                      admin: {
                        placeholder: 'Ex: 18:00',
                        width: '25%',
                      },
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
                      label: 'Comissão Organizadora',
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
              admin: {
                condition: (data) => data?.modality !== 'virtual',
              },
              fields: [
                {
                  name: 'venue',
                  type: 'text',
                  label: 'Local',
                  maxLength: 200,
                  admin: {
                    placeholder: 'Ex: Auditório da OAB-SC',
                    description: 'Nome do local onde será realizado',
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'address',
                      type: 'text',
                      label: 'Endereço',
                      maxLength: 300,
                      admin: {
                        placeholder: 'Ex: Rua Principal, 123 - Centro',
                        width: '70%',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      label: 'Cidade',
                      maxLength: 100,
                      admin: {
                        placeholder: 'Ex: Florianópolis',
                        width: '30%',
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
              label: 'Transmissão Online',
              admin: {
                condition: (data) => data?.modality === 'virtual' || data?.modality === 'hybrid',
              },
              fields: [
                {
                  name: 'streamingUrl',
                  type: 'text',
                  label: 'Link da Transmissão',
                  maxLength: 500,
                  admin: {
                    placeholder: 'Ex: https://youtube.com/live/...',
                    description: 'URL para acesso à transmissão ao vivo',
                  },
                },
                {
                  name: 'streamingPlatform',
                  type: 'select',
                  label: 'Plataforma',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Zoom', value: 'zoom' },
                    { label: 'Microsoft Teams', value: 'teams' },
                    { label: 'Google Meet', value: 'meet' },
                    { label: 'Outra', value: 'other' },
                  ],
                  admin: {
                    placeholder: 'Selecione a plataforma',
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
                  description: 'Informações detalhadas sobre o evento',
                  maxLength: 3000,
                  required: true,
                }),
                textareaField({
                  name: 'shortDescription',
                  label: 'Descrição Curta',
                  placeholder: 'Breve descrição para listagens...',
                  description: 'Texto curto para exibição em cartões',
                  maxLength: 200,
                }),
                {
                  name: 'targetAudience',
                  type: 'text',
                  label: 'Público-Alvo',
                  maxLength: 200,
                  admin: {
                    placeholder: 'Ex: Advogados, estudantes de direito',
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'workload',
                  type: 'number',
                  label: 'Carga Horária (horas)',
                  min: 0,
                  admin: {
                    description: 'Total de horas do evento/curso',
                  },
                },
                {
                  name: 'included',
                  type: 'array',
                  label: 'O que está incluso?',
                  maxRows: 10,
                  admin: {
                    description: 'Itens inclusos na inscrição',
                  },
                  fields: [
                    {
                      name: 'item',
                      type: 'text',
                      label: 'Item',
                      required: true,
                      maxLength: 150,
                      admin: {
                        placeholder: 'Ex: Material didático, Coffee break',
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
                  label: 'Requisitos para Participação',
                  maxRows: 10,
                  admin: {
                    description: 'Pré-requisitos para inscrição',
                  },
                  fields: [
                    {
                      name: 'requirement',
                      type: 'text',
                      label: 'Requisito',
                      required: true,
                      maxLength: 150,
                      admin: {
                        placeholder: 'Ex: Inscrição ativa na OAB',
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
                    description: 'Palestrantes confirmados para o evento',
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
                  label: 'Imagem de Destaque',
                  relationTo: 'files',
                  required: true,
                  admin: {
                    description: 'Imagem principal do evento (recomendado: 1200x630px)',
                  },
                },
                {
                  name: 'gallery',
                  type: 'array',
                  label: 'Galeria de Fotos',
                  admin: {
                    description: 'Fotos adicionais do evento',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      label: 'Foto',
                      relationTo: 'files',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      label: 'Legenda',
                      maxLength: 200,
                    },
                  ],
                },
              ],
            },
          ],
        },
        // =====================================================
        // TAB 2: SALAS E PROGRAMAÇÃO (para conferências)
        // =====================================================
        {
          label: 'Salas e Programação',
          fields: [
            {
              name: 'hasMultipleRooms',
              type: 'checkbox',
              label: 'Evento com Múltiplas Salas',
              defaultValue: false,
              admin: {
                description: 'Marque se o evento terá programações paralelas em diferentes salas',
              },
            },
            {
              type: 'group',
              label: 'Salas do Evento',
              admin: {
                condition: (data) => data?.hasMultipleRooms === true,
                description:
                  'Configure as salas disponíveis para o evento. Cada sala pode ter sua própria capacidade e programação.',
              },
              fields: [
                {
                  name: 'rooms',
                  type: 'array',
                  label: 'Salas',
                  admin: {
                    description: 'Adicione as salas do evento',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          label: 'Nome da Sala',
                          required: true,
                          maxLength: 100,
                          admin: {
                            placeholder: 'Ex: Auditório Principal',
                            width: '50%',
                          },
                          hooks: {
                            beforeChange: [trimHook],
                          },
                        },
                        {
                          name: 'capacity',
                          type: 'number',
                          label: 'Capacidade',
                          required: true,
                          min: 1,
                          admin: {
                            placeholder: 'Ex: 100',
                            description: 'Número máximo de participantes',
                            width: '25%',
                          },
                        },
                        {
                          name: 'floor',
                          type: 'text',
                          label: 'Andar/Localização',
                          maxLength: 50,
                          admin: {
                            placeholder: 'Ex: 2º andar',
                            width: '25%',
                          },
                        },
                      ],
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Descrição',
                      maxLength: 300,
                      admin: {
                        placeholder: 'Descrição da sala e recursos disponíveis...',
                      },
                    },
                    {
                      name: 'roomSchedule',
                      type: 'array',
                      label: 'Programação da Sala',
                      admin: {
                        description: 'Horários e atividades desta sala',
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
                                width: '25%',
                              },
                            },
                            {
                              name: 'startTime',
                              type: 'text',
                              label: 'Início',
                              required: true,
                              maxLength: 5,
                              admin: {
                                placeholder: '09:00',
                                width: '15%',
                              },
                            },
                            {
                              name: 'endTime',
                              type: 'text',
                              label: 'Término',
                              required: true,
                              maxLength: 5,
                              admin: {
                                placeholder: '10:30',
                                width: '15%',
                              },
                            },
                            {
                              name: 'title',
                              type: 'text',
                              label: 'Atividade',
                              required: true,
                              maxLength: 200,
                              admin: {
                                placeholder: 'Ex: Palestra sobre IA no Direito',
                                width: '45%',
                              },
                            },
                          ],
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
                        {
                          name: 'sessionDescription',
                          type: 'textarea',
                          label: 'Descrição da Sessão',
                          maxLength: 500,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Programação Geral',
              admin: {
                condition: (data) => !data?.hasMultipleRooms,
                description: 'Programação do evento (para eventos sem múltiplas salas)',
              },
              fields: [
                {
                  name: 'program',
                  type: 'array',
                  label: 'Programação',
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
                            width: '20%',
                          },
                        },
                        {
                          name: 'time',
                          type: 'text',
                          label: 'Horário',
                          required: true,
                          maxLength: 5,
                          admin: {
                            placeholder: '14:30',
                            width: '15%',
                          },
                          hooks: {
                            beforeChange: [trimHook],
                          },
                        },
                        {
                          name: 'title',
                          type: 'text',
                          label: 'Título',
                          required: true,
                          maxLength: 200,
                          admin: {
                            placeholder: 'Ex: Abertura do Evento',
                            width: '65%',
                          },
                          hooks: {
                            beforeChange: [trimHook],
                          },
                        },
                      ],
                    },
                    {
                      name: 'briefDescription',
                      type: 'textarea',
                      label: 'Descrição',
                      maxLength: 500,
                      admin: {
                        placeholder: 'Descrição da atividade...',
                      },
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
          ],
        },
        // =====================================================
        // TAB 3: INSCRIÇÕES E VALORES
        // =====================================================
        {
          label: 'Inscrições e Valores',
          fields: [
            {
              type: 'group',
              label: 'Configuração de Inscrições',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'registrationType',
                      type: 'select',
                      label: 'Tipo de Inscrição',
                      required: true,
                      defaultValue: 'internal',
                      options: [
                        { label: 'Sistema Interno', value: 'internal' },
                        { label: 'Link Externo', value: 'external' },
                      ],
                      admin: {
                        placeholder: 'Selecione o tipo',
                        width: '50%',
                      },
                    },
                    {
                      name: 'registrationLimit',
                      type: 'number',
                      label: 'Limite de Inscrições',
                      min: 1,
                      admin: {
                        placeholder: 'Ex: 100',
                        description: 'Deixe vazio para sem limite',
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'externalRegistrationUrl',
                  type: 'text',
                  label: 'Link de Inscrição Externa',
                  maxLength: 500,
                  admin: {
                    placeholder: 'https://exemplo.com/inscricao',
                    condition: (data, siblingData) => siblingData?.registrationType === 'external',
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'allowMultipleTickets',
                  type: 'checkbox',
                  label: 'Permitir Múltiplos Ingressos',
                  defaultValue: true,
                  admin: {
                    description: 'Permite que um usuário compre ingressos para outras pessoas',
                    condition: (data, siblingData) => siblingData?.registrationType === 'internal',
                  },
                },
                {
                  name: 'requireTicketHolderData',
                  type: 'checkbox',
                  label: 'Exigir Dados de Cada Participante',
                  defaultValue: true,
                  admin: {
                    description:
                      'Obriga o preenchimento dos dados de cada pessoa que usará os ingressos',
                    condition: (data, siblingData) =>
                      siblingData?.registrationType === 'internal' &&
                      siblingData?.allowMultipleTickets,
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'registrationStartDate',
                      type: 'date',
                      label: 'Início das Inscrições',
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy HH:mm',
                          pickerAppearance: 'dayAndTime',
                        },
                        width: '50%',
                      },
                    },
                    {
                      name: 'registrationEndDate',
                      type: 'date',
                      label: 'Término das Inscrições',
                      admin: {
                        date: {
                          displayFormat: 'dd/MM/yyyy HH:mm',
                          pickerAppearance: 'dayAndTime',
                        },
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'refundDeadlineDays',
                  type: 'number',
                  label: 'Prazo para Reembolso (dias)',
                  defaultValue: 7,
                  min: 0,
                  admin: {
                    description: 'Dias antes do evento até quando é permitido solicitar reembolso',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Tipos de Ingresso',
              admin: {
                condition: (data) => data?.registrationType === 'internal',
              },
              fields: [
                {
                  name: 'ticketTypes',
                  type: 'array',
                  label: 'Categorias de Ingresso',
                  minRows: 1,
                  maxRows: 10,
                  admin: {
                    description:
                      'Configure os tipos de ingresso e valores por categoria de participante',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'participantCategory',
                          type: 'relationship',
                          label: 'Categoria de Participante',
                          relationTo: 'participant-categories',
                          required: true,
                          admin: {
                            width: '40%',
                          },
                        },
                        {
                          name: 'price',
                          type: 'number',
                          label: 'Valor (R$)',
                          required: true,
                          min: 0,
                          admin: {
                            placeholder: 'Ex: 200.00',
                            width: '20%',
                          },
                        },
                        {
                          name: 'maxQuantity',
                          type: 'number',
                          label: 'Limite',
                          min: 0,
                          admin: {
                            placeholder: 'Ex: 50',
                            description: 'Limite por categoria',
                            width: '20%',
                          },
                        },
                        {
                          name: 'isActive',
                          type: 'checkbox',
                          label: 'Ativo',
                          defaultValue: true,
                          admin: {
                            width: '20%',
                          },
                        },
                      ],
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Descrição do Ingresso',
                      maxLength: 200,
                      admin: {
                        placeholder: 'Ex: Inclui acesso a todas as palestras e coffee break',
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'earlyBirdPrice',
                          type: 'number',
                          label: 'Valor Early Bird (R$)',
                          min: 0,
                          admin: {
                            placeholder: 'Ex: 150.00',
                            description: 'Valor promocional antecipado',
                            width: '50%',
                          },
                        },
                        {
                          name: 'earlyBirdDeadline',
                          type: 'date',
                          label: 'Válido até',
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
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Desconto em Grupo',
              admin: {
                description: 'Configure descontos progressivos para compras em grupo',
                condition: (data) => data?.registrationType === 'internal',
              },
              fields: [
                {
                  name: 'groupDiscountEnabled',
                  type: 'checkbox',
                  label: 'Habilitar Desconto em Grupo',
                  defaultValue: false,
                },
                {
                  name: 'groupDiscountDescription',
                  type: 'textarea',
                  label: 'Descrição do Desconto',
                  maxLength: 300,
                  admin: {
                    placeholder:
                      'Ex: Traga seus colegas e ganhe desconto! Quanto mais ingressos, maior o desconto.',
                    condition: (data, siblingData) => siblingData?.groupDiscountEnabled,
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'groupDiscountTiers',
                  type: 'array',
                  label: 'Faixas de Desconto',
                  admin: {
                    description: 'Configure as faixas de desconto progressivo',
                    condition: (data, siblingData) => siblingData?.groupDiscountEnabled,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'minQuantity',
                          type: 'number',
                          label: 'Mínimo de Ingressos',
                          required: true,
                          min: 2,
                          admin: {
                            placeholder: 'Ex: 3',
                            width: '33%',
                          },
                        },
                        {
                          name: 'maxQuantity',
                          type: 'number',
                          label: 'Máximo de Ingressos',
                          min: 2,
                          admin: {
                            placeholder: 'Ex: 5',
                            description: 'Deixe vazio para sem limite',
                            width: '33%',
                          },
                        },
                        {
                          name: 'discountPercent',
                          type: 'number',
                          label: 'Desconto (%)',
                          required: true,
                          min: 0,
                          max: 100,
                          admin: {
                            placeholder: 'Ex: 10',
                            width: '34%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Configurações de Check-in',
              fields: [
                {
                  name: 'checkinPassword',
                  type: 'text',
                  label: 'Senha de Check-in',
                  admin: {
                    readOnly: true,
                    description: 'Código gerado automaticamente para validação de check-in',
                  },
                  hooks: {
                    beforeChange: [generateCheckinPasswordHook],
                  },
                },
                {
                  name: 'eventQRCode',
                  type: 'textarea',
                  label: 'QR Code do Evento (Base64)',
                  admin: {
                    readOnly: true,
                    description: 'QR Code fixo do evento (para eventos internos)',
                    condition: (data) => data?.eventType === 'internal',
                    rows: 2,
                  },
                },
                {
                  name: 'checkinStartMinutes',
                  type: 'number',
                  label: 'Liberar Check-in (minutos antes)',
                  defaultValue: 60,
                  min: 0,
                  admin: {
                    description: 'Quantos minutos antes do evento o check-in é liberado',
                  },
                },
              ],
            },
          ],
        },
        // =====================================================
        // TAB 4: CERTIFICADOS
        // =====================================================
        {
          label: 'Certificados',
          fields: [
            {
              type: 'group',
              label: 'Configuração de Certificados',
              fields: [
                {
                  name: 'hasCertificate',
                  type: 'checkbox',
                  label: 'Emite Certificado',
                  defaultValue: false,
                  admin: {
                    description: 'Marque se este evento/curso emite certificado de participação',
                  },
                },
                {
                  name: 'certificateTemplate',
                  type: 'upload',
                  label: 'Modelo de Certificado (PDF)',
                  relationTo: 'files',
                  admin: {
                    description: 'Template PDF para geração dos certificados',
                    condition: (data, siblingData) => siblingData?.hasCertificate,
                  },
                },
                {
                  name: 'certificateTitle',
                  type: 'text',
                  label: 'Título no Certificado',
                  maxLength: 200,
                  admin: {
                    placeholder: 'Ex: Certificado de Participação',
                    description: 'Título que aparecerá no certificado',
                    condition: (data, siblingData) => siblingData?.hasCertificate,
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'certificateDescription',
                  type: 'textarea',
                  label: 'Texto do Certificado',
                  maxLength: 1000,
                  admin: {
                    placeholder: 'Certificamos que {NOME} participou do evento {EVENTO}...',
                    description: 'Use {NOME}, {EVENTO}, {DATA}, {CARGA_HORARIA} como variáveis',
                    condition: (data, siblingData) => siblingData?.hasCertificate,
                    rows: 4,
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'minimumAttendancePercent',
                  type: 'number',
                  label: 'Presença Mínima para Certificado (%)',
                  defaultValue: 75,
                  min: 0,
                  max: 100,
                  admin: {
                    description: 'Percentual mínimo de presença para ter direito ao certificado',
                    condition: (data, siblingData) => siblingData?.hasCertificate,
                  },
                },
                {
                  name: 'allowDuplicateCertificate',
                  type: 'checkbox',
                  label: 'Permitir Segunda Via',
                  defaultValue: true,
                  admin: {
                    description: 'Permite que participantes emitam segunda via do certificado',
                    condition: (data, siblingData) => siblingData?.hasCertificate,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // =====================================================
    // SIDEBAR FIELDS
    // =====================================================
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Publicado', value: 'published' },
        { label: 'Inscrições Abertas', value: 'registration-open' },
        { label: 'Inscrições Encerradas', value: 'registration-closed' },
        { label: 'Em Andamento', value: 'ongoing' },
        { label: 'Encerrado', value: 'closed' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Destaque',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Exibir na página inicial',
      },
    },
    {
      name: 'registrationCount',
      type: 'number',
      label: 'Total de Inscritos',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    slugField(),
    createdByField,
    editedByField,
  ],
  endpoints: [
    issueCertificateEndpoint,
    validateCertificateEndpoint,
    downloadCertificateEndpoint,
    checkinEndpoint,
    selfCheckinEndpoint,
    validatePaymentEndpoint,
    updatePaymentEndpoint,
    requestRefundEndpoint,
    validateQRCodeEndpoint,
    searchRegistrationEndpoint,
    lookupParticipantEndpoint,
  ],
}
