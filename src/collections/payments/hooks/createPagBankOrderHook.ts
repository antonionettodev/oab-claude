import type { CollectionBeforeChangeHook } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL?.startsWith('http')
  ? process.env.PAGBANK_API_URL
  : `https://${process.env.PAGBANK_API_URL || 'sandbox.api.pagseguro.com'}`
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

type PaymentMethod = 'credit_card' | 'debit_card' | 'boleto' | 'pix' | 'qr_code'

/**
 * Hook: Criar Pedido no PagBank
 *
 * Quando um novo pagamento é criado, este hook envia o pedido para a API do PagBank
 * e atualiza o registro com os dados retornados (pagbankOrderId, QR Code, boleto, etc.)
 */
export const createPagBankOrderHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  // Só executa na criação de novos pagamentos
  if (operation !== 'create') {
    return data
  }

  // Se já tem um pagbankOrderId, não cria novamente
  if (data.pagbankOrderId) {
    return data
  }

  // Validações básicas
  if (!data.referenceId || !data.customerName || !data.customerEmail || !data.customerTaxId) {
    return data
  }

  if (!PAGBANK_TOKEN) {
    console.error('Token do PagBank não configurado')
    return data
  }

  try {
    // Monta o customer para o PagBank
    const customer: Record<string, unknown> = {
      name: data.customerName,
      email: data.customerEmail,
      tax_id: data.customerTaxId.replace(/\D/g, ''), // Remove caracteres não numéricos
    }

    if (data.customerPhone) {
      const phoneClean = data.customerPhone.replace(/\D/g, '')
      if (phoneClean.length >= 10) {
        customer.phones = [
          {
            country: '55',
            area: phoneClean.substring(0, 2),
            number: phoneClean.substring(2),
            type: 'MOBILE',
          },
        ]
      }
    }

    // Monta o body para a API do PagBank
    const pagbankBody: Record<string, unknown> = {
      reference_id: data.referenceId,
      customer,
    }

    // Adiciona itens se existirem
    if (data.items && data.items.length > 0) {
      pagbankBody.items = data.items.map((item: { name: string; quantity: number; unitAmount: number; referenceId?: string }) => ({
        reference_id: item.referenceId || item.name.substring(0, 64),
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.unitAmount,
      }))
    }

    // Se o método de pagamento é PIX, adiciona qr_codes
    if (data.paymentMethod === 'pix' || data.paymentMethod === 'qr_code') {
      const expirationDate = new Date()
      expirationDate.setHours(expirationDate.getHours() + 24) // Expira em 24 horas

      pagbankBody.qr_codes = [
        {
          amount: {
            value: data.totalAmount || 0,
          },
          expiration_date: expirationDate.toISOString(),
        },
      ]
    }

    // Se o método de pagamento é boleto, adiciona charges
    if (data.paymentMethod === 'boleto') {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 3) // Vencimento em 3 dias

      pagbankBody.charges = [
        {
          reference_id: data.referenceId,
          description: `Pagamento ${data.referenceId}`,
          amount: {
            value: data.totalAmount || 0,
            currency: 'BRL',
          },
          payment_method: {
            type: 'BOLETO',
            boleto: {
              due_date: dueDate.toISOString().split('T')[0],
              holder: {
                name: data.customerName,
                tax_id: data.customerTaxId.replace(/\D/g, ''),
                email: data.customerEmail,
              },
            },
          },
        },
      ]
    }

    // Adiciona URL de notificação se configurada
    const notificationUrl = process.env.PAGBANK_NOTIFICATION_URL
    if (notificationUrl) {
      pagbankBody.notification_urls = [notificationUrl]
    }

    console.log('Criando pedido no PagBank:', JSON.stringify(pagbankBody, null, 2))

    // Faz a requisição para a API do PagBank
    const pagbankResponse = await fetch(`${PAGBANK_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
      },
      body: JSON.stringify(pagbankBody),
    })

    const pagbankData = await pagbankResponse.json()

    if (!pagbankResponse.ok) {
      console.error('Erro ao criar pedido no PagBank:', pagbankData)
      // Não bloqueia a criação do pagamento, apenas loga o erro
      data.notes = `${data.notes || ''}\n\n[ERRO PagBank] ${JSON.stringify(pagbankData)}`.trim()
      return data
    }

    console.log('Pedido criado no PagBank:', pagbankData.id)

    // Atualiza os dados com a resposta do PagBank
    data.pagbankOrderId = pagbankData.id
    data.pagbankResponse = pagbankData
    data.status = 'waiting_payment'

    // Extrai dados do QR Code PIX se disponível
    if (pagbankData.qr_codes && pagbankData.qr_codes.length > 0) {
      const qrCode = pagbankData.qr_codes[0]
      if (qrCode.links) {
        const pngLink = qrCode.links.find((link: { media: string; href: string }) => link.media === 'image/png')
        if (pngLink) {
          data.qrCodeUrl = pngLink.href
        }
      }
      data.qrCodeText = qrCode.text
      data.qrCodeExpirationDate = qrCode.expiration_date
    }

    // Extrai dados do boleto se disponível
    if (pagbankData.charges && pagbankData.charges.length > 0) {
      const charge = pagbankData.charges[0]
      data.chargeId = charge.id
      if (charge.payment_method?.boleto) {
        data.boletoBarcode = charge.payment_method.boleto.barcode
        data.boletoDueDate = charge.payment_method.boleto.due_date
        if (charge.links) {
          const pdfLink = charge.links.find((link: { media: string; href: string }) => link.media === 'application/pdf')
          if (pdfLink) {
            data.boletoUrl = pdfLink.href
          }
        }
      }
    }

    return data
  } catch (error) {
    console.error('Erro ao criar pedido no PagBank:', error)
    data.notes = `${data.notes || ''}\n\n[ERRO] ${error instanceof Error ? error.message : 'Erro desconhecido'}`.trim()
    return data
  }
}
