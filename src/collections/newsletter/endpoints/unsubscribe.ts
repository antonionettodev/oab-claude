import { unsubscribeNewsletterTemplate } from '@/emails/unsubscribe-newsletter'
import type { Endpoint } from 'payload'

export const unsubscribeEndpoint: Endpoint = {
  path: '/unsubscribe',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    try {
      const body = await req.json?.()
      const { email } = body || {}

      if (!email) {
        return Response.json({ success: false, message: 'E-mail é obrigatório' }, { status: 400 })
      }

      const { docs } = await payload.find({
        collection: 'newsletter',
        where: {
          email: { equals: email },
        },
        limit: 1,
      })

      if (docs.length === 0) {
        return Response.json(
          { success: false, message: 'E-mail não encontrado na newsletter' },
          { status: 404 },
        )
      }

      const subscriber = docs[0]

      if (subscriber.status === 'inactive') {
        return Response.json(
          { success: true, message: 'Você já está desinscrito da newsletter' },
          { status: 200 },
        )
      }

      await payload.update({
        collection: 'newsletter',
        id: subscriber.id,
        data: {
          status: 'inactive',
        },
      })

      await payload.sendEmail({
        to: email,
        subject: 'Inscrição cancelada - OAB/SC',
        html: unsubscribeNewsletterTemplate({
          subscriberName: subscriber.name || 'Assinante',
        }),
      })
      req.payload.logger.info(`Email de desinscrição enviado para: ${email}`)

      return Response.json(
        { success: true, message: 'Você foi desinscrito da newsletter com sucesso' },
        { status: 200 },
      )
    } catch (error) {
      req.payload.logger.info(
        `Erro ao enviar email de desinscrição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      )
      return Response.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
    }
  },
}
