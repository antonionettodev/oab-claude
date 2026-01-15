import type { CollectionAfterChangeHook } from 'payload'
import { generateQRCodeBase64, generateEventQRData } from '@/lib/qrcode'

/**
 * Hook para gerar QR Code do evento automaticamente após criação/atualização
 * Usado para eventos internos onde há um QR Code fixo no local
 */
export const generateEventQRCodeHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Só gera QR Code para eventos internos
  if (doc.eventType !== 'internal') {
    return doc
  }

  // Verifica se já tem QR Code ou se a senha de check-in mudou
  const shouldGenerateQR =
    operation === 'create' ||
    !doc.eventQRCode ||
    doc._previousCheckinPassword !== doc.checkinPassword

  if (!shouldGenerateQR) {
    return doc
  }

  try {
    const qrData = generateEventQRData({
      eventId: doc.id,
      checkinPassword: doc.checkinPassword,
    })

    const qrCodeBase64 = await generateQRCodeBase64(qrData, {
      width: 400,
      errorCorrectionLevel: 'H',
    })

    // Atualiza o documento com o QR Code gerado
    await req.payload.update({
      collection: 'events',
      id: doc.id,
      data: {
        eventQRCode: qrCodeBase64,
      },
      depth: 0,
    })

    return {
      ...doc,
      eventQRCode: qrCodeBase64,
    }
  } catch (error) {
    console.error('Erro ao gerar QR Code do evento:', error)
    return doc
  }
}
