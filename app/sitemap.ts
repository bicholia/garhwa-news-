import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const baseUrl = 'https://garhwapalamunews.com'

async function getSiteData() {
  const query = `
    *[_type == "article"] {
      "slug": slug.current,
      publishedAt
    }
  `
  return {
    articles: await client.fetch(query),
    authors: await client.fetch(`*[_type == "author"] { "slug": slug.current, _updatedAt }`),
    categories: await client.fetch(`*[_type == "category"] { "slug": slug.current, _updatedAt }`)
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${baseUrl}/garhwa`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/palamu`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/jharkhand`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
  ]

  const articlePages = data.articles?.map((a: any) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || []

  const categoryPages = data.categories?.map((c: any) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  const authorPages = data.authors?.map((a: any) => ({
    url: `${baseUrl}/author/${a.slug}`,
    lastModified: a._updatedAt ? new Date(a._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  return [...staticPages, ...categoryPages, ...authorPages, ...articlePages]
}
