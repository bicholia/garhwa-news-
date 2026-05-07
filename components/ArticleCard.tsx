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
        <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
            <Link href={`/news/${slug}`} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    {hasImage ? (
                        <Image
                            src={imageUrl}
                            alt={article.title}
                            fill
                            priority={priority}
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-brand-navy flex flex-col items-center justify-center p-6 text-center">
                            <div className="border-2 border-brand-gold/50 p-4 rounded-lg">
                                <div className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.3em] mb-1">ThinkIndia.press</div>
                                <div className="text-white font-bold text-xl">TOP NEWS</div>
                            </div>
                        </div>
                    )}
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Premium News
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-3">
                        <span className="flex items-center gap-1"><Clock size={12} /> {formattedDate}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {article.author?.name || 'By Desk'}</span>
                    </div>

                    <h2 className="text-lg lg:text-2xl font-bold text-brand-navy leading-[1.2] mb-3 transition-colors duration-300 line-clamp-2 mt-2">
                        {truncate(article.title, 120)}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                        {truncate(article.excerpt || '', 180)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/40">Report No. {reportId}</span>
                            <ShareButton 
                                title={article.title} 
                                slug={slug} 
                                excerpt={article.excerpt} 
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                            Read Full Report <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}

