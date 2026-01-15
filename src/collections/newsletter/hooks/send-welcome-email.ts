import type { CollectionAfterChangeHook } from 'payload'
import type { Newsletter } from '@/payload-types'
import { welcomeNewsletterTemplate } from '@/emails/welcome-newsletter'

export const sendWelcomeEmail: CollectionAfterChangeHook<Newsletter> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return doc
  }

  if (doc.status !== 'active') {
    return doc
  }

  try {
    const emailHtml = welcomeNewsletterTemplate({
      subscriberName: doc.name || 'Advogado(a)',
    })

    await req.payload.sendEmail({
      to: doc.email,
      subject: 'Bem-vindo(a) à newsletter da OAB Santa Catarina!',
      html: emailHtml,
    })

    req.payload.logger.info(`Email de boas-vindas enviado para: ${doc.email}`)
  } catch (error) {
    req.payload.logger.error(
      `Erro ao enviar email de boas-vindas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    )
  }

  return doc
}
