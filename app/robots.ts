import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://garhwapalamunews.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/studio/', '/sanity-studio/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
