import type { Metadata } from 'next'
import { Suspense } from 'react'
import './global.css'
import PremiumLoader from '@/components/PremiumLoader'
import { ErrorHandler } from './error-handler'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL('https://garhwapalamunews.com'),
  title: {
    default: 'NR Regional News Bureau | Global Reporting Standards',
    template: '%s | NR Regional News',
  },
  description:
    'NR Regional News Bureau delivers authoritative local reporting from Jharkhand, Garhwa, and Palamu, powered by the global standards of NR Global Agency.',
  keywords: [
    'NR Global News', 'NR Daily News', 'Jharkhand News', 'Garhwa News', 'Palamu News',
    'International News Agency', 'Latest Hindi News', 'Breaking News India'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NR Regional News Bureau',
    images: [{ url: '/logo-new.png', width: 1200, height: 630, alt: 'NR Regional News' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo-new.png'],
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
  alternates: { canonical: 'https://garhwapalamunews.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0F172A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-news-paper min-h-screen antialiased selection:bg-brand-gold/30 selection:text-brand-navy" suppressHydrationWarning>
        <div id="nr-daily-news-root" className="flex flex-col min-h-screen" suppressHydrationWarning>
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
