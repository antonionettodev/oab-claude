import type { CollectionAfterChangeHook } from 'payload'
import { generateSecureToken } from '@/lib/token'
import { generateQRCodeBase64, generateTicketQRData } from '@/lib/qrcode'

/**
 * Hook para gerar tokens e QR Codes para cada ingresso após criação da inscrição
 * Usado para eventos externos onde cada ingresso tem seu próprio QR Code
 */
export const generateTicketTokensHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create' || !doc.tickets || doc.tickets.length === 0) {
    return doc
  }

  // Busca o evento para verificar o tipo
  const eventId = typeof doc.event === 'object' ? doc.event.id : doc.event
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 0,
  })

  // Só gera QR Codes individuais para eventos externos
  if (event?.eventType !== 'external') {
    return doc
  }

  try {
    const updatedTickets = await Promise.all(
      doc.tickets.map(async (ticket: any, index: number) => {
        // Gera token único para o ingresso
        const token = generateSecureToken(24)

        // Gera dados do QR Code
        const qrData = generateTicketQRData({
          registrationId: doc.id,
          ticketId: ticket.id || `${doc.id}-${index}`,
          eventId,
          token,
        })

        // Gera QR Code em base64
        const qrCode = await generateQRCodeBase64(qrData, {
          width: 300,
          errorCorrectionLevel: 'H',
        })

        return {
          ...ticket,
          token,
          qrCode,
        }
      }),
    )

    // Atualiza a inscrição com os tokens e QR Codes
    await req.payload.update({
      collection: 'registrations',
      id: doc.id,
      data: {
        tickets: updatedTickets,
      },
      depth: 0,
    })

    return {
      ...doc,
      tickets: updatedTickets,
    }
  } catch (error) {
    console.error('Erro ao gerar tokens dos ingressos:', error)
    return doc
  }
}
