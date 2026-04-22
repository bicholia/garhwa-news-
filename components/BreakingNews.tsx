import { client } from '@/lib/sanity'
import NextLink from 'next/link'
import { TrendingUp } from 'lucide-react'
import { scrubBrandNames, normalizeText, scrubSlug } from '@/lib/safety'

async function getBreakingNews() {
    const news = await client.fetch(
        `*[_type == "article"] | order(publishedAt desc)[0...20] {
        title,
        "slug": slug.current
      }`
    )
    return (news || [])
        .filter((item: any) => item.title && item.slug)
        .map((item: any) => ({
            ...item,
            title: scrubBrandNames(item.title),
            slug: scrubSlug(item.slug)
        }))
}

export default async function BreakingNews() {
    const news = await getBreakingNews()

    if (!news || news.length === 0) return null

    // Use a clean set of unique news
    const displayNews: any[] = [];
    const seenTitles = new Set();
    const seenSlugs = new Set();

    for (const item of news) {
        if (displayNews.length >= 8) break;
        const norm = normalizeText(item.title);
        if (!seenTitles.has(norm) && !seenSlugs.has(item.slug)) {
            displayNews.push(item);
            seenTitles.add(norm);
            seenSlugs.add(item.slug);
        }
    }

    return (
        <div className="bg-brand-navy border-b border-white/5 text-white h-12 flex items-center overflow-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" suppressHydrationWarning>
            <div className="flex items-center h-full w-full" suppressHydrationWarning>
                <div className="flex items-center gap-2 bg-brand-gold px-6 h-full z-10 font-bold text-[10px] uppercase tracking-[0.2em] shrink-0 whitespace-nowrap shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
                    <TrendingUp size={14} className="animate-pulse" strokeWidth={3} />
                    Bureau Alert
                </div>
                
                <div className="flex-1 overflow-hidden relative h-full flex items-center ml-6">
                    <div className="animate-marquee whitespace-nowrap flex gap-12 text-[13px] font-bold tracking-normal py-1">
                        {/* Duplicate content for seamless infinite scroll effect */}
                        {[...displayNews, ...displayNews, ...displayNews].map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-8 group">
                                <NextLink href={`/news/${item.slug}`} className="transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40 group-hover:bg-brand-gold group-hover:scale-125 transition-all" />
                                    {item.title}
                                </NextLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
