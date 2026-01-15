export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  })
}

export function formatDateFull(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}
