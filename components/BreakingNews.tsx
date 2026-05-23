import { client, urlFor } from '@/lib/sanity'
import NextLink from 'next/link'
import { TrendingUp, Globe } from 'lucide-react'
import { scrubBrandNames, normalizeText, scrubSlug } from '@/lib/safety'

async function getBreakingNews() {
    const news = await client.fetch(
        `*[_type == "article"] | order(publishedAt desc)[0...20] {
        title,
        "slug": slug.current,
        featureImage
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
        if (displayNews.length >= 5) break;
        const norm = normalizeText(item.title);
        if (!seenTitles.has(norm) && !seenSlugs.has(item.slug)) {
            displayNews.push(item);
            seenTitles.add(norm);
            seenSlugs.add(item.slug);
        }
    }

    return (
        <div className="bg-brand-navy border-b border-white/5 text-white h-10 flex items-center overflow-hidden w-full" suppressHydrationWarning>
            <div className="flex items-center h-full w-full" suppressHydrationWarning>
                <div className="hidden lg:flex items-center gap-2 bg-brand-red px-6 h-full z-10 font-bold text-[10px] uppercase tracking-[0.2em] shrink-0 whitespace-nowrap shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
                    <TrendingUp size={14} className="animate-pulse" strokeWidth={3} />
                    Bureau Alert
                </div>
                
                <div className="flex-1 overflow-hidden relative h-full flex items-center ml-4 lg:ml-6">
                    <div className="animate-marquee whitespace-nowrap flex gap-12 text-[13px] font-bold tracking-normal py-1" style={{ animationDuration: '40s' }}>
                        {/* Duplicate content for seamless infinite scroll effect */}
                        {[...displayNews, ...displayNews, ...displayNews].map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-8 group">
                                <NextLink href={`/news/${item.slug}`} className="transition-colors duration-300 flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0 hidden lg:block">
                                        {item.featureImage ? (
                                            <img 
                                                src={urlFor(item.featureImage).width(40).height(40).url()} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-brand-red to-brand-navy flex items-center justify-center text-[7px] font-black uppercase tracking-tighter">NI</div>
                                        )}
                                    </div>
                                    <span className="max-w-[300px] truncate">{item.title}</span>
                                </NextLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
