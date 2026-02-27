import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { sendToTelegram } from '@/lib/telegram'

export const maxDuration = 60 // Allow up to 60 seconds for execution

export async function GET() {
    try {
        // Fetch articles published in the last 60 minutes
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

        const articles = await client.fetch(`
      *[_type == "article" && publishedAt > $oneHourAgo] | order(publishedAt desc){
        title,
        excerpt,
        "slug": slug,
        category->{ "slug": slug, name },
        district
      }
    `, { oneHourAgo })

        console.log(`Cron: Found ${articles.length} articles to check.`)

        for (const article of articles) {
            if (article.slug) {
                await sendToTelegram(article)
                // Rate limit protection
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        return NextResponse.json({
            status: 'success',
            processed: articles.length,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Telegram Cron Job Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
