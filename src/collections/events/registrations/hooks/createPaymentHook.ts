import type { CollectionAfterChangeHook } from 'payload'

/**
 * Hook para criar pagamento no PagBank após criação de inscrição
 *
 * Quando uma inscrição é criada com valor > 0 e método de pagamento selecionado,
 * automaticamente cria um registro na collection payments que dispara a criação
 * do pedido no PagBank.
 *
 * Fluxo:
 * 1. Inscrição criada com totalPrice > 0
 * 2. Este hook cria um registro em payments
 * 3. O hook createPagBankOrderHook (da collection payments) cria o pedido no PagBank
 * 4. Os dados do PIX/Boleto são salvos no registro de payment
 * 5. O webhook do PagBank atualiza o status quando pago
 */
export const createPaymentHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  // Só processa criação ou quando o método de pagamento é definido pela primeira vez
  if (operation === 'create' || (operation === 'update' && !previousDoc?.paymentReference && doc.paymentMethod)) {
    // Verifica se precisa criar pagamento
    const needsPayment =
      doc.totalPrice > 0 &&
      doc.paymentStatus === 'pending' &&
      doc.paymentMethod &&
      ['pix', 'boleto', 'credit-card'].includes(doc.paymentMethod) &&
      !doc.paymentReference // Evita duplicar se já existe referência

    if (!needsPayment) {
      return doc
    }

    try {
      // Busca o evento para pegar o título
      const eventId = typeof doc.event === 'object' ? doc.event.id : doc.event
      const event = await req.payload.findByID({
        collection: 'events',
        id: eventId,
        depth: 0,
      })

      if (!event) {
        console.error('Evento não encontrado para criar pagamento')
        return doc
      }

      // Monta os itens do pagamento baseado nos ingressos
      const items = (doc.tickets || []).map((ticket: Record<string, unknown>, index: number) => ({
        name: `${event.title} - ${ticket.participantName || `Ingresso ${index + 1}`}`,
        quantity: 1,
        unitAmount: Math.round((ticket.unitPrice as number || doc.totalPrice / (doc.tickets?.length || 1)) * 100), // Converte para centavos
        referenceId: `${doc.registrationCode}-${index}`,
      }))

      // Se não tiver ingressos detalhados, cria um item genérico
      if (items.length === 0) {
        items.push({
          name: `Inscrição - ${event.title}`,
          quantity: 1,
          unitAmount: Math.round(doc.totalPrice * 100),
          referenceId: doc.registrationCode,
        })
      }

      // Mapeia o método de pagamento para o formato do PagBank
      const paymentMethodMap: Record<string, string> = {
        'pix': 'pix',
        'boleto': 'boleto',
        'credit-card': 'credit_card',
        'debit-card': 'debit_card',
      }

      // Cria o pagamento
      const payment = await req.payload.create({
        collection: 'payments',
        data: {
          referenceId: doc.registrationCode,
          registration: doc.id,
          status: 'pending',
          paymentMethod: paymentMethodMap[doc.paymentMethod] || 'pix',
          totalAmount: Math.round(doc.totalPrice * 100), // Converte para centavos
          customerName: doc.registrantName,
          customerEmail: doc.registrantEmail,
          customerTaxId: doc.registrantCPF?.replace(/\D/g, ''),
          customerPhone: doc.registrantPhone?.replace(/\D/g, ''),
          items,
        },
      })

      // Atualiza a inscrição com a referência do pagamento
      await req.payload.update({
        collection: 'registrations',
        id: doc.id,
        data: {
          paymentReference: payment.referenceId,
          payment: payment.id,
          paymentStatus: 'processing',
        },
      })

      console.log(`Pagamento ${payment.id} criado para inscrição ${doc.registrationCode}`)
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      // Não lança erro para não bloquear a criação da inscrição
    }
  }

  return doc
}
