import Link from 'next/link'
import ArticleCard from './ArticleCard'
import SectionHeading from './SectionHeading'

interface NewsGridProps {
    title: string;
    articles: any[];
    link?: string;
    limit?: number;
    showExcerpt?: boolean;
}

export default function NewsGrid({ title, articles, link, limit, showExcerpt = true }: NewsGridProps) {
    const displayArticles = limit ? articles.slice(0, limit) : articles;

    if (!displayArticles || displayArticles.length === 0) return null;

    return (
        <section className="mb-16">
            <SectionHeading title={title} link={link} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayArticles.map((article: any, idx: number) => (
                    <ArticleCard
                        key={article._id || article.id}
                        article={article}
                        priority={idx < 3}
                    />
                ))}
            </div>
            
            {limit && articles.length > limit && link && (
                <div className="mt-10 text-center">
                    <Link 
                        href={link} 
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-brand-navy font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-brand-navy hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        Explore More Reports <span className="text-brand-gold">&rarr;</span>
                    </Link>
                </div>
            )}
        </section>
    )
}
