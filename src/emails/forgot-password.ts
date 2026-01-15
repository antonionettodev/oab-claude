import { baseTemplate } from './base'

type ForgotPasswordTemplateProps = {
  name: string
  email: string
  resetUrl: string
}

// TO DO:
// - emails não funcionam bem com SVG
// substituir todos os ícones e imagens de SVG para PNG

export const forgotPasswordTemplate = ({ name, email, resetUrl }: ForgotPasswordTemplateProps) => {
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

      <tr>
        <td style="padding-bottom: 24px;">
          <h1>Redefinir senha</h1>
          <p>Olá, ${name},</p>
          <p>
            Recebemos uma solicitação para redefinir a senha da conta vinculada ao e-mail 
            <strong>${email}</strong>.
            Para continuar, clique no botão abaixo:
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 12px 0 24px 0;">
          <a 
            href="${resetUrl}" 
            class="btn" 
            style="display:inline-block;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redefinir senha
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-bottom: 16px;">
          <p>
            Se preferir, você pode copiar e colar o seguinte link diretamente no seu navegador:
          </p>
          <p style="word-break: break-all;">
            <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">
              ${resetUrl}
            </a>
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p class="text-small">
            Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança.
            Nenhuma alteração será feita na sua conta.
          </p>
        </td>
      </tr>

    </table>
  `

  return baseTemplate({
    preheader: 'Instruções para redefinir sua senha',
    content,
  })
}
