import type { Metadata } from 'next'
import { Suspense } from 'react'
import './global.css'
import PremiumLoader from '@/components/PremiumLoader'
import { ErrorHandler } from './error-handler'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import ChatBot from '@/components/ChatBot'
import { ThemeProvider } from '@/lib/ThemeContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://thinkindia.press'),
  title: {
    default: 'ThinkIndia.press | Garhwa & Jharkhand\'s #1 Hindi News Portal',
    template: '%s | ThinkIndia.press',
  },
  description:
    'ThinkIndia.press (थिंक इंडिया) delivers the fastest breaking news, authoritative regional reporting, and top stories from Garhwa, Palamu, and across Jharkhand in Hindi.',
  keywords: [
    'ThinkIndia.press', 'ThinkIndia.press', 'ThinkIndia.press News', 'Jharkhand News', 'Garhwa News', 'Palamu News',
    'Latest Hindi News', 'Breaking News India', 'गढ़वा न्यूज़', 'झारखंड न्यूज़', 'गढ़वा की ताज़ा खबर',
    'Jharkhand breaking news', 'Garhwa latest news', 'Palamu news hindi'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ThinkIndia.press',
    images: [{ url: '/logo-think-india.png', width: 1200, height: 630, alt: 'ThinkIndia.press' }],
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
    <html lang="hi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E31E24" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg-color min-h-screen antialiased selection:bg-brand-red/30 selection:text-black" suppressHydrationWarning>
        <ThemeProvider>
          <div id="think-india-root" className="flex flex-col min-h-screen" suppressHydrationWarning>
            <ErrorHandler />
            <main className="flex-grow">
              {children}
            </main>
            <CookieBanner />
            <ChatBot />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
