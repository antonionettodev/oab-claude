import type { CollectionBeforeChangeHook } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL?.startsWith('http')
  ? process.env.PAGBANK_API_URL
  : `https://${process.env.PAGBANK_API_URL || 'sandbox.api.pagseguro.com'}`
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

/**
 * Hook: Criar Checkout no PagBank
 *
 * Quando um novo pagamento é criado, este hook cria um checkout no PagBank
 * e retorna uma URL para redirecionar o usuário à página de pagamento.
 *
 * Vantagens do Checkout:
 * - Todos os métodos de pagamento em uma página (PIX, Boleto, Cartão)
 * - Ambiente seguro do PagBank
 * - Menos código e manutenção
 */
export const createPagBankOrderHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
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
    // URL de redirecionamento após pagamento
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/pagamento/confirmacao?ref=${data.referenceId}`

    // URL de notificação webhook
    const notificationUrl = process.env.PAGBANK_NOTIFICATION_URL || `${baseUrl}/api/payments/webhook`

    // Monta os itens para o checkout
    const items = (data.items || []).map((item: { name: string; quantity: number; unitAmount: number; referenceId?: string }) => ({
      reference_id: (item.referenceId || item.name).substring(0, 64),
      name: item.name.substring(0, 64),
      quantity: item.quantity,
      unit_amount: item.unitAmount,
    }))

    // Se não tiver itens, cria um item genérico
    if (items.length === 0) {
      items.push({
        reference_id: data.referenceId.substring(0, 64),
        name: `Pagamento ${data.referenceId}`.substring(0, 64),
        quantity: 1,
        unit_amount: data.totalAmount || 0,
      })
    }

    // Monta o customer para o PagBank
    const customer: Record<string, unknown> = {
      name: data.customerName.substring(0, 50),
      email: data.customerEmail,
      tax_id: data.customerTaxId.replace(/\D/g, ''),
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

    // Data de expiração do checkout (24 horas)
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)

    // Monta o body para a API de Checkout do PagBank
    const checkoutBody: Record<string, unknown> = {
      reference_id: data.referenceId,
      customer,
      customer_modifiable: false, // Dados já preenchidos, não permite alteração
      items,
      redirect_url: redirectUrl,
      return_url: redirectUrl,
      notification_urls: [notificationUrl],
      expiration_date: expirationDate.toISOString(),
      // Configurações de pagamento
      payment_methods: [
        { type: 'CREDIT_CARD' },
        { type: 'DEBIT_CARD' },
        { type: 'PIX' },
        { type: 'BOLETO' },
      ],
      // Configuração de parcelas (até 12x, vendedor assume juros até 3x)
      payment_methods_configs: [
        {
          type: 'CREDIT_CARD',
          config_options: [
            { option: 'INSTALLMENTS_LIMIT', value: '12' },
            { option: 'INTEREST_FREE_INSTALLMENTS', value: '3' },
          ],
        },
      ],
      // Configuração de envio (sem envio físico para eventos)
      shipping: {
        type: 'FIXED',
        service_type: 'NONE',
        amount: 0,
      },
    }

    // Se tiver um desconto configurado
    if (data.discountAmount && data.discountAmount > 0) {
      checkoutBody.discount_amount = data.discountAmount
    }

    console.log('Criando checkout no PagBank:', JSON.stringify(checkoutBody, null, 2))

    // Faz a requisição para a API de Checkout do PagBank
    const pagbankResponse = await fetch(`${PAGBANK_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAGBANK_TOKEN}`,
      },
      body: JSON.stringify(checkoutBody),
    })

    const pagbankData = await pagbankResponse.json()

    if (!pagbankResponse.ok) {
      console.error('Erro ao criar checkout no PagBank:', pagbankData)
      // Não bloqueia a criação do pagamento, apenas loga o erro
      data.notes = `${data.notes || ''}\n\n[ERRO PagBank] ${JSON.stringify(pagbankData)}`.trim()
      return data
    }

    console.log('Checkout criado no PagBank:', pagbankData.id)

    // Atualiza os dados com a resposta do PagBank
    data.pagbankOrderId = pagbankData.id
    data.pagbankResponse = pagbankData
    data.status = 'waiting_payment'

    // Extrai a URL de pagamento do checkout
    if (pagbankData.links && pagbankData.links.length > 0) {
      const payLink = pagbankData.links.find((link: { rel: string; href: string }) => link.rel === 'PAY')
      if (payLink) {
        data.checkoutUrl = payLink.href
      }
    }

    return data
  } catch (error) {
    console.error('Erro ao criar checkout no PagBank:', error)
    data.notes = `${data.notes || ''}\n\n[ERRO] ${error instanceof Error ? error.message : 'Erro desconhecido'}`.trim()
    return data
  }
}
