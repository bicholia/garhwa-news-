import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

export async function GET() {
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
        featured
      }
    `)
        return NextResponse.json(posts)
    } catch (error: any) {
        console.error('Sanity fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
