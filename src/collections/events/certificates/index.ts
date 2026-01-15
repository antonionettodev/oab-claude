import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { anyone } from '@/access/anyone'

import { validateCertificateEligibilityHook } from './hooks/validateCertificateEligibilityHook'
import {
  generateCertificateNumberHook,
  generateCertificateHashHook,
} from './hooks/generateCertificateNumberHook'
import { generateCertificatePDFHook } from './hooks/generateCertificatePDFHook'

/**
 * Collection: Certificados
 *
 * Gerencia os certificados emitidos para participantes de eventos.
 *
 * Requisitos para emissão:
 * - Inscrição válida (não cancelada)
 * - Pagamento confirmado
 * - Presença registrada
 * - Evento deve emitir certificado
 *
 * Funcionalidades:
 * - Geração automática de número único
 * - Hash de validação para verificação de autenticidade
 * - QR Code para validação online
 * - Suporte a segunda via (configurável por evento)
 * - Templates de certificado por evento
 */
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: {
    singular: 'Certificado',
    plural: 'Certificados',
  },
  admin: {
    useAsTitle: 'certificateNumber',
    group: 'Eventos',
    defaultColumns: ['certificateNumber', 'participantName', 'eventTitle', 'status', 'issuedAt'],
    description: 'Certificados de participação em eventos',
  },
  access: {
    read: anyone,
  },
  hooks: {
    beforeChange: [validateCertificateEligibilityHook],
    afterChange: [generateCertificatePDFHook],
  },
  fields: [
    // =====================================================
    // IDENTIFICAÇÃO DO CERTIFICADO
    // =====================================================
    {
      type: 'row',
      fields: [
        {
          name: 'certificateNumber',
          type: 'text',
          label: 'Número do Certificado',
          unique: true,
          admin: {
            readOnly: true,
            width: '50%',
          },
          hooks: {
            beforeChange: [generateCertificateNumberHook],
          },
        },
        {
          name: 'validationHash',
          type: 'text',
          label: 'Hash de Validação',
          admin: {
            readOnly: true,
            description: 'Código para verificação de autenticidade',
            width: '50%',
          },
          hooks: {
            beforeChange: [generateCertificateHashHook],
          },
        },
      ],
    },
    // =====================================================
    // RELAÇÕES
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
      name: 'ticketIndex',
      type: 'number',
      label: 'Índice do Ingresso',
      defaultValue: 0,
      admin: {
        description: 'Índice do participante na inscrição (0 para o primeiro)',
      },
    },
    // =====================================================
    // DADOS DO PARTICIPANTE
    // =====================================================
    {
      type: 'group',
      label: 'Dados do Participante',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'participantName',
              type: 'text',
              label: 'Nome Completo',
              admin: {
                readOnly: true,
                width: '50%',
              },
            },
            {
              name: 'participantCPF',
              type: 'text',
              label: 'CPF',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
            {
              name: 'participantEmail',
              type: 'email',
              label: 'E-mail',
              admin: {
                readOnly: true,
                width: '25%',
              },
            },
          ],
        },
      ],
    },
    // =====================================================
    // DADOS DO EVENTO
    // =====================================================
    {
      type: 'group',
      label: 'Dados do Evento',
      fields: [
        {
          name: 'eventTitle',
          type: 'text',
          label: 'Título do Evento',
          admin: {
            readOnly: true,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventStartDate',
              type: 'date',
              label: 'Data de Início',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy',
                  pickerAppearance: 'dayOnly',
                },
                readOnly: true,
                width: '33%',
              },
            },
            {
              name: 'eventEndDate',
              type: 'date',
              label: 'Data de Término',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy',
                  pickerAppearance: 'dayOnly',
                },
                readOnly: true,
                width: '33%',
              },
            },
            {
              name: 'workload',
              type: 'number',
              label: 'Carga Horária',
              admin: {
                readOnly: true,
                width: '34%',
              },
            },
          ],
        },
      ],
    },
    // =====================================================
    // DADOS DO CERTIFICADO
    // =====================================================
    {
      type: 'group',
      label: 'Certificado',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'issuedAt',
              type: 'date',
              label: 'Emitido Em',
              admin: {
                date: {
                  displayFormat: 'dd/MM/yyyy HH:mm',
                  pickerAppearance: 'dayAndTime',
                },
                readOnly: true,
                width: '33%',
              },
              defaultValue: () => new Date().toISOString(),
            },
            {
              name: 'isDuplicate',
              type: 'checkbox',
              label: 'Segunda Via',
              defaultValue: false,
              admin: {
                readOnly: true,
                width: '33%',
              },
            },
            {
              name: 'downloadCount',
              type: 'number',
              label: 'Downloads',
              defaultValue: 0,
              admin: {
                readOnly: true,
                description: 'Número de vezes que o certificado foi baixado',
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'originalCertificateId',
          type: 'relationship',
          label: 'Certificado Original',
          relationTo: 'certificates',
          admin: {
            readOnly: true,
            description: 'Referência ao certificado original (para segunda via)',
            condition: (data, siblingData) => siblingData?.isDuplicate,
          },
        },
      ],
    },
    // =====================================================
    // VALIDAÇÃO E QR CODE
    // =====================================================
    {
      type: 'group',
      label: 'Validação',
      fields: [
        {
          name: 'validationQRCode',
          type: 'textarea',
          label: 'QR Code de Validação (Base64)',
          admin: {
            readOnly: true,
            description: 'QR Code para validação online do certificado',
            rows: 2,
          },
        },
        {
          name: 'certificateData',
          type: 'textarea',
          label: 'Dados do Certificado (JSON)',
          admin: {
            readOnly: true,
            description: 'Dados estruturados para geração do PDF',
            rows: 4,
          },
        },
      ],
    },
    // =====================================================
    // ARQUIVO DO CERTIFICADO
    // =====================================================
    {
      type: 'group',
      label: 'Arquivo',
      fields: [
        {
          name: 'pdfFile',
          type: 'upload',
          label: 'Arquivo PDF',
          relationTo: 'files',
          admin: {
            description: 'Arquivo PDF do certificado gerado',
          },
        },
        {
          name: 'lastDownloadAt',
          type: 'date',
          label: 'Último Download',
          admin: {
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
              pickerAppearance: 'dayAndTime',
            },
            readOnly: true,
          },
        },
      ],
    },
    // =====================================================
    // SIDEBAR
    // =====================================================
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Gerado', value: 'generated' },
        { label: 'Enviado', value: 'sent' },
        { label: 'Erro', value: 'error' },
        { label: 'Revogado', value: 'revoked' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'errorMessage',
      type: 'text',
      label: 'Mensagem de Erro',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.status === 'error',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Enviado Em',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        condition: (data) => data?.status === 'sent',
      },
    },
    {
      name: 'revokedAt',
      type: 'date',
      label: 'Revogado Em',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        condition: (data) => data?.status === 'revoked',
      },
    },
    {
      name: 'revokedReason',
      type: 'text',
      label: 'Motivo da Revogação',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'revoked',
      },
    },
    createdByField,
  ],
}
