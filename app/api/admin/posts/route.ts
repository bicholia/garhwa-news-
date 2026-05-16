import { NextResponse } from 'next/server'
import { getSanityClient } from '@/lib/sanity-client'

export const dynamic = 'force-dynamic'

export async function GET() {
    const client = getSanityClient()
    try {
        const posts = await client.fetch(`
      *[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        "category": category->slug.current,
        "district": district,
        publishedAt,
        featured,
        "hasImage": defined(featureImage),
        "hasBody": defined(body) && count(body) > 0
      }
    `)
        return NextResponse.json(posts)
    } catch (error: any) {
        console.error('Sanity fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
