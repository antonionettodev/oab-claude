/**
 * Endpoints do Módulo de Eventos
 *
 * Este arquivo exporta todos os endpoints customizados do módulo de eventos.
 * Os endpoints devem ser registrados na configuração do Payload CMS.
 */

export { checkinEndpoint, selfCheckinEndpoint } from './checkin'
export {
  validateQRCodeEndpoint,
  searchRegistrationEndpoint,
} from './validate-qrcode'
export {
  issueCertificateEndpoint,
  validateCertificateEndpoint,
  downloadCertificateEndpoint,
} from './certificates'
export {
  validatePaymentEndpoint,
  updatePaymentEndpoint,
  requestRefundEndpoint,
} from './payment'
