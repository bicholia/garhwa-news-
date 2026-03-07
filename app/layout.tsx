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
    default: 'गढ़वा पलामू न्यूज़ | NR Daily News — ताज़ा समाचार, सरकारी नौकरियां, अपराध',
    template: '%s | गढ़वा पलामू न्यूज़',
  },
  description:
    'गढ़वा और पलामू जिले की ताज़ा खबरें, ब्रेकिंग न्यूज़, सरकारी नौकरियां, अपराध, राजनीति और मनोरंजन। Jharkhand local news in Hindi.',
  keywords: [
    'गढ़वा समाचार', 'पलामू न्यूज़', 'झारखंड खबरें', 'Garhwa news', 'Palamu news',
    'Jharkhand Hindi news', 'सरकारी नौकरी', 'ब्रेकिंग न्यूज़', 'NR Daily News',
  ],
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    siteName: 'NR Daily News — गढ़वा पलामू न्यूज़',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NR Daily News' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://garhwapalamunews.com' },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  }
}

// This is the SHELL layout — it wraps everything.
// Admin pages have their own layout inside /app/admin/dashboard/layout.tsx
// Public pages use /app/(public)/layout.tsx (or we use conditional below)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div id="nr-daily-news-root" style={{ display: 'contents' }}>
          <ErrorHandler />
          <Suspense fallback={null}>
            <PremiumLoader />
          </Suspense>
          {children}
          <CookieBanner />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
