import { getClientSideURL } from '@/lib/get-urls'

export const getFileUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  const siteUrl = getClientSideURL()
  return cacheTag ? `${siteUrl}${url}?${cacheTag}` : `${siteUrl}${url}`
}
