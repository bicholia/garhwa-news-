import { client } from '@/lib/sanity'
import { getAllNews } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const query = `
            *[_type == "article" && defined(slug.current) && !(slug.current match "undefined*")] | order(publishedAt desc)[0...100] {
                title,
                "slug": slug.current,
                publishedAt
            }
        `
        
        const [snArticles, pgArticles] = await Promise.all([
            client.fetch(query),
            getAllNews(100)
        ])

        const mergedArticles = [...(snArticles || [])];
        const seenSlugs = new Set(snArticles?.map((a: any) => a.slug) || []);

        if (pgArticles && pgArticles.length > 0) {
            pgArticles.forEach((a: any) => {
                if (!seenSlugs.has(a.slug)) {
                    mergedArticles.push({
                        title: a.title,
                        slug: a.slug,
                        publishedAt: a.published_at || a.publishedAt || new Date().toISOString()
                    });
                    seenSlugs.add(a.slug);
                }
            });
        }

        // Sort by date desc and limit to 100 for Google News
        mergedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const finalArticles = mergedArticles.slice(0, 100);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinkindia.press'

        // Google News XML format
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    ${finalArticles.map((article: any) => {
        const title = (article.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const date = new Date(article.publishedAt).toISOString();
        return `
    <url>
        <loc>${siteUrl}/news/${article.slug}</loc>
        <news:news>
            <news:publication>
                <news:name>ThinkIndia News</news:name>
                <news:language>hi</news:language>
            </news:publication>
            <news:publication_date>${date}</news:publication_date>
            <news:title>${title}</news:title>
        </news:news>
    </url>`;
    }).join('')}
</urlset>`

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=600, stale-while-revalidate',
            },
        })
    } catch (error) {
        console.error('Google News Sitemap generation error:', error)
        return new NextResponse('Error generating sitemap', { status: 500 })
    }
}
