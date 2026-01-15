import { baseTemplate } from './base'

type VerifyEmailTemplateProps = {
  name: string
  email: string
  verifyUrl: string
}

export const verifyEmailTemplate = ({ name, email, verifyUrl }: VerifyEmailTemplateProps) => {
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-bottom: 24px;">
          <h1>Confirme seu e-mail</h1>
          <p>Olá, ${name},</p>
          <p>
            Recebemos um pedido para cadastro com este endereço de e-mail (<strong>${email}</strong>).
            Para concluir o processo e ativar sua conta, confirme seu e-mail clicando no botão abaixo:
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding: 12px 0 24px 0;">
          <!-- Botão principal -->
          <a 
            href="${verifyUrl}" 
            class="btn" 
            style="display:inline-block;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Confirmar e-mail
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-bottom: 16px;">
          <p>
            Se o botão acima não funcionar, você também pode copiar e colar o link abaixo no seu navegador:
          </p>
          <p style="word-break: break-all;">
            <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">
              ${verifyUrl}
            </a>
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p class="text-small">
            Caso você não tenha solicitado este cadastro, pode ignorar este e-mail com segurança.
          </p>
        </td>
      </tr>
    </table>
  `

  return baseTemplate({
    preheader: 'Confirme seu e-mail para ativar sua conta',
    content,
  })
}
