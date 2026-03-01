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
        <section style={{ marginBottom: '3rem' }}>
            <SectionHeading title={title} link={link} />
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
            }}>
                {displayArticles.map((article: any, idx: number) => (
                    <ArticleCard
                        key={article._id}
                        article={article}
                        priority={idx < 2}
                    />
                ))}
            </div>
            {limit && articles.length > limit && link && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href={link} style={{
                        display: 'inline-block',
                        padding: '10px 24px',
                        background: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '30px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                    }} className="hover:bg-red-600 hover:text-white">
                        देखें सभी खबरें →
                    </Link>
                </div>
            )}
        </section>
    )
}
