import React from 'react'
import { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { getServerSideURL } from '@/lib/get-urls'
import './globals.css'
import { Header } from '@/components/layout/menu/header'

const siteUrl = getServerSideURL()

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Site - OAB/SC',
    template: '%s - OAB/SC',
  },
  metadataBase: new URL(siteUrl),
  description: 'Site Oficial da OAB/SC.',
  openGraph: {
    title: 'Site Oficial da OAB/SC.',
    description:
      'Informações, serviços e novidades da Ordem dos Advogados do Brasil - Seccional Santa Catarina.',
    siteName: 'OAB Santa Catarina',
    locale: 'pt_BR',
    type: 'website',
    url: new URL(siteUrl),
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Logo OAB/SC',
      },
    ],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: new URL(siteUrl),
  },
}

export const viewport: Viewport = {
  themeColor: '#F2F3F7',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Toaster richColors position="bottom-center" toastOptions={{ className: 'z-[9999]' }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
