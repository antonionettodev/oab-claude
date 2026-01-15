import { baseTemplate } from './base'
import { getServerSideURL } from '@/lib/get-urls'

type PostNotificationProps = {
  subscriberName: string
  postTitle: string
  postExcerpt: string
  postSlug: string
  postImageUrl?: string
}

const siteUrl = getServerSideURL()

export const postNotificationTemplate = ({
  subscriberName,
  postTitle,
  postExcerpt,
  postSlug,
  postImageUrl,
}: PostNotificationProps): string => {
  const postUrl = `${siteUrl}/posts/${postSlug}`
  const unsubscribeUrl = `${siteUrl}/cancelar-inscricao`

  const imageSection = postImageUrl
    ? `
      <tr>
        <td style="padding-bottom: 24px;">
          <img
            src="${postImageUrl}"
            alt="${postTitle}"
            width="540"
            style="width: 100%; border-radius: 8px; max-height: 280px; object-fit: cover;"
          >
        </td>
      </tr>
    `
    : ''

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-bottom: 24px;">
          <h1>Novo artigo disponível</h1>
          <p>Olá, ${subscriberName}!</p>
          <p>
            Temos uma novidade para você. Acabamos de publicar um novo conteúdo no nosso blog:
          </p>
        </td>
      </tr>

      ${imageSection}

      <tr>
        <td style="padding-bottom: 24px;">
          <h2 style="margin: 0 0 12px;">
            ${postTitle}
          </h2>
          <p style="margin: 0;">
            ${postExcerpt}
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 12px 0 24px 0;">
          <a 
            href="${postUrl}" 
            class="btn" 
            style="display:inline-block;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ler artigo completo
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
            Você está recebendo este e-mail porque se inscreveu na nossa newsletter.
            <br><br>
            <a href="${unsubscribeUrl}" style="color: #718096; text-decoration: underline;">
              Cancelar inscrição
            </a>
          </p>
        </td>
      </tr>
    </table>
  `

  return baseTemplate({
    preheader: `Novo post: ${postTitle}`,
    content,
  })
}
