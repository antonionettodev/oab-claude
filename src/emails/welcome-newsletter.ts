import { getServerSideURL } from '@/lib/get-urls'
import { baseTemplate } from './base'

type WelcomeNewsletterProps = {
  subscriberName: string
}

const siteUrl = getServerSideURL()

export const welcomeNewsletterTemplate = ({ subscriberName }: WelcomeNewsletterProps): string => {
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-bottom: 24px;">
          <h1>Bem-vindo(a) à nossa newsletter!</h1>
          <p>Olá, ${subscriberName}!</p>
          <p>
            É uma alegria ter você conosco! A partir de agora, você receberá em primeira mão 
            todas as novidades, informações relevantes e atualizações sobre os serviços e 
            eventos da OAB Santa Catarina.
          </p>
          <p style="margin: 0;">
            Nosso compromisso é manter você sempre informado(a) sobre tudo que importa 
            para a advocacia catarinense. Obrigado por fazer parte dessa comunidade!
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
          <h3 style="margin: 0 0 12px;">Conheça nossos serviços</h3>
          <p style="margin: 0;">
            Enquanto isso, que tal conhecer um pouco mais sobre o que oferecemos?
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding-bottom: 12px;">
          <a 
            href="${siteUrl}/servicos" 
            class="btn" 
            style="display:inline-block;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver serviços
          </a>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <a 
            href="${siteUrl}/posts" 
            class="btn btn-secondary" 
            style="display:inline-block; margin-top: 12px;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ler nosso blog
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
          </p>
        </td>
      </tr>
    </table>
  `

  return baseTemplate({
    preheader: 'Bem-vindo(a) à newsletter da OAB Santa Catarina!',
    content,
  })
}
