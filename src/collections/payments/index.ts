import type { CollectionConfig } from 'payload'

import { createdByField } from '@/fields/created-by'
import { editedByField } from '@/fields/edited-by'
import { trimHook } from '@/hooks/trim'
import { webhookEndpoint } from './endpoints'
import {
  createPagBankOrderHook,
  syncPagBankStatusHook,
  updateRegistrationOnPaymentHook,
} from './hooks'

/**
 * Collection: Payments (PagBank)
 *
 * Gerencia os pedidos/pagamentos processados via PagBank.
 * Armazena informações de pedidos, clientes, itens e status de pagamento.
 *
 * Hooks:
 * - beforeChange: Cria o pedido no PagBank automaticamente ao salvar
 * - afterChange: Atualiza a inscrição relacionada quando o status muda
 * - afterRead: Sincroniza o status com o PagBank (opcional, para pagamentos pendentes)
 *
 * Endpoint:
 * - POST /api/payments/webhook: Recebe notificações do PagBank
 */
export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Pagamento',
    plural: 'Pagamentos',
  },
  admin: {
    useAsTitle: 'referenceId',
    group: 'Financeiro',
    defaultColumns: ['referenceId', 'pagbankOrderId', 'customerName', 'status', 'totalAmount', 'createdAt'],
    description: 'Pagamentos processados via PagBank',
  },
  hooks: {
    beforeChange: [createPagBankOrderHook],
    afterChange: [updateRegistrationOnPaymentHook],
    // Descomente a linha abaixo para habilitar sincronização automática ao ler
    // afterRead: [syncPagBankStatusHook],
  },
  endpoints: [webhookEndpoint],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Pedido',
          fields: [
            {
              type: 'group',
              label: 'Identificação',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'referenceId',
                      type: 'text',
                      label: 'ID de Referência',
                      required: true,
                      unique: true,
                      admin: {
                        placeholder: 'Identificador único do pedido',
                        width: '50%',
                        description: 'ID interno para referência do pedido',
                      },
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'pagbankOrderId',
                      type: 'text',
                      label: 'ID PagBank',
                      admin: {
                        placeholder: 'ORDE_XXXXXXXXXXXX',
                        width: '50%',
                        description: 'ID do pedido retornado pelo PagBank (preenchido automaticamente)',
                        readOnly: true,
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'status',
                      type: 'select',
                      label: 'Status',
                      defaultValue: 'pending',
                      required: true,
                      options: [
                        { label: 'Pendente', value: 'pending' },
                        { label: 'Aguardando Pagamento', value: 'waiting_payment' },
                        { label: 'Em Análise', value: 'in_analysis' },
                        { label: 'Autorizado', value: 'authorized' },
                        { label: 'Pago', value: 'paid' },
                        { label: 'Disponível', value: 'available' },
                        { label: 'Em Disputa', value: 'in_dispute' },
                        { label: 'Devolvido', value: 'refunded' },
                        { label: 'Cancelado', value: 'canceled' },
                        { label: 'Negado', value: 'declined' },
                      ],
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'paymentMethod',
                      type: 'select',
                      label: 'Método de Pagamento',
                      options: [
                        { label: 'Cartão de Crédito', value: 'credit_card' },
                        { label: 'Cartão de Débito', value: 'debit_card' },
                        { label: 'Boleto', value: 'boleto' },
                        { label: 'PIX', value: 'pix' },
                        { label: 'QR Code PagBank', value: 'qr_code' },
                      ],
                      admin: {
                        width: '33%',
                        description: 'Selecione PIX ou Boleto para gerar automaticamente',
                      },
                    },
                    {
                      name: 'paymentDate',
                      type: 'date',
                      label: 'Data do Pagamento',
                      admin: {
                        width: '34%',
                        date: {
                          displayFormat: 'dd/MM/yyyy HH:mm',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Valores',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'totalAmount',
                      type: 'number',
                      label: 'Valor Total (centavos)',
                      required: true,
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Valor em centavos (ex: 1000 = R$ 10,00)',
                      },
                    },
                    {
                      name: 'paidAmount',
                      type: 'number',
                      label: 'Valor Pago (centavos)',
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Valor efetivamente pago',
                        readOnly: true,
                      },
                    },
                    {
                      name: 'refundedAmount',
                      type: 'number',
                      label: 'Valor Devolvido (centavos)',
                      min: 0,
                      admin: {
                        width: '34%',
                        description: 'Valor devolvido ao cliente',
                        readOnly: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              label: 'Relacionamentos',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'registration',
                      type: 'relationship',
                      label: 'Inscrição',
                      relationTo: 'registrations',
                      admin: {
                        width: '50%',
                        description: 'Inscrição de evento relacionada a este pagamento',
                      },
                    },
                    {
                      name: 'lawyer',
                      type: 'relationship',
                      label: 'Advogado',
                      relationTo: 'lawyers',
                      admin: {
                        width: '50%',
                        description: 'Advogado que realizou o pagamento',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Cliente',
          fields: [
            {
              type: 'group',
              label: 'Dados do Cliente',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customerName',
                      type: 'text',
                      label: 'Nome',
                      required: true,
                      admin: {
                        placeholder: 'Nome completo do cliente',
                        width: '50%',
                      },
                      maxLength: 128,
                      hooks: {
                        beforeChange: [trimHook],
                      },
                    },
                    {
                      name: 'customerEmail',
                      type: 'email',
                      label: 'Email',
                      required: true,
                      admin: {
                        placeholder: 'Email do cliente',
                        width: '50%',
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
                      name: 'customerTaxId',
                      type: 'text',
                      label: 'CPF/CNPJ',
                      required: true,
                      admin: {
                        placeholder: 'Documento do cliente',
                        width: '50%',
                      },
                      maxLength: 14,
                    },
                    {
                      name: 'customerPhone',
                      type: 'text',
                      label: 'Telefone',
                      admin: {
                        placeholder: 'Telefone do cliente',
                        width: '50%',
                      },
                      maxLength: 20,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Itens',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Itens do Pedido',
              labels: {
                singular: 'Item',
                plural: 'Itens',
              },
              admin: {
                description: 'Lista de itens incluídos no pedido',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Nome',
                      required: true,
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      label: 'Quantidade',
                      required: true,
                      min: 1,
                      defaultValue: 1,
                      admin: {
                        width: '20%',
                      },
                    },
                    {
                      name: 'unitAmount',
                      type: 'number',
                      label: 'Valor Unitário (centavos)',
                      required: true,
                      min: 0,
                      admin: {
                        width: '40%',
                      },
                    },
                  ],
                },
                {
                  name: 'referenceId',
                  type: 'text',
                  label: 'ID de Referência do Item',
                  admin: {
                    description: 'Identificador único do item (opcional)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Dados PagBank',
          fields: [
            {
              type: 'group',
              label: 'Resposta da API',
              fields: [
                {
                  name: 'pagbankResponse',
                  type: 'json',
                  label: 'Resposta Completa',
                  admin: {
                    description: 'Resposta completa retornada pelo PagBank na criação do pedido',
                    readOnly: true,
                  },
                },
                {
                  name: 'chargeId',
                  type: 'text',
                  label: 'ID da Cobrança',
                  admin: {
                    placeholder: 'CHAR_XXXXXXXXXXXX',
                    description: 'ID da cobrança (charge) no PagBank',
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Dados de Pagamento',
              fields: [
                {
                  name: 'qrCodeUrl',
                  type: 'text',
                  label: 'URL do QR Code',
                  admin: {
                    description: 'URL da imagem do QR Code para pagamento PIX',
                    readOnly: true,
                  },
                },
                {
                  name: 'qrCodeText',
                  type: 'textarea',
                  label: 'Código PIX (Copia e Cola)',
                  admin: {
                    description: 'Código PIX para copiar e colar',
                    readOnly: true,
                  },
                },
                {
                  name: 'qrCodeExpirationDate',
                  type: 'date',
                  label: 'Validade do QR Code',
                  admin: {
                    description: 'Data de expiração do QR Code PIX',
                    readOnly: true,
                    date: {
                      displayFormat: 'dd/MM/yyyy HH:mm',
                    },
                  },
                },
                {
                  name: 'boletoUrl',
                  type: 'text',
                  label: 'URL do Boleto',
                  admin: {
                    description: 'URL do PDF do boleto',
                    readOnly: true,
                  },
                },
                {
                  name: 'boletoBarcode',
                  type: 'text',
                  label: 'Código de Barras',
                  admin: {
                    description: 'Linha digitável do boleto',
                    readOnly: true,
                  },
                },
                {
                  name: 'boletoDueDate',
                  type: 'date',
                  label: 'Vencimento do Boleto',
                  admin: {
                    description: 'Data de vencimento do boleto',
                    readOnly: true,
                    date: {
                      displayFormat: 'dd/MM/yyyy',
                    },
                  },
                },
                {
                  name: 'checkoutUrl',
                  type: 'text',
                  label: 'URL do Checkout',
                  admin: {
                    description: 'URL para redirecionar o cliente ao checkout do PagBank',
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Notificações',
              fields: [
                {
                  name: 'webhookHistory',
                  type: 'array',
                  label: 'Histórico de Webhooks',
                  labels: {
                    singular: 'Notificação',
                    plural: 'Notificações',
                  },
                  admin: {
                    description: 'Histórico de notificações recebidas do PagBank',
                    readOnly: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'receivedAt',
                          type: 'date',
                          label: 'Recebido em',
                          admin: {
                            width: '30%',
                            date: {
                              displayFormat: 'dd/MM/yyyy HH:mm:ss',
                            },
                          },
                        },
                        {
                          name: 'notificationType',
                          type: 'text',
                          label: 'Tipo',
                          admin: {
                            width: '30%',
                          },
                        },
                        {
                          name: 'previousStatus',
                          type: 'text',
                          label: 'Status Anterior',
                          admin: {
                            width: '20%',
                          },
                        },
                        {
                          name: 'newStatus',
                          type: 'text',
                          label: 'Novo Status',
                          admin: {
                            width: '20%',
                          },
                        },
                      ],
                    },
                    {
                      name: 'payload',
                      type: 'json',
                      label: 'Dados da Notificação',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Observações',
          fields: [
            {
              name: 'notes',
              type: 'textarea',
              label: 'Observações Internas',
              admin: {
                placeholder: 'Observações sobre este pagamento...',
                description: 'Anotações internas sobre o pagamento (não visíveis para o cliente)',
              },
            },
          ],
        },
      ],
    },
    createdByField,
    editedByField,
  ],
}
