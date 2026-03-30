import { client } from '@/lib/sanity'
import NextLink from 'next/link'
import { TrendingUp } from 'lucide-react'

async function getBreakingNews() {
    const news = await client.fetch(
        `*[_type == "article"] | order(publishedAt desc)[0...10] {
        title,
        "slug": slug.current
      }`
    )
    return news
}

export default async function BreakingNews() {
    const news = await getBreakingNews()

    if (!news || news.length === 0) return null

    return (
        <div className="bg-brand-navy border-b border-brand-navy-light text-white h-12 flex items-center overflow-hidden">
            <div className="container flex items-center h-full">
                <div className="flex items-center gap-2 bg-brand-gold px-6 h-full z-10 font-black text-[10px] uppercase tracking-[0.2em] italic shrink-0 whitespace-nowrap shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
                    <TrendingUp size={14} className="animate-pulse" />
                    Global Alert
                </div>
                
                <div className="flex-1 overflow-hidden relative h-full flex items-center ml-6">
                    <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm font-bold tracking-tight">
                        {[...news, ...news].map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <NextLink href={`/news/${item.slug}`} className="hover:text-brand-gold transition-colors duration-300">
                                    {item.title}
                                </NextLink>
                                <span className="text-brand-gold italic opacity-50 font-black">/ /</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
