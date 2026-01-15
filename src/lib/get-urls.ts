import canUseDOM from './can-use-dom'

export const getServerSideURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
    : 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  }

  return process.env.NEXT_PUBLIC_BASE_URL || ''
}
