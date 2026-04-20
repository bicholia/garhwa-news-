import type { Metadata } from 'next'
import { Suspense } from 'react'
import './global.css'
import PremiumLoader from '@/components/PremiumLoader'
import { ErrorHandler } from './error-handler'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL('https://thinkindia.press'),
  title: {
    default: 'Think India | Fast. Fair. Fearless.',
    template: '%s | Think India',
  },
  description:
    'Think India delivers authoritative regional reporting and national intelligence, powered by speed and journalistic integrity.',
  keywords: [
    'Think India', 'Think India News', 'Jharkhand News', 'Garhwa News', 'Palamu News',
    'Latest Hindi News', 'Breaking News India'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Think India',
    images: [{ url: '/logo-think-india.png', width: 1200, height: 630, alt: 'Think India' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo-think-india.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://thinkindia.press' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#E31E24" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-white min-h-screen antialiased selection:bg-brand-red/30 selection:text-black" suppressHydrationWarning>
        <div id="think-india-root" className="flex flex-col min-h-screen" suppressHydrationWarning>
          <ErrorHandler />
          <Suspense fallback={null}>
            <PremiumLoader />
          </Suspense>
          <main className="flex-grow">
            {children}
          </main>
          <CookieBanner />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
