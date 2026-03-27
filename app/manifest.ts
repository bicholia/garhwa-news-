import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NR Daily News | गढ़वा पलामू न्यूज़',
    short_name: 'NR Daily News',
    description: 'गढ़वा और पलामू जिले की ताज़ा खबरें, सरकारी नौकरियां और ब्रेकिंग न्यूज़।',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
  }
}
