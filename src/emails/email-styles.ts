export const emailStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #F7FAFC;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }

  img {
    border: 0;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
    max-width: 100%;
    height: auto;
    display: block;
  }

  a {
    text-decoration: none;
    color: #2B7FFF;
  }

  .bg-page {
    background-color: #F7FAFC;
  }

  .email-outer {
    padding: 20px 0;
  }

  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .content-wrapper {
    padding: 40px 30px;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-small {
    font-size: 14px;
    color: #718096;
  }

  .text-muted {
    color: #718096;
  }

  .text-dark {
    color: #2D3748;
  }

  .header {
    padding: 40px 30px;
    text-align: center;
    background: linear-gradient(135deg, #2B7FFF 0%, #5B9FFF 50%, #9B8FFF 100%);
  }

  .header-title {
    color: #FFFFFF;
    font-size: 14px;
    margin: 0;
    opacity: 0.95;
    font-weight: 500;
  }

  .footer {
    background-color: #F7FAFC;
    padding: 40px 30px;
    border-top: 1px solid #E2E8F0;
  }

  .footer-title {
    color: #2D3748;
    font-size: 18px;
    margin: 0 0 8px 0;
    font-weight: 700;
  }

  .footer-subtitle {
    color: #718096;
    font-size: 14px;
    margin: 0;
  }

  .footer-links {
    margin: 0 auto;
  }

  .footer-link {
    padding: 0 12px;
  }

  .footer-link + .footer-link {
    border-left: 1px solid #E2E8F0;
  }

  .footer-link a {
    color: #2B7FFF;
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
  }

  .social-icons {
    margin: 0 auto;
  }

  .social-icon {
    padding: 0 8px;
  }

  .btn {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #2B7FFF 0%, #5B9FFF 100%);
    color: #FFFFFF !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .btn-secondary {
    background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%);
  }

  .btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .divider {
    height: 1px;
    background-color: #E2E8F0;
    margin: 30px 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #2D3748;
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 16px 0;
  }

  h1 {
    font-size: 32px;
    background: linear-gradient(135deg, #2B7FFF 0%, #9B8FFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    font-size: 26px;
  }

  h3 {
    font-size: 22px;
  }

  p {
    color: #4A5568;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 16px 0;
  }

  .footer-legal {
    color: #718096;
    font-size: 12px;
    line-height: 1.6;
    margin: 0;
  }

  .footer-legal a {
    color: #2B7FFF;
    text-decoration: underline;
  }

  .preheader {
    display: none !important;
    visibility: hidden;
    opacity: 0;
    color: transparent;
    height: 0;
    width: 0;
    font-size: 1px;
    line-height: 1px;
    max-height: 0;
    max-width: 0;
    mso-hide: all;
  }

  @media only screen and (max-width: 600px) {
    .email-container {
      width: 100% !important;
    }

    .content-wrapper {
      padding: 30px 20px !important;
    }

    h1 {
      font-size: 26px !important;
    }

    h2 {
      font-size: 22px !important;
    }

    .btn {
      padding: 12px 24px !important;
      font-size: 14px !important;
    }

    .footer-links {
      display: block !important;
    }

    .footer-link {
      display: block !important;
      border-left: none !important;
      margin: 8px 0 !important;
      text-align: center !important;
    }
  }
`
