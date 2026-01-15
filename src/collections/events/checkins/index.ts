import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { anyone } from '@/access/anyone'

import { validateCheckinHook } from './hooks/validateCheckinHook'
import { updateTicketStatusHook } from './hooks/updateTicketStatusHook'

/**
 * Collection: Check-ins
 *
 * Registra todos os check-ins realizados em eventos.
 *
 * Tipos de Check-in:
 * - Manual: Funcionário valida voucher/QR Code do participante (eventos externos)
 * - Automático: Participante escaneia QR Code fixo do evento (eventos internos)
 *
 * Validações:
 * - Inscrição deve estar paga
 * - Evento deve estar em andamento
 * - Check-in deve estar no período permitido
 */
export const Checkins: CollectionConfig = {
  slug: 'checkins',
  labels: {
    singular: 'Check-in',
    plural: 'Check-ins',
  },
  admin: {
    useAsTitle: 'participantName',
    group: 'Eventos',
    defaultColumns: ['participantName', 'event', 'checkinType', 'checkinAt', 'isValid'],
    description: 'Registro de check-ins em eventos',
  },
  access: {
    read: anyone,
  },
  hooks: {
    beforeChange: [validateCheckinHook],
    afterChange: [updateTicketStatusHook],
  },
  fields: [
    // =====================================================
    // DADOS DO CHECK-IN
    // =====================================================
    {
      type: 'row',
      fields: [
        {
          name: 'registration',
          type: 'relationship',
          label: 'Inscrição',
          relationTo: 'registrations',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'event',
          type: 'relationship',
          label: 'Evento',
          relationTo: 'events',
          admin: {
            readOnly: true,
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'participantName',
          type: 'text',
          label: 'Nome do Participante',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'eventTitle',
          type: 'text',
          label: 'Evento',
          admin: {
            readOnly: true,
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'ticketIndex',
      type: 'number',
      label: 'Índice do Ingresso',
      defaultValue: 0,
      admin: {
        description: 'Índice do ingresso na inscrição (0 para o primeiro)',
      },
    },
    // =====================================================
    // TIPO E MÉTODO DE CHECK-IN
    // =====================================================
    {
      type: 'row',
      fields: [
        {
          name: 'checkinType',
          type: 'select',
          label: 'Tipo de Check-in',
          required: true,
          options: [
            { label: 'Manual (Funcionário)', value: 'manual' },
            { label: 'Automático (QR Code do Evento)', value: 'automatic' },
            { label: 'QR Code Individual', value: 'qr-individual' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'checkinMethod',
          type: 'select',
          label: 'Método',
          options: [
            { label: 'QR Code', value: 'qr-code' },
            { label: 'Token/Senha', value: 'token' },
            { label: 'Nome/CPF', value: 'manual-search' },
            { label: 'Lista', value: 'list' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'checkinAt',
          type: 'date',
          label: 'Data/Hora do Check-in',
          required: true,
          admin: {
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm:ss',
              pickerAppearance: 'dayAndTime',
            },
            width: '34%',
          },
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    // =====================================================
    // VALIDAÇÃO
    // =====================================================
    {
      type: 'row',
      fields: [
        {
          name: 'isValid',
          type: 'checkbox',
          label: 'Check-in Válido',
          defaultValue: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'voucherValidated',
          type: 'checkbox',
          label: 'Voucher Validado',
          defaultValue: false,
          admin: {
            description: 'Voucher impresso foi apresentado',
            width: '25%',
          },
        },
        {
          name: 'paymentValidated',
          type: 'checkbox',
          label: 'Pagamento Confirmado',
          defaultValue: false,
          admin: {
            description: 'Pagamento foi verificado no momento do check-in',
            width: '25%',
          },
        },
        {
          name: 'presenceConfirmed',
          type: 'checkbox',
          label: 'Presença Confirmada',
          defaultValue: false,
          admin: {
            description: 'Participante foi marcado como presente',
            width: '25%',
          },
        },
      ],
    },
    // =====================================================
    // DADOS DO QR CODE (quando aplicável)
    // =====================================================
    {
      type: 'group',
      label: 'Dados do QR Code',
      admin: {
        condition: (data) =>
          data?.checkinMethod === 'qr-code' || data?.checkinType === 'qr-individual',
      },
      fields: [
        {
          name: 'qrCodeData',
          type: 'textarea',
          label: 'Dados do QR Code',
          admin: {
            readOnly: true,
            description: 'Dados brutos do QR Code escaneado',
            rows: 2,
          },
        },
        {
          name: 'tokenValidated',
          type: 'checkbox',
          label: 'Token Validado',
          defaultValue: false,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    // =====================================================
    // TICKET GERADO (para eventos externos)
    // =====================================================
    {
      type: 'group',
      label: 'Ticket de Entrada',
      admin: {
        description: 'Ticket gerado após check-in para impressão',
      },
      fields: [
        {
          name: 'ticketGenerated',
          type: 'checkbox',
          label: 'Ticket Gerado',
          defaultValue: false,
        },
        {
          name: 'ticketQRCode',
          type: 'textarea',
          label: 'QR Code do Ticket (Base64)',
          admin: {
            readOnly: true,
            description: 'QR Code para impressão no ticket/etiqueta',
            rows: 2,
            condition: (data, siblingData) => siblingData?.ticketGenerated,
          },
        },
        {
          name: 'ticketPrintedAt',
          type: 'date',
          label: 'Ticket Impresso Em',
          admin: {
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
              pickerAppearance: 'dayAndTime',
            },
            condition: (data, siblingData) => siblingData?.ticketGenerated,
          },
        },
      ],
    },
    // =====================================================
    // SALA (para eventos com múltiplas salas)
    // =====================================================
    {
      type: 'group',
      label: 'Sala',
      admin: {
        description: 'Sala específica do check-in (para eventos com múltiplas salas)',
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
                width: '30%',
              },
            },
            {
              name: 'roomName',
              type: 'text',
              label: 'Nome da Sala',
              admin: {
                width: '40%',
              },
            },
            {
              name: 'sessionTime',
              type: 'text',
              label: 'Horário da Sessão',
              maxLength: 11,
              admin: {
                placeholder: '09:00-10:30',
                width: '30%',
              },
            },
          ],
        },
      ],
    },
    // =====================================================
    // OBSERVAÇÕES
    // =====================================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Observações',
      maxLength: 500,
      admin: {
        placeholder: 'Observações sobre este check-in...',
      },
    },
    // =====================================================
    // LOCALIZAÇÃO (opcional)
    // =====================================================
    {
      type: 'group',
      label: 'Localização',
      admin: {
        description: 'Dados de localização do check-in (opcional)',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              label: 'Latitude',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'longitude',
              type: 'number',
              label: 'Longitude',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'deviceInfo',
          type: 'text',
          label: 'Dispositivo',
          maxLength: 200,
          admin: {
            description: 'Informações do dispositivo usado para check-in',
          },
        },
      ],
    },
    // =====================================================
    // SIDEBAR
    // =====================================================
    {
      name: 'checkinBy',
      type: 'relationship',
      label: 'Realizado Por',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Usuário que realizou/validou o check-in',
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && req.user && !value) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    createdByField,
  ],
}
