import { NextResponse } from 'next/server'
import { sendToTelegram } from '@/lib/telegram'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Webhook received for article ID:', body._id)

        // Only process published articles (not drafts)
        if (body._type === 'article' && !body._id.startsWith('drafts.')) {

            // Fetch full article details including category and slug
            const article = await client.fetch(`
        *[_id == $_id][0]{
          title,
          excerpt,
          "slug": slug,
          category->{ "slug": slug, name },
          district
        }
      `, { _id: body._id })

            if (article && article.slug) {
                await sendToTelegram(article)
            } else {
                console.warn('Article data incomplete for Telegram:', body._id)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Telegram Webhook Route Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
