import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface Props {
    article: any
    priority?: boolean
}

export default function ArticleCard({ article, priority = false }: Props) {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const hasImage = article.featureImage?.asset

    return (
        <article className="card shadow-sm hover:shadow-md transition-shadow duration-300" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Link href={`/news/${article.slug.current}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Image or Placeholder */}
                <div style={{ position: 'relative', height: 200, width: '100%', overflow: 'hidden', flexShrink: 0 }}>
                    {hasImage ? (
                        <Image
                            src={urlFor(article.featureImage).width(600).height(400).url()}
                            alt={article.title}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}>
                            <div style={{
                                background: '#b91c1c', color: 'white',
                                padding: '6px 12px', borderRadius: '6px',
                                fontWeight: 900, fontSize: '1rem', lineHeight: 1.1, textAlign: 'center'
                            }}>
                                <span style={{ display: 'block', color: '#fde68a', fontSize: '0.55rem', letterSpacing: '2px', fontWeight: 700 }}>NR DAILY</span>
                                NEWS
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>गढ़वा पलामू न्यूज़</span>
                        </div>
                    )}
                </div>

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#111827',
                        marginBottom: '0.6rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }} className="hover:text-red-700">
                        {article.title}
                    </h2>
                    <p style={{
                        fontSize: '0.85rem',
                        color: '#4b5563',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {article.excerpt}
                    </p>
                    <div style={{
                        marginTop: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        color: '#6b7280',
                        fontWeight: 600
                    }}>
                        <span>{formattedDate}</span>
                        <span style={{ color: '#dc2626' }}>{article.author?.name || 'संवाददाता'}</span>
                    </div>
                </div>
            </Link>
        </article>
    )
}
