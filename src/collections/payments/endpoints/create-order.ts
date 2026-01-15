import type { Endpoint } from 'payload'

const PAGBANK_API_URL = process.env.PAGBANK_API_URL || 'https://sandbox.api.pagseguro.com'
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || ''

interface PagBankCustomer {
  name: string
  email: string
  tax_id: string
  phones?: Array<{
    country: string
    area: string
    number: string
    type: 'MOBILE' | 'BUSINESS' | 'HOME'
  }>
}

interface PagBankItem {
  reference_id?: string
  name: string
  quantity: number
  unit_amount: number
}

interface PagBankQRCode {
  amount: {
    value: number
  }
  expiration_date?: string
}

interface PagBankCharge {
  reference_id?: string
  description?: string
  amount: {
    value: number
    currency: string
  }
  payment_method?: {
    type: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD'
    installments?: number
    capture?: boolean
    boleto?: {
      due_date: string
      instruction_lines?: {
        line_1?: string
        line_2?: string
      }
      holder?: {
        name: string
        tax_id: string
        email: string
        address: {
          street: string
          number: string
          locality: string
          city: string
          region: string
          region_code: string
          country: string
          postal_code: string
        }
      }
    }
  }
  notification_urls?: string[]
}

interface CreateOrderRequest {
  reference_id: string
  customer: PagBankCustomer
  items?: PagBankItem[]
  qr_codes?: PagBankQRCode[]
  charges?: PagBankCharge[]
  notification_urls?: string[]
  registrationId?: string
  lawyerId?: string
}

/**
 * Endpoint: Criar Pedido no PagBank
 *
 * Cria um novo pedido na API do PagBank e salva os dados localmente.
 *
 * POST /api/payments/create-order
 */
export const createOrderEndpoint: Endpoint = {
  path: '/create-order',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body: CreateOrderRequest = req.json ? await req.json() : {}
      const {
        reference_id,
        customer,
        items,
        qr_codes,
        charges,
        notification_urls,
        registrationId,
        lawyerId,
      } = body

      // Validações
      if (!reference_id) {
        return Response.json(
          { success: false, error: 'reference_id é obrigatório' },
          { status: 400 }
        )
      }

      if (!customer || !customer.name || !customer.email || !customer.tax_id) {
        return Response.json(
          { success: false, error: 'Dados do cliente (name, email, tax_id) são obrigatórios' },
          { status: 400 }
        )
      }

      if (!PAGBANK_TOKEN) {
        return Response.json(
          { success: false, error: 'Token do PagBank não configurado' },
          { status: 500 }
        )
      }

      // Verifica se já existe um pedido com este reference_id
      const existingPayment = await payload.find({
        collection: 'payments',
        where: {
          referenceId: { equals: reference_id },
        },
        limit: 1,
      })

      if (existingPayment.docs.length > 0) {
        return Response.json(
          { success: false, error: 'Já existe um pedido com este reference_id' },
          { status: 400 }
        )
      }

      // Monta o body para a API do PagBank
      const pagbankBody: Record<string, any> = {
        reference_id,
        customer,
      }

      if (items && items.length > 0) {
        pagbankBody.items = items
      }

      if (qr_codes && qr_codes.length > 0) {
        pagbankBody.qr_codes = qr_codes
      }

      if (charges && charges.length > 0) {
        pagbankBody.charges = charges
      }

      if (notification_urls && notification_urls.length > 0) {
        pagbankBody.notification_urls = notification_urls
      }

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
        console.error('Erro PagBank:', pagbankData)
        return Response.json(
          {
            success: false,
            error: 'Erro ao criar pedido no PagBank',
            details: pagbankData,
          },
          { status: pagbankResponse.status }
        )
      }

      // Calcula o valor total
      let totalAmount = 0
      if (items && items.length > 0) {
        totalAmount = items.reduce((sum, item) => sum + item.unit_amount * item.quantity, 0)
      } else if (charges && charges.length > 0) {
        totalAmount = charges.reduce((sum, charge) => sum + charge.amount.value, 0)
      } else if (qr_codes && qr_codes.length > 0) {
        totalAmount = qr_codes.reduce((sum, qr) => sum + qr.amount.value, 0)
      }

      // Determina o método de pagamento
      let paymentMethod: string | undefined
      if (qr_codes && qr_codes.length > 0) {
        paymentMethod = 'pix'
      } else if (charges && charges.length > 0 && charges[0].payment_method) {
        const methodType = charges[0].payment_method.type
        paymentMethod = methodType.toLowerCase().replace('_', '_')
      }

      // Extrai dados do QR Code PIX se disponível
      let qrCodeUrl: string | undefined
      let qrCodeText: string | undefined
      let qrCodeExpirationDate: string | undefined

      if (pagbankData.qr_codes && pagbankData.qr_codes.length > 0) {
        const qrCode = pagbankData.qr_codes[0]
        if (qrCode.links) {
          const pngLink = qrCode.links.find((link: any) => link.media === 'image/png')
          if (pngLink) {
            qrCodeUrl = pngLink.href
          }
        }
        qrCodeText = qrCode.text
        qrCodeExpirationDate = qrCode.expiration_date
      }

      // Extrai dados do boleto se disponível
      let boletoUrl: string | undefined
      let boletoBarcode: string | undefined
      let boletoDueDate: string | undefined
      let chargeId: string | undefined

      if (pagbankData.charges && pagbankData.charges.length > 0) {
        const charge = pagbankData.charges[0]
        chargeId = charge.id
        if (charge.payment_method?.boleto) {
          boletoBarcode = charge.payment_method.boleto.barcode
          boletoDueDate = charge.payment_method.boleto.due_date
          if (charge.links) {
            const pdfLink = charge.links.find((link: any) => link.media === 'application/pdf')
            if (pdfLink) {
              boletoUrl = pdfLink.href
            }
          }
        }
      }

      // Mapeia os itens para o formato da collection
      const mappedItems = items?.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitAmount: item.unit_amount,
        referenceId: item.reference_id || '',
      }))

      // Salva o pagamento no banco
      const payment = await payload.create({
        collection: 'payments',
        data: {
          referenceId: reference_id,
          pagbankOrderId: pagbankData.id,
          status: 'waiting_payment',
          paymentMethod,
          totalAmount,
          customerName: customer.name,
          customerEmail: customer.email,
          customerTaxId: customer.tax_id,
          customerPhone:
            customer.phones && customer.phones.length > 0
              ? `${customer.phones[0].area}${customer.phones[0].number}`
              : undefined,
          items: mappedItems,
          pagbankResponse: pagbankData,
          chargeId,
          qrCodeUrl,
          qrCodeText,
          qrCodeExpirationDate,
          boletoUrl,
          boletoBarcode,
          boletoDueDate,
          registration: registrationId || undefined,
          lawyer: lawyerId || undefined,
        },
      })

      return Response.json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: {
          paymentId: payment.id,
          referenceId: payment.referenceId,
          pagbankOrderId: payment.pagbankOrderId,
          status: payment.status,
          totalAmount: payment.totalAmount,
          qrCodeUrl,
          qrCodeText,
          qrCodeExpirationDate,
          boletoUrl,
          boletoBarcode,
          boletoDueDate,
          pagbankResponse: pagbankData,
        },
      })
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erro interno do servidor',
        },
        { status: 500 }
      )
    }
  },
}
