import type { CollectionAfterChangeHook } from 'payload'
import { generateQRCodeBase64 } from '@/lib/qrcode'

/**
 * Hook para gerar o PDF do certificado após criação
 *
 * Este hook prepara os dados para geração do PDF do certificado.
 * A geração efetiva do PDF pode ser feita:
 * 1. Diretamente aqui usando uma biblioteca como PDFKit ou FPDF
 * 2. Delegada para um serviço externo
 * 3. Gerada sob demanda quando o certificado for acessado
 */
export const generateCertificatePDFHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return doc
  }

  try {
    // Gera QR Code de validação do certificado
    const validationUrl = `${process.env.FRONTEND_URL || ''}/certificados/validar/${doc.certificateNumber}`
    const validationQRCode = await generateQRCodeBase64(validationUrl, {
      width: 150,
      errorCorrectionLevel: 'M',
    })

    // Prepara os dados para o template do certificado
    const certificateData = {
      certificateNumber: doc.certificateNumber,
      validationHash: doc.validationHash,
      participantName: doc.participantName,
      participantCPF: doc.participantCPF,
      eventTitle: doc.eventTitle,
      eventStartDate: doc.eventStartDate,
      eventEndDate: doc.eventEndDate,
      workload: doc.workload,
      issuedAt: doc.issuedAt,
      validationQRCode,
      validationUrl,
    }

    // Atualiza o certificado com o QR Code de validação
    await req.payload.update({
      collection: 'certificates',
      id: doc.id,
      data: {
        validationQRCode,
        certificateData: JSON.stringify(certificateData),
        status: 'generated',
      },
      depth: 0,
    })

    return {
      ...doc,
      validationQRCode,
      certificateData: JSON.stringify(certificateData),
      status: 'generated',
    }
  } catch (error) {
    console.error('Erro ao gerar dados do certificado:', error)

    // Marca como erro
    await req.payload.update({
      collection: 'certificates',
      id: doc.id,
      data: {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      depth: 0,
    })

    return doc
  }
}
