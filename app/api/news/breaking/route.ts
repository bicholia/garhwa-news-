import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-01',
})

export async function GET() {
    try {
        const data = await client.fetch(
            `*[_type == "breakingNews" && active == true] | order(publishedAt desc)[0...5] {
                text,
                href
            }`
        )
        return NextResponse.json(data)
    } catch (err) {
        console.error('[Breaking News API Error]', err)
        return NextResponse.json([])
    }
}
