import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { TrendingUp } from 'lucide-react'

const DigitalBureauPlaceholder = () => (
    <div className="w-full h-full bg-[#0B1120] flex flex-col items-center justify-center">
        <div className="border border-brand-red/40 rounded-lg px-3 py-2 text-center">
            <div className="text-brand-red font-black uppercase tracking-[0.4em] mb-1 text-[6px]">ThinkIndia Bureau</div>
            <div className="text-white font-black serif-font tracking-tighter text-sm">DIGITAL BUREAU</div>
        </div>
    </div>
);

interface NewsStripeProps {
    articles: any[]
    title?: string
    variant?: 'horizontal' | 'vertical'
}

export default function NewsStripe({ articles, title, variant = 'horizontal' }: NewsStripeProps) {
    if (!articles || articles.length === 0) return null;

    if (variant === 'vertical') {
        return (
            <div className="bg-white/60 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 p-6 lg:p-8 rounded-[20px] shadow-premium transition-all duration-500">
                {title && (
                    <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-brand-red mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
                        <TrendingUp size={16} /> {title}
                    </h3>
                )}
                <div className="space-y-6">
                    {articles.map((s, i) => (
                        <Link key={i} href={`/news/${s.slug}`} className="group block">
                             <div className="flex gap-4 items-start">
                                <span className="text-2xl font-black text-gray-100 group-hover:text-brand-red/20 transition-all duration-300 italic shrink-0 w-8">
                                    {i + 1}
                                </span>
                                <h4 className="text-[14px] font-bold text-gray-800 leading-snug group-hover:text-brand-red transition-all duration-300 line-clamp-3 serif-font">
                                    {s.title}
                                </h4>
                             </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="my-10 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-[20px] overflow-hidden shadow-premium transition-all duration-500">
            <div className="bg-gray-50/50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-red flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-brand-red rounded-full" /> {title || 'Live Updates'}
                </span>
                <span className="text-[9px] font-bold text-news-muted uppercase tracking-widest opacity-60">ThinkIndia News Briefing</span>
            </div>
            <div className="p-5 lg:p-8 flex lg:grid lg:grid-cols-3 gap-6 lg:gap-10 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar">
                {articles.slice(0, 3).map((article, i) => {
                    const imageUrl = article.featureImage?.asset?._ref && article.featureImage.asset._ref.startsWith('image-') 
                        ? urlFor(article.featureImage).width(150).height(100).url() 
                        : null;
                    return (
                        <Link 
                            key={i} 
                            href={`/news/${article.slug}`} 
                            className="group flex gap-6 items-center shrink-0 w-[85%] lg:w-auto snap-start"
                        >
                            <div className="shrink-0 w-28 h-20 bg-gray-100 rounded-md overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-md">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    <DigitalBureauPlaceholder />
                                )}
                                <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-red transition-all duration-300 line-clamp-2 serif-font">
                                    {article.title}
                                </h4>
                                {/* Flash Update removed as per user request */}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
