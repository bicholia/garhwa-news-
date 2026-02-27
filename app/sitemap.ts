import { MetadataRoute } from 'next'
import { featuredArticles, garhwaNews, palamuNews, crimeNews } from '@/lib/mockData'

const allArticles = [...featuredArticles, ...garhwaNews, ...palamuNews, ...crimeNews]
const baseUrl = 'https://garhwa-news.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 1.0 },
        { url: `${baseUrl}/garhwa`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/palamu`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/jharkhand`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.8 },
        { url: `${baseUrl}/category/top-story`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/category/crime`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.8 },
        { url: `${baseUrl}/category/administration`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/category/city-facilities`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/category/disaster-accident`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/category/health-education`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/category/public-issues`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/category/rural-development`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/category/social-events`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    ]

    const articlePages = allArticles.map(a => ({
        url: `${baseUrl}/news/${a.slug}`,
        lastModified: new Date(a.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticPages, ...articlePages]
}
