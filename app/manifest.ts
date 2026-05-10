import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ThinkIndia.press',
    short_name: 'ThinkIndia.press',
    description: 'Install the ThinkIndia.press application for fast, fair, and fearless news reports from Jharkhand.',
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
