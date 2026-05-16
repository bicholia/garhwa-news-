'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface NewsGridProps {
    title: string
    articles: any[]
    link?: string
    limit?: number
    moreText?: string
    variant?: 'standard' | 'mixed' | 'list'
}

export default function NewsGrid({ 
    title, 
    articles, 
    link, 
    limit = 6, 
    moreText = "View More",
    variant = 'standard'
}: NewsGridProps) {
    if (!articles || articles.length === 0) return null
    
    const displayArticles = articles.slice(0, limit)
    const featuredArticle = displayArticles[0]
    const remainingArticles = displayArticles.slice(1)

    const resolveImageUrl = (article: any, w = 400, h = 250) => {
        if (!article) return null;
        if (article.image_url) return article.image_url;
        if (typeof article.featureImage === 'string') return article.featureImage;
        if (article.featureImage?.asset?._ref) {
            try {
                return urlFor(article.featureImage).width(w).height(h).url();
            } catch (e) {
                // Fallback handled below
            }
        }
        
        // Fallback to random placeholder
        const id = article._id || article.id || article.title || '';
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % 4) + 1;
        return `/placeholder_${index}.png`;
    };

    const renderCard = (article: any, index: number, isSmall: boolean = false) => {
        const imageUrl = resolveImageUrl(article, isSmall ? 100 : 400, isSmall ? 80 : 250);
        const date = article.publishedAt || article.published_at;

        return (
            <motion.div
                key={article._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
            >
                <Link 
                    href={`/news/${article.slug?.current || article.slug}`}
                    className={`group flex ${isSmall ? 'flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 last:border-0' : 'flex-col'}`}
                >
                {/* Image Section */}
                <div className={`shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-premium ${isSmall ? 'w-full sm:w-28 h-40 sm:h-20' : 'aspect-video mb-5'}`}>
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                            <Clock size={isSmall ? 18 : 36} />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1">
                    <h3 className={`font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-red transition-all duration-300 serif-font ${isSmall ? 'text-[14px] line-clamp-2' : 'text-[17px] line-clamp-3'}`}>
                        {article.title}
                    </h3>
                    {!isSmall && (
                        <div className="mt-4 flex items-center gap-3 text-[11px] text-news-muted font-bold uppercase tracking-[0.1em]" suppressHydrationWarning>
                            <span className="text-brand-red">ThinkIndia News</span>
                            <span className="opacity-30">•</span>
                            <span>{date ? new Date(date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) : 'Today'}</span>
                        </div>
                    )}
                </div>
                </Link>
            </motion.div>
        )
    }

    return (
        <div className="mb-10 md:mb-14">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 mb-6 md:mb-10 pb-4">
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter serif-font flex items-center gap-4">
                    <span className="w-1 h-10 bg-gradient-to-b from-brand-red to-brand-gold inline-block rounded-full" />
                    {title}
                </h2>
                {link && (
                    <Link href={link} className="text-[9px] font-black text-brand-red hover:text-brand-navy dark:hover:text-white flex items-center gap-2 uppercase tracking-[0.2em] transition-colors">
                        Archive <ArrowRight size={12} />
                    </Link>
                )}
            </div>

            {/* Layout Variants */}
            {variant === 'standard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {displayArticles.map((article, index) => renderCard(article, index))}
                </div>
            )}

            {variant === 'mixed' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LHS: Large Featured */}
                    <motion.div
                        className="lg:col-span-12 xl:col-span-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link 
                            href={`/news/${featuredArticle.slug?.current || featuredArticle.slug}`}
                            className="group flex flex-col md:flex-row gap-8 bg-gray-50 dark:bg-white/5 p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="md:w-1/2 aspect-video overflow-hidden rounded-[20px] bg-gray-200 relative">
                                {resolveImageUrl(featuredArticle, 600, 400) ? (
                                    <img 
                                        src={resolveImageUrl(featuredArticle, 600, 400) || ''} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-navy flex items-center justify-center text-brand-gold/20">
                                        <Clock size={50} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-brand-red text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg">Bureau Elite</div>
                            </div>
                            <div className="md:w-1/2 flex flex-col justify-center py-2">
                                <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.3em] mb-3">Featured Report</span>
                                <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-[1.15] mb-5 group-hover:text-brand-red transition-colors serif-font">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6 font-medium">
                                    {featuredArticle.excerpt || featuredArticle.description || "In-depth investigative report from ThinkIndia.press special unit."}
                                </p>
                                <div className="flex items-center gap-2 text-[9px] font-black text-brand-navy dark:text-white uppercase tracking-[0.2em]">
                                    Full Investigation <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* RHS: List */}
                    <div className="lg:col-span-12 xl:col-span-4 flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                        {remainingArticles.slice(0, 5).map((article, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link 
                                    href={`/news/${article.slug?.current || article.slug}`}
                                    className="py-5 flex gap-5 group"
                                >
                                    <span className="text-4xl font-black text-gray-100 dark:text-white/10 group-hover:text-brand-red/30 transition-colors serif-font italic w-10 shrink-0">0{index + 2}</span>
                                    <div className="space-y-1">
                                        <h4 className="text-base font-bold text-gray-800 dark:text-white leading-tight line-clamp-3 group-hover:text-brand-red transition-colors serif-font">
                                            {article.title}
                                        </h4>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bureau Wire</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {variant === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                    {displayArticles.map((article, index) => renderCard(article, index, true))}
                </div>
            )}
        </div>
    )
}
