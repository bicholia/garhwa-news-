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
        <article className="group bg-white dark:bg-[#0a0a0a] rounded-[24px] border border-gray-100 dark:border-white/5 shadow-card hover:shadow-premium transition-all duration-700 flex flex-col h-full transform hover:-translate-y-1">
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
                            <div className="border border-brand-red/30 p-4 rounded-xl">
                                <div className="text-[7px] text-brand-red font-black uppercase tracking-[0.4em] mb-1">ThinkIndia Bureau</div>
                                <div className="text-white font-black text-xl serif-font tracking-tighter">DIGITAL BUREAU</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4 lg:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 text-[8px] font-black uppercase tracking-[0.2em] text-brand-red mb-2">
                        <span className="flex items-center gap-1" suppressHydrationWarning><Clock size={10} /> <span suppressHydrationWarning>{formattedDate}</span></span>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className="text-gray-400">{article.author?.name || 'Bureau Desk'}</span>
                    </div>

                    <h2 className="text-[16px] lg:text-xl font-black text-brand-navy dark:text-white leading-snug mb-2 transition-colors duration-300 line-clamp-3 serif-font group-hover:text-brand-red">
                        {truncate(article.title, 120)}
                    </h2>

                    <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 font-medium opacity-80 hidden lg:block">
                        {truncate(article.excerpt || '', 180)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-white/20 hidden lg:block">Serial #{reportId}</span>
                            <ShareButton 
                                title={article.title} 
                                slug={slug} 
                                excerpt={article.excerpt} 
                                className="mt-1"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center text-brand-navy dark:text-white group-hover:bg-brand-navy group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}

