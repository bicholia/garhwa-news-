import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Think India | Fast. Fair. Fearless.',
    short_name: 'Think India',
    description: 'Premier regional news agency delivering authoritative, real-time reports with integrity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#E31E24',
    icons: [
      {
        src: '/logo-think-india.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/logo-think-india.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  }
}
