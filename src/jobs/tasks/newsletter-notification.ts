import type { TaskConfig } from 'payload'
import { postNotificationTemplate } from '@/emails/post-notification'

export const sendPostNotificationTask: TaskConfig<'sendPostNotification'> = {
  slug: 'sendPostNotification',
  label: 'Enviar Notificação de Novo Post',
  retries: 3,
  inputSchema: [
    {
      name: 'postId',
      type: 'text',
      required: true,
    },
    {
      name: 'postTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'postExcerpt',
      type: 'text',
      required: true,
    },
    {
      name: 'postSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'postImageUrl',
      type: 'text',
      required: false,
    },
  ],
  outputSchema: [
    {
      name: 'totalSubscribers',
      type: 'number',
    },
    {
      name: 'emailsSent',
      type: 'number',
    },
    {
      name: 'emailsFailed',
      type: 'number',
    },
  ],
  handler: async ({ input, req }) => {
    const { postTitle, postExcerpt, postSlug, postImageUrl } = input

    const subscribers = await req.payload.find({
      collection: 'newsletter',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 0,
      pagination: false,
    })

    const totalSubscribers = subscribers.docs.length

    if (totalSubscribers === 0) {
      req.payload.logger.info('Nenhum inscrito ativo na newsletter para notificar.')
      return {
        output: {
          totalSubscribers: 0,
          emailsSent: 0,
          emailsFailed: 0,
        },
      }
    }

    let emailsSent = 0
    let emailsFailed = 0

    for (const subscriber of subscribers.docs) {
      try {
        const subscriberName = subscriber.name || 'Amigo(a)'

        const emailHtml = postNotificationTemplate({
          subscriberName,
          postTitle,
          postExcerpt,
          postSlug,
          postImageUrl: postImageUrl || undefined,
        })

        await req.payload.sendEmail({
          to: subscriber.email,
          subject: `Novo post: ${postTitle}`,
          html: emailHtml,
        })

        emailsSent++

        req.payload.logger.info(`Email de novo post enviado para: ${subscriber.email}`)
      } catch (error) {
        emailsFailed++
        req.payload.logger.error(
          `Falha ao enviar email para ${subscriber.email}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        )
      }
    }

    req.payload.logger.info(
      `Notificação de novo post concluída. Total: ${totalSubscribers}, Enviados: ${emailsSent}, Falhas: ${emailsFailed}`,
    )

    return {
      output: {
        totalSubscribers,
        emailsSent,
        emailsFailed,
      },
    }
  },
}
