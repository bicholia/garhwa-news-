import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = createImageUrlBuilder(client as any)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ Queries
export const queries = {
  featuredArticles: `*[_type == "article" && featured == true] | order(publishedAt desc)[0...6] {
    title,
    "slug": slug.current,
    excerpt,
    "featureImage": featureImage.asset->url,
    category,
    "categorySlug": category,
    district,
    publishedAt,
    author
  }`,

  articlesByDistrict: (district: string) => `*[_type == "article" && district == "${district}"] | order(publishedAt desc)[0...10] {
    title,
    "slug": slug.current,
    excerpt,
    "featureImage": featureImage.asset->url,
    category,
    "categorySlug": category,
    district,
    publishedAt,
    author
  }`,

  articleBySlug: (slug: string) => `*[_type == "article" && slug.current == "${slug}"][0] {
    title,
    "slug": slug.current,
    excerpt,
    body,
    "featureImage": featureImage.asset->url,
    category,
    "categorySlug": category,
    district,
    publishedAt,
    _updatedAt,
    author
  }`,

  articlesByCategory: (category: string) => `*[_type == "article" && category == "${category}"] | order(publishedAt desc)[0...12] {
    title,
    "slug": slug.current,
    excerpt,
    "featureImage": featureImage.asset->url,
    category,
    "categorySlug": category,
    district,
    publishedAt,
    author
  }`,

  breakingNews: `*[_type == "breakingNews" && active == true] | order(publishedAt desc) {
    text,
    href
  }`,

  latestJobs: `*[_type == "article" && category == "jobs"] | order(publishedAt desc)[0...6] {
    title,
    "slug": slug.current,
    publishedAt
  }`,

  popularArticles: `*[_type == "article"] | order(publishedAt desc)[0...5] {
    title,
    "slug": slug.current,
    publishedAt
  }`,
}

export async function fetchData(query: string, params = {}) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}
