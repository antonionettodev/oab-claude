import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { textareaField } from '@/fields/textarea'
import { anyone } from '@/access/anyone'
import { trimHook } from '@/hooks/trim'

import { validateEventCapacityHook } from './hooks/validateEventCapacityHook'
import { calculateTotalPriceHook } from './hooks/calculateTotalPriceHook'
import { generateTicketTokensHook } from './hooks/generateTicketTokensHook'
import {
  updateEventRegistrationCountHook,
  updateEventRegistrationCountAfterDeleteHook,
} from './hooks/updateEventRegistrationCountHook'
import { validateRoomSelectionHook } from './hooks/validateRoomSelectionHook'
import { createPaymentHook } from './hooks/createPaymentHook'

/**
 * Collection: Inscrições
 *
 * Gerencia as inscrições em eventos.
 *
 * Funcionalidades:
 * - Múltiplos ingressos por inscrição
 * - Dados obrigatórios por participante
 * - Desconto em grupo
 * - QR Code individual (eventos externos)
 * - Seleção de salas (conferências)
 * - Validação de pagamento
 */
export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    singular: 'Inscrição',
    plural: 'Inscrições',
  },
  admin: {
    useAsTitle: 'registrationCode',
    group: 'Eventos',
    defaultColumns: [
      'registrationCode',
      'event',
      'registrantName',
      'status',
      'paymentStatus',
      'totalPrice',
      'createdAt',
    ],
    description: 'Inscrições em eventos e cursos',
  },
  access: {
    read: anyone,
  },
  hooks: {
    beforeChange: [validateEventCapacityHook, validateRoomSelectionHook, calculateTotalPriceHook],
    afterChange: [generateTicketTokensHook, updateEventRegistrationCountHook, createPaymentHook],
    afterDelete: [updateEventRegistrationCountAfterDeleteHook],
  },
  fields: [
    // =====================================================
    // DADOS DA INSCRIÇÃO
    // =====================================================
    {
      type: 'row',
      fields: [
        {
          name: 'registrationCode',
          type: 'text',
          label: 'Código da Inscrição',
          unique: true,
          admin: {
            readOnly: true,
            width: '30%',
          },
          hooks: {
            beforeChange: [
              ({ value, operation }) => {
                if (value || operation !== 'create') return value
                // Gera código único: INS-YYYYMMDD-XXXX
                const date = new Date()
                const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
                const random = Math.random().toString(36).substring(2, 6).toUpperCase()
                return `INS-${dateStr}-${random}`
              },
            ],
          },
        },
        {
          name: 'event',
          type: 'relationship',
          label: 'Evento',
          relationTo: 'events',
          required: true,
          admin: {
            width: '70%',
          },
        },
      ],
    },
    // =====================================================
    // DADOS DO RESPONSÁVEL PELA INSCRIÇÃO
    // =====================================================
    {
      type: 'group',
      label: 'Dados do Responsável',
      admin: {
        description: 'Pessoa responsável pela inscrição e pagamento',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'registrantName',
              type: 'text',
              label: 'Nome Completo',
              required: true,
              maxLength: 200,
              admin: {
                placeholder: 'Nome do responsável pela inscrição',
                width: '50%',
              },
              hooks: {
                beforeChange: [trimHook],
              },
            },
            {
              name: 'registrantCPF',
              type: 'text',
              label: 'CPF',
              required: true,
              maxLength: 14,
              admin: {
                placeholder: '000.000.000-00',
                width: '25%',
              },
            },
            {
              name: 'registrantOAB',
              type: 'text',
              label: 'OAB',
              maxLength: 20,
              admin: {
                placeholder: 'Ex: SC12345',
                width: '25%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'registrantEmail',
              type: 'email',
              label: 'E-mail',
              required: true,
              admin: {
                placeholder: 'email@exemplo.com',
                width: '50%',
              },
            },
            {
              name: 'registrantPhone',
              type: 'text',
              label: 'Telefone',
              required: true,
              maxLength: 20,
              admin: {
                placeholder: '(00) 00000-0000',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'user',
          type: 'relationship',
          label: 'Usuário do Sistema',
          relationTo: 'users',
          admin: {
            description: 'Usuário logado que realizou a inscrição',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ req, operation, value }) => {
                if (operation === 'create' && req.user) {
                  return req.user.id
                }
                return value
              },
            ],
          },
        },
      ],
    },
    // =====================================================
    // INGRESSOS/PARTICIPANTES
    // =====================================================
    {
      type: 'group',
      label: 'Ingressos',
      admin: {
        description: 'Participantes inscritos nesta compra',
      },
      fields: [
        {
          name: 'tickets',
          type: 'array',
          label: 'Participantes',
          minRows: 1,
          maxRows: 20,
          admin: {
            description: 'Adicione os dados de cada participante',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'participantName',
                  type: 'text',
                  label: 'Nome do Participante',
                  required: true,
                  maxLength: 200,
                  admin: {
                    placeholder: 'Nome completo',
                    width: '50%',
                  },
                  hooks: {
                    beforeChange: [trimHook],
                  },
                },
                {
                  name: 'participantCPF',
                  type: 'text',
                  label: 'CPF',
                  required: true,
                  maxLength: 14,
                  admin: {
                    placeholder: '000.000.000-00',
                    width: '25%',
                  },
                },
                {
                  name: 'participantOAB',
                  type: 'text',
                  label: 'OAB',
                  maxLength: 20,
                  admin: {
                    placeholder: 'Ex: SC12345',
                    width: '25%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'participantEmail',
                  type: 'email',
                  label: 'E-mail',
                  required: true,
                  admin: {
                    placeholder: 'email@exemplo.com',
                    width: '50%',
                  },
                },
                {
                  name: 'participantPhone',
                  type: 'text',
                  label: 'Telefone',
                  maxLength: 20,
                  admin: {
                    placeholder: '(00) 00000-0000',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ticketType',
                  type: 'relationship',
                  label: 'Categoria',
                  relationTo: 'participant-categories',
                  required: true,
                  admin: {
                    width: '40%',
                  },
                },
                {
                  name: 'unitPrice',
                  type: 'number',
                  label: 'Valor Unitário (R$)',
                  admin: {
                    readOnly: true,
                    width: '20%',
                  },
                },
                {
                  name: 'ticketStatus',
                  type: 'select',
                  label: 'Status do Ingresso',
                  defaultValue: 'active',
                  options: [
                    { label: 'Ativo', value: 'active' },
                    { label: 'Check-in Realizado', value: 'checked-in' },
                    { label: 'Presente', value: 'attended' },
                    { label: 'Ausente', value: 'absent' },
                    { label: 'Transferido', value: 'transferred' },
                    { label: 'Cancelado', value: 'cancelled' },
                  ],
                  admin: {
                    width: '40%',
                  },
                },
              ],
            },
            // Campos gerados automaticamente para eventos externos
            {
              name: 'token',
              type: 'text',
              label: 'Token de Check-in',
              admin: {
                readOnly: true,
                description: 'Token único para validação do ingresso',
              },
            },
            {
              name: 'qrCode',
              type: 'textarea',
              label: 'QR Code (Base64)',
              admin: {
                readOnly: true,
                description: 'QR Code do ingresso para check-in',
                rows: 2,
              },
            },
            {
              name: 'checkinAt',
              type: 'date',
              label: 'Check-in Realizado Em',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy HH:mm',
                  pickerAppearance: 'dayAndTime',
                },
                readOnly: true,
              },
            },
            {
              name: 'checkinBy',
              type: 'relationship',
              label: 'Check-in Por',
              relationTo: 'users',
              admin: {
                readOnly: true,
                description: 'Funcionário que realizou o check-in',
              },
            },
          ],
        },
      ],
    },
    // =====================================================
    // SELEÇÃO DE SALAS (para eventos com múltiplas salas)
    // =====================================================
    {
      type: 'group',
      label: 'Seleção de Salas',
      admin: {
        description: 'Salas selecionadas para eventos com programação paralela',
        condition: (data) => {
          // Esta condição seria verificada dinamicamente com o evento
          return data?.roomSelections && data.roomSelections.length > 0
        },
      },
      fields: [
        {
          name: 'roomSelections',
          type: 'array',
          label: 'Atividades Selecionadas',
          admin: {
            description: 'Salas e horários escolhidos pelo participante',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'roomId',
                  type: 'text',
                  label: 'ID da Sala',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'roomName',
                  type: 'text',
                  label: 'Nome da Sala',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'date',
                  type: 'date',
                  label: 'Data',
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
                  label: 'Horário',
                  maxLength: 5,
                  admin: {
                    width: '12.5%',
                  },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  label: 'Término',
                  maxLength: 5,
                  admin: {
                    width: '12.5%',
                  },
                },
              ],
            },
            {
              name: 'activityTitle',
              type: 'text',
              label: 'Atividade',
              maxLength: 200,
            },
          ],
        },
      ],
    },
    // =====================================================
    // VALORES E PAGAMENTO
    // =====================================================
    {
      type: 'group',
      label: 'Valores',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'subtotal',
              type: 'number',
              label: 'Subtotal (R$)',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
            {
              name: 'discountPercent',
              type: 'number',
              label: 'Desconto (%)',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
            {
              name: 'discountAmount',
              type: 'number',
              label: 'Valor do Desconto (R$)',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
            {
              name: 'totalPrice',
              type: 'number',
              label: 'Total (R$)',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
          ],
        },
        {
          name: 'groupDiscountApplied',
          type: 'checkbox',
          label: 'Desconto em Grupo Aplicado',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: 'group',
      label: 'Pagamento',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'paymentStatus',
              type: 'select',
              label: 'Status do Pagamento',
              defaultValue: 'pending',
              required: true,
              options: [
                { label: 'Pendente', value: 'pending' },
                { label: 'Processando', value: 'processing' },
                { label: 'Pago', value: 'paid' },
                { label: 'Falhou', value: 'failed' },
                { label: 'Reembolsado', value: 'refunded' },
                { label: 'Cancelado', value: 'cancelled' },
                { label: 'Cortesia', value: 'complimentary' },
              ],
              admin: {
                width: '33%',
              },
            },
            {
              name: 'paymentMethod',
              type: 'select',
              label: 'Forma de Pagamento',
              options: [
                { label: 'Boleto', value: 'boleto' },
                { label: 'Cartão de Crédito', value: 'credit-card' },
                { label: 'Cartão de Débito', value: 'debit-card' },
                { label: 'PIX', value: 'pix' },
                { label: 'Transferência', value: 'transfer' },
                { label: 'Cortesia', value: 'complimentary' },
              ],
              admin: {
                width: '33%',
              },
            },
            {
              name: 'paymentDate',
              type: 'date',
              label: 'Data do Pagamento',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy HH:mm',
                  pickerAppearance: 'dayAndTime',
                },
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'paymentReference',
          type: 'text',
          label: 'Referência do Pagamento',
          maxLength: 100,
          admin: {
            placeholder: 'ID da transação, código do boleto, etc.',
          },
        },
        {
          name: 'payment',
          type: 'relationship',
          label: 'Pagamento (PagBank)',
          relationTo: 'payments',
          admin: {
            description: 'Registro de pagamento vinculado (preenchido automaticamente)',
            readOnly: true,
          },
        },
      ],
    },
    // =====================================================
    // OBSERVAÇÕES
    // =====================================================
    textareaField({
      name: 'notes',
      label: 'Observações',
      placeholder: 'Observações sobre esta inscrição...',
      maxLength: 1000,
    }),
    textareaField({
      name: 'adminNotes',
      label: 'Observações Internas',
      placeholder: 'Notas visíveis apenas para administradores...',
      maxLength: 1000,
    }),
    // =====================================================
    // SIDEBAR
    // =====================================================
    {
      name: 'status',
      type: 'select',
      label: 'Status da Inscrição',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Confirmada', value: 'confirmed' },
        { label: 'Check-in Parcial', value: 'partial-checkin' },
        { label: 'Check-in Completo', value: 'checked-in' },
        { label: 'Presente', value: 'attended' },
        { label: 'Ausente', value: 'absent' },
        { label: 'Cancelada', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'registrationDate',
      type: 'date',
      label: 'Data da Inscrição',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
    },
    createdByField,
    editedByField,
  ],
}
