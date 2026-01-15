/**
 * Utilitário para geração de QR Codes
 * Utiliza a biblioteca qrcode para gerar QR Codes em base64
 */

import QRCode from 'qrcode'

export type QRCodeOptions = {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

const defaultOptions: QRCodeOptions = {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
  errorCorrectionLevel: 'M',
}

/**
 * Gera um QR Code em formato base64 (data URL)
 */
export const generateQRCodeBase64 = async (
  data: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    throw new Error('Falha ao gerar QR Code')
  }
}

/**
 * Gera um QR Code em formato SVG string
 */
export const generateQRCodeSVG = async (
  data: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const svgString = await QRCode.toString(data, {
      type: 'svg',
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
    })

    return svgString
  } catch (error) {
    console.error('Erro ao gerar QR Code SVG:', error)
    throw new Error('Falha ao gerar QR Code SVG')
  }
}

/**
 * Gera dados para QR Code de check-in individual (evento externo)
 */
export const generateTicketQRData = (params: {
  registrationId: string | number
  ticketId: string | number
  eventId: string | number
  token: string
}): string => {
  const { registrationId, ticketId, eventId, token } = params

  return JSON.stringify({
    type: 'ticket',
    registrationId,
    ticketId,
    eventId,
    token,
    timestamp: Date.now(),
  })
}

/**
 * Gera dados para QR Code fixo do evento (evento interno)
 */
export const generateEventQRData = (params: {
  eventId: string | number
  checkinPassword: string
}): string => {
  const { eventId, checkinPassword } = params

  return JSON.stringify({
    type: 'event',
    eventId,
    checkinPassword,
  })
}

/**
 * Decodifica dados de um QR Code
 */
export const decodeQRData = (
  qrData: string
): {
  type: 'ticket' | 'event'
  registrationId?: string | number
  ticketId?: string | number
  eventId: string | number
  token?: string
  checkinPassword?: string
  timestamp?: number
} => {
  try {
    return JSON.parse(qrData)
  } catch (error) {
    throw new Error('QR Code inválido')
  }
}
