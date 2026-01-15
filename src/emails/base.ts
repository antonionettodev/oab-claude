import { emailStyles } from './email-styles'
import { getServerSideURL } from '@/lib/get-urls'

type BaseTemplateProps = {
  content: string
  preheader?: string
}

const siteUrl = getServerSideURL()

export const baseTemplate = ({ content, preheader = '' }: BaseTemplateProps) => {
  const currentYear = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>OAB Santa Catarina</title>

  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse; border-spacing: 0; margin: 0;}
    div, td {padding: 0;}
    div {margin: 0 !important;}
  </style>
  <![endif]-->

  <style>
    ${emailStyles}
  </style>
</head>

<body class="bg-page" style="margin:0; padding:0;">
  <div class="preheader">
    ${preheader || '&nbsp;'}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-outer">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="header">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img 
                      src="https://s3-oab-sc-dev.na.tec.br/oab-sc-site/logo.png" 
                      alt="OAB Santa Catarina" 
                      width="150" 
                      style="margin-bottom: 16px;"
                    >
                    <p class="header-title">
                      Ordem dos Advogados do Brasil - Santa Catarina
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="content-wrapper">
              ${content ?? ''}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <h3 class="footer-title">
                      OAB Santa Catarina
                    </h3>
                    <p class="footer-subtitle">
                      Advocacia com excelência e comprometimento
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="footer-links">
                      <tr>
                        <td class="footer-link">
                          <a href="${siteUrl}">
                            Site Oficial
                          </a>
                        </td>
                        <td class="footer-link">
                          <a href="${siteUrl}/servicos">
                            Serviços
                          </a>
                        </td>
                        <td class="footer-link">
                          <a href="${siteUrl}/contato">
                            Contato
                          </a>
                        </td>
                        <td class="footer-link">
                          <a href="${siteUrl}/clube">
                            Clube
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="social-icons">
                      <tr>
                        <td class="social-icon">
                          <a href="https://www.facebook.com/oabsc/">
                            <img 
                              src="https://s.magecdn.com/social/24w/tc-facebook.png" 
                              alt="Facebook" 
                              width="24" 
                              height="24" 
                              style="border-radius: 50%;"
                            >
                          </a>
                        </td>
                        <td class="social-icon">
                          <a href="https://www.instagram.com/oabsantacatarina">
                            <img 
                              src="https://s.magecdn.com/social/24w/tc-instagram.png" 
                              alt="Instagram" 
                              width="24" 
                              height="24" 
                              style="border-radius: 50%;"
                            >
                          </a>
                        </td>
                        <td class="social-icon">
                          <a href="https://www.youtube.com/user/telematicaoab">
                            <img 
                              src="https://www.youtube.com/@institutocuradosparacurara7815" 
                              alt="YouTube" 
                              width="24" 
                              height="24" 
                              style="border-radius: 50%;"
                            >
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p class="footer-legal">
                      © ${currentYear} OAB Santa Catarina. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
