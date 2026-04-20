import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { TrendingUp } from 'lucide-react'

interface NewsStripeProps {
    articles: any[]
    title?: string
    variant?: 'horizontal' | 'vertical'
}

export default function NewsStripe({ articles, title, variant = 'horizontal' }: NewsStripeProps) {
    if (!articles || articles.length === 0) return null;

    if (variant === 'vertical') {
        return (
            <div className="bg-[#fcfcfc] border border-gray-100 p-5 rounded-sm shadow-sm">
                {title && (
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-red mb-5 flex items-center gap-2">
                        <TrendingUp size={14} /> {title}
                    </h3>
                )}
                <div className="space-y-5">
                    {articles.map((s, i) => (
                        <Link key={i} href={`/news/${s.slug}`} className="group block">
                             <div className="flex gap-4 items-start">
                                <span className="text-xl font-black text-gray-200 group-hover:text-brand-red transition-colors italic shrink-0 w-6">
                                    {i + 1}
                                </span>
                                <h4 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-brand-red transition-colors line-clamp-3 serif-font">
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
        <div className="my-8 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red flex items-center gap-2">
                    <span className="w-1 h-3 bg-brand-red" /> {title || 'Live Updates'}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Digital Grid Briefing</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {articles.slice(0, 3).map((article, i) => {
                    const imageUrl = article.featureImage ? urlFor(article.featureImage).width(150).height(100).url() : null;
                    return (
                        <Link 
                            key={i} 
                            href={`/news/${article.slug}`} 
                            className="group flex gap-4 items-center"
                        >
                            <div className="shrink-0 w-24 h-16 bg-gray-100 rounded-sm overflow-hidden relative">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-navy/5" />
                                )}
                                <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold text-black leading-tight group-hover:text-brand-red transition-colors line-clamp-2 serif-font">
                                    {article.title}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Quick Read</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
