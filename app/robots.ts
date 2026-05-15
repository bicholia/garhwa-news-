import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: [
      'https://thinkindia.press/sitemap.xml',
      'https://thinkindia.press/sitemap-news.xml'
    ],
  }
}
