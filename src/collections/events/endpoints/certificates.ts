import type { Endpoint } from 'payload'

/**
 * Endpoint: Emitir Certificado
 *
 * Emite um certificado para um participante que tem direito.
 *
 * POST /api/events/issue-certificate
 */
export const issueCertificateEndpoint: Endpoint = {
  path: '/issue-certificate',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = req.json ? await req.json() : {}
      const { registrationId, ticketIndex = 0 } = body

      if (!registrationId) {
        return Response.json(
          { success: false, error: 'ID da inscrição é obrigatório' },
          { status: 400 }
        )
      }

      // Busca a inscrição
      const registration = await payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 1,
      })

      if (!registration) {
        return Response.json(
          { success: false, error: 'Inscrição não encontrada' },
          { status: 404 }
        )
      }

      // Busca o evento
      const eventId =
        typeof registration.event === 'object'
          ? registration.event.id
          : registration.event

      const event = await payload.findByID({
        collection: 'events',
        id: eventId,
        depth: 0,
      })

      if (!event) {
        return Response.json(
          { success: false, error: 'Evento não encontrado' },
          { status: 404 }
        )
      }

      // Verifica se o evento emite certificado
      if (!event.hasCertificate) {
        return Response.json(
          { success: false, error: 'Este evento não emite certificado' },
          { status: 400 }
        )
      }

      // Verifica pagamento
      const paidStatuses = ['paid', 'complimentary']
      if (!paidStatuses.includes(registration.paymentStatus)) {
        return Response.json(
          { success: false, error: 'Certificado não pode ser emitido: pagamento não confirmado' },
          { status: 400 }
        )
      }

      // Verifica presença
      const presenceStatuses = ['checked-in', 'attended', 'partial-checkin']
      if (!presenceStatuses.includes(registration.status)) {
        return Response.json(
          { success: false, error: 'Certificado não pode ser emitido: presença não registrada' },
          { status: 400 }
        )
      }

      // Verifica se já existe certificado
      const existingCertificate = await payload.find({
        collection: 'certificates',
        where: {
          registration: { equals: registrationId },
          ticketIndex: { equals: ticketIndex },
          status: { not_equals: 'revoked' },
        },
        limit: 1,
      })

      if (existingCertificate.totalDocs > 0) {
        // Verifica se permite segunda via
        if (!event.allowDuplicateCertificate) {
          return Response.json(
            {
              success: false,
              error: 'Certificado já emitido. Este evento não permite segunda via.',
              certificateId: existingCertificate.docs[0].id,
              certificateNumber: existingCertificate.docs[0].certificateNumber,
            },
            { status: 400 }
          )
        }

        // Retorna o certificado existente
        return Response.json({
          success: true,
          message: 'Certificado já existe',
          isDuplicate: false,
          data: {
            certificateId: existingCertificate.docs[0].id,
            certificateNumber: existingCertificate.docs[0].certificateNumber,
            validationHash: existingCertificate.docs[0].validationHash,
            issuedAt: existingCertificate.docs[0].issuedAt,
          },
        })
      }

      // Cria o certificado
      const certificate = await payload.create({
        collection: 'certificates',
        data: {
          registration: registrationId,
          ticketIndex,
        },
      })

      return Response.json({
        success: true,
        message: 'Certificado emitido com sucesso',
        data: {
          certificateId: certificate.id,
          certificateNumber: certificate.certificateNumber,
          validationHash: certificate.validationHash,
          participantName: certificate.participantName,
          eventTitle: certificate.eventTitle,
          issuedAt: certificate.issuedAt,
        },
      })
    } catch (error) {
      console.error('Erro ao emitir certificado:', error)
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

/**
 * Endpoint: Validar Certificado
 *
 * Valida a autenticidade de um certificado pelo número e hash.
 *
 * GET /api/events/validate-certificate
 */
export const validateCertificateEndpoint: Endpoint = {
  path: '/validate-certificate',
  method: 'get',
  handler: async (req) => {
    const { payload } = req

    try {
      const url = new URL(req.url || '', 'http://localhost')
      const certificateNumber = url.searchParams.get('number')
      const hash = url.searchParams.get('hash')

      if (!certificateNumber) {
        return Response.json(
          { success: false, error: 'Número do certificado é obrigatório' },
          { status: 400 }
        )
      }

      // Busca o certificado
      const certificates = await payload.find({
        collection: 'certificates',
        where: {
          certificateNumber: { equals: certificateNumber },
        },
        limit: 1,
        depth: 0,
      })

      if (certificates.totalDocs === 0) {
        return Response.json({
          success: true,
          valid: false,
          error: 'Certificado não encontrado',
        })
      }

      const certificate = certificates.docs[0]

      // Verifica status
      if (certificate.status === 'revoked') {
        return Response.json({
          success: true,
          valid: false,
          error: 'Este certificado foi revogado',
          revokedAt: certificate.revokedAt,
          revokedReason: certificate.revokedReason,
        })
      }

      // Valida o hash se fornecido
      if (hash && certificate.validationHash !== hash) {
        return Response.json({
          success: true,
          valid: false,
          error: 'Hash de validação inválido',
        })
      }

      return Response.json({
        success: true,
        valid: true,
        data: {
          certificateNumber: certificate.certificateNumber,
          participantName: certificate.participantName,
          eventTitle: certificate.eventTitle,
          eventStartDate: certificate.eventStartDate,
          eventEndDate: certificate.eventEndDate,
          workload: certificate.workload,
          issuedAt: certificate.issuedAt,
          isDuplicate: certificate.isDuplicate,
        },
      })
    } catch (error) {
      console.error('Erro ao validar certificado:', error)
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

/**
 * Endpoint: Download do Certificado
 *
 * Incrementa o contador de downloads e retorna a URL do PDF.
 *
 * GET /api/events/download-certificate/:id
 */
export const downloadCertificateEndpoint: Endpoint = {
  path: '/download-certificate/:id',
  method: 'get',
  handler: async (req) => {
    const { payload, routeParams } = req

    try {
      const certificateId = routeParams?.id

      if (!certificateId) {
        return Response.json(
          { success: false, error: 'ID do certificado é obrigatório' },
          { status: 400 }
        )
      }

      // Busca o certificado
      const certificate = await payload.findByID({
        collection: 'certificates',
        id: certificateId,
        depth: 1,
      })

      if (!certificate) {
        return Response.json(
          { success: false, error: 'Certificado não encontrado' },
          { status: 404 }
        )
      }

      if (certificate.status === 'revoked') {
        return Response.json(
          { success: false, error: 'Este certificado foi revogado' },
          { status: 400 }
        )
      }

      if (certificate.status !== 'generated' && certificate.status !== 'sent') {
        return Response.json(
          { success: false, error: 'Certificado ainda não foi gerado' },
          { status: 400 }
        )
      }

      // Incrementa contador de downloads
      await payload.update({
        collection: 'certificates',
        id: certificateId,
        data: {
          downloadCount: (certificate.downloadCount || 0) + 1,
          lastDownloadAt: new Date().toISOString(),
        },
      })

      // Retorna os dados do certificado (ou URL do PDF se existir)
      const pdfUrl = certificate.pdfFile
        ? typeof certificate.pdfFile === 'object'
          ? certificate.pdfFile.url
          : null
        : null

      return Response.json({
        success: true,
        data: {
          certificateId: certificate.id,
          certificateNumber: certificate.certificateNumber,
          pdfUrl,
          certificateData: certificate.certificateData
            ? JSON.parse(certificate.certificateData)
            : null,
        },
      })
    } catch (error) {
      console.error('Erro ao baixar certificado:', error)
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
