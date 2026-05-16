import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        useCdn: false,
        apiVersion: '2024-01-01',
        token: process.env.SANITY_TOKEN
    })

    try {
        const { title } = await request.json()
        if (!title) {
            return NextResponse.json({ isDuplicate: false })
        }

        const trimmedTitle = title.trim()
        // Case insensitive check would be better, but Sanity GROQ handles it with lower()
        // Let's use case insensitive match for better safety
        const posts = await client.fetch(
            `*[_type == "article" && lower(title) == lower($title)]{_id}`,
            { title: trimmedTitle }
        )

        return NextResponse.json({ isDuplicate: posts.length > 0 })
    } catch (error: any) {
        console.error('Check duplicate error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
