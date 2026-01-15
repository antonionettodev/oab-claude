import type { Metadata } from 'next'
import { getServerSideURL } from './get-urls'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Informações, serviços e novidades da Ordem dos Advogados do Brasil - Seccional Santa Catarina.',
  images: [
    {
      url: `${getServerSideURL()}/oab-sc-OG.webp`,
    },
  ],
  siteName: 'Site Oficial da OAB/SC.',
  title: 'OAB Santa Catarina',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
