import { getServerSideURL } from '@/lib/get-urls'
import { baseTemplate } from './base'

type UnsubscribeNewsletterProps = {
  subscriberName: string
}

const siteUrl = getServerSideURL()

export const unsubscribeNewsletterTemplate = ({
  subscriberName,
}: UnsubscribeNewsletterProps): string => {
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-bottom: 24px;">
          <h1>Inscrição cancelada</h1>
          <p>Olá, ${subscriberName}!</p>
          <p>
            Sua inscrição na newsletter da OAB/SC foi cancelada com sucesso.
          </p>
          <p>
            Sentiremos sua falta! Se mudar de ideia, você pode se inscrever 
            novamente a qualquer momento em nosso site.
          </p>
          <p style="margin: 0;">
            Obrigado por ter feito parte da nossa comunidade.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="divider"></div>
        </td>
      </tr>

      <tr>
        <td style="padding-top: 24px; padding-bottom: 20px;">
          <h3 style="margin: 0 0 12px;">Quer voltar?</h3>
          <p style="margin: 0;">
            Você pode se inscrever novamente quando quiser.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <a 
            href="${siteUrl}/newsletter" 
            class="btn" 
            style="display:inline-block;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inscrever-se novamente
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <div class="divider"></div>
        </td>
      </tr>

      <tr>
        <td style="padding-top: 16px;">
          <p class="text-small" style="text-align: center;">
            Você está recebendo este e-mail porque solicitou o cancelamento da sua inscrição.
          </p>
        </td>
      </tr>
    </table>
  `

  return baseTemplate({
    preheader: 'Sua inscrição na newsletter foi cancelada',
    content,
  })
}
