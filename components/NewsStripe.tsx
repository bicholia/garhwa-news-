import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { TrendingUp, Clock } from 'lucide-react'

interface NewsStripeProps {
    articles: any[]
    title?: string
    variant?: 'horizontal' | 'vertical'
}

export default function NewsStripe({ articles, title, variant = 'horizontal' }: NewsStripeProps) {
    if (!articles || articles.length === 0) return null;

    if (variant === 'vertical') {
        return (
            <div className="bg-white border border-gray-100 p-6 rounded-md shadow-premium hover:shadow-premium-hover transition-all duration-500">
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
        <div className="my-10 bg-white border border-gray-100 rounded-md overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500">
            <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-red flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-brand-red rounded-full" /> {title || 'Live Updates'}
                </span>
                <span className="text-[9px] font-bold text-news-muted uppercase tracking-widest opacity-60">ThinkIndia News Briefing</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {articles.slice(0, 3).map((article, i) => {
                    const imageUrl = article.featureImage?.asset?._ref && article.featureImage.asset._ref.startsWith('image-') 
                        ? urlFor(article.featureImage).width(150).height(100).url() 
                        : null;
                    return (
                        <Link 
                            key={i} 
                            href={`/news/${article.slug}`} 
                            className="group flex gap-5 items-center"
                        >
                            <div className="shrink-0 w-28 h-20 bg-gray-100 rounded-md overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-md">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-navy/5 flex items-center justify-center text-gray-300">
                                        <Clock size={24} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-brand-red transition-all duration-300 line-clamp-2 serif-font">
                                    {article.title}
                                </h4>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-brand-red/30 rounded-full" />
                                    <span className="text-[10px] font-bold text-news-muted uppercase tracking-widest opacity-70">Flash Update</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
