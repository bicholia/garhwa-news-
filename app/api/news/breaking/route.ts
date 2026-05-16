import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { scrubBrandNames, normalizeText } from '@/lib/safety'

export const dynamic = 'force-dynamic'

export async function GET() {
    const client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: true,
        apiVersion: '2024-01-01',
    })

    try {
        const data = await client.fetch(
            `*[_type == "breakingNews" && active == true] | order(publishedAt desc)[0...5] {
                text,
                href
            }`
        )
        const scrubbedData = data.map((item: any) => ({
            ...item,
            text: scrubBrandNames(item.text)
        }))

        // Deduplicate breaking news entries
        const uniqueData: any[] = [];
        const seenTexts = new Set();
        for (const item of scrubbedData) {
            const normalizedText = normalizeText(item.text);

            if (!seenTexts.has(normalizedText) && item.text) {
                uniqueData.push(item);
                seenTexts.add(normalizedText);
            }
        }

        return NextResponse.json(uniqueData)
    } catch (err) {
        console.error('[Breaking News API Error]', err)
        return NextResponse.json([])
    }
}
