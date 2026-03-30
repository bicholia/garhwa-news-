import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NR Global Agency | International News',
    short_name: 'NR Global',
    description: 'Premier international news agency delivering authoritative, real-time reports with integrity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAF9',
    theme_color: '#0F172A',
    icons: [
      {
        src: '/logo-new.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/logo-new.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  }
}
