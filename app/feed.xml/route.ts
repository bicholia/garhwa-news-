import { client } from '@/lib/sanity'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const articles = await client.fetch(`*[_type == "article" && defined(slug.current) && !(slug.current match "undefined*")] | order(publishedAt desc)[0...20] {
            title,
            "slug": slug.current,
            excerpt,
            publishedAt,
            author
        }`)

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinkindia.press'

        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>ThinkIndia.press News</title>
    <link>${siteUrl}</link>
    <description>Your premium source for regional and national news from Garhwa, Palamu, and Jharkhand.</description>
    <language>hi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${articles?.map((article: any) => {
        const description = article.excerpt || article.title;
        return `
    <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${siteUrl}/news/${article.slug}</link>
        <guid isPermaLink="true">${siteUrl}/news/${article.slug}</guid>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        <description><![CDATA[${description}]]></description>
    </item>`;
    }).join('')}
</channel>
</rss>`

        return new NextResponse(rss, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        })
    } catch (error) {
        console.error('RSS Feed generation error:', error)
        return new NextResponse('Error generating feed', { status: 500 })
    }
}
