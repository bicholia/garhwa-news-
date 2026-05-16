import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Clock, User, ArrowRight } from 'lucide-react'
import ShareButton from './ShareButton'

interface Props {
    article: any
    priority?: boolean
}

export default function ArticleCard({ article, priority = false }: Props) {
    const publishedDate = article.publishedAt || article.published_at
    const formattedDate = new Date(publishedDate).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    // BUG-02 FIX: Deterministic report number instead of Math.random()
    const getReportNumber = (text: string) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 900) + 100;
    };
    const reportId = getReportNumber(article.title || '');

    const getImageUrl = () => {
        if (article.image_url) return article.image_url;
        if (typeof article.featureImage === 'string') return article.featureImage;
        if (article.featureImage?.asset?._ref) {
            try {
                return urlFor(article.featureImage).width(800).height(450).url();
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const imageUrl = getImageUrl();
    const hasImage = !!imageUrl;

    const truncate = (text: any, length: number) => {
        if (!text || typeof text !== 'string') return '';
        const cleanText = text.replace(/[#*`]/g, '');
        return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText;
    };

    const slug = typeof article.slug === 'string' ? article.slug : article.slug?.current

    return (
        <article className="group bg-white dark:bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-premium hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full transform hover:-translate-y-2">
            <Link href={`/news/${slug}`} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    {hasImage ? (
                        <Image
                            src={imageUrl}
                            alt={article.title}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-brand-navy flex flex-col items-center justify-center p-6 text-center">
                            <div className="border border-brand-gold/30 p-6 rounded-2xl">
                                <div className="text-[8px] text-brand-gold font-black uppercase tracking-[0.4em] mb-2">ThinkIndia Bureau</div>
                                <div className="text-white font-black text-2xl serif-font tracking-tighter">DIGITAL BUREAU</div>
                            </div>
                        </div>
                    )}
                    {/* Badge Overlay */}
                    <div className="absolute top-6 left-6">
                        <span className="bg-brand-navy/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl border border-white/10">
                            Bureau Report
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-brand-red mb-4">
                        <span className="flex items-center gap-2"><Clock size={12} /> {formattedDate}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-2 text-gray-400">{article.author?.name || 'Bureau Desk'}</span>
                    </div>

                    <h2 className="text-xl lg:text-2xl font-black text-brand-navy dark:text-white leading-[1.2] mb-4 transition-colors duration-300 line-clamp-3 serif-font group-hover:text-brand-red">
                        {truncate(article.title, 120)}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-10 line-clamp-2 font-medium opacity-80">
                        {truncate(article.excerpt || '', 180)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-white/20">Serial #{reportId}</span>
                            <ShareButton 
                                title={article.title} 
                                slug={slug} 
                                excerpt={article.excerpt} 
                                className="mt-2"
                            />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-white/10 flex items-center justify-center text-brand-navy dark:text-white group-hover:bg-brand-navy group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}

