import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

export async function GET() {
    const client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: true,
        apiVersion: '2024-01-01',
    })

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
