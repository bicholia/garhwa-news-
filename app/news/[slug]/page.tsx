import { client, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import AdBanner from '@/components/AdBanner'

export const revalidate = 0 // Fetch fresh news every time

async function getArticle(slug: string) {
    const query = `* [_type == "article" && slug.current == $slug][0] {
    title,
        excerpt,
        featureImage,
        body,
        publishedAt,
        _updatedAt,
        localAd,
        "author": author -> { name, slug },
            "category": category -> {
                "slug": slug.current,
                "name": name
            },
                district,
                "related": * [_type == "article" && category._ref == ^.category._ref && slug.current != $slug] | order(publishedAt desc)[0...3] {
        _id,
            title,
            slug,
            featureImage,
            publishedAt
    }
} `
    return await client.fetch(query, { slug })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) return {}
    return {
        title: `${article.title} | गढ़वा पलामू न्यूज़`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: article.featureImage?.asset ? [urlFor(article.featureImage).url()] : [],
        },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) notFound()

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('hi-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    // JSON-LD for Google News
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        image: article.featureImage?.asset ? urlFor(article.featureImage).url() : undefined,
        datePublished: article.publishedAt,
        dateModified: article._updatedAt || article.publishedAt,
        author: [
            {
                '@type': 'Person',
                name: article.author?.name || 'संवाददाता',
                url: article.author?.slug ? `https://garhwapalamunews.com/author/${article.author.slug.current}` : undefined,
            },
        ],
    }

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="container" style={{ maxWidth: 880, paddingTop: '2rem' }}>
                <article style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                    {/* Feature Image */}
                    {article.featureImage?.asset && (
                        <div style={{ position: 'relative', width: '100%', height: 450 }}>
                            <Image
                                src={urlFor(article.featureImage).width(1200).height(630).url()}
                                alt={article.title}
                                fill
                                priority
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <div style={{ padding: '2rem' }}>
                        {/* Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <Link href={`/category/${article.category?.slug || 'news'}`} style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none' }}>
                                {(article.category?.name || 'NEWS').toUpperCase()}
                            </Link>
                            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>|</span>
                            <span style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>{formattedDate}</span>
                        </div>

                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            {article.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#374151' }}>
                                {article.author?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                                    {article.author ? (
                                        <Link href={`/author/${article.author.slug.current}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-red-600">
                                            {article.author.name}
                                        </Link>
                                    ) : 'संवाददाता'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>NR DAILY NEWS BUREAU</div>
                            </div>
                        </div>

                        {/* Top Ad — slot must match Sanity globalAd.slot value exactly */}
                        <AdBanner slot="article_top_leaderboard" width={728} height={90} />

                        {/* Local Sponsored Ad Banner */}
                        {article.localAd?.image?.asset && article.localAd?.isActive !== false && (
                            <div style={{ margin: '2rem 0', textAlign: 'center', background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>विज्ञापन (Advertisement)</span>
                                {article.localAd.url ? (
                                    <a href={article.localAd.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                                        <Image
                                            src={urlFor(article.localAd.image).width(800).url()}
                                            alt="Sponsored Advertisement"
                                            width={800}
                                            height={200}
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                            unoptimized
                                        />
                                    </a>
                                ) : (
                                    <div style={{ display: 'inline-block' }}>
                                        <Image
                                            src={urlFor(article.localAd.image).width(800).url()}
                                            alt="Sponsored Advertisement"
                                            width={800}
                                            height={200}
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose max-w-none" style={{ color: '#374151', lineHeight: 1.8, fontSize: '1.1rem', fontFamily: 'inherit' }}>
                            {article.body?.length > 0 && typeof article.body[0]?.children?.[0]?.text === 'string' && article.body[0].children[0].text.trimStart().startsWith('<') ? (
                                // HTML content from admin form — render directly
                                <div dangerouslySetInnerHTML={{ __html: article.body.map((b: any) => b.children?.map((c: any) => c.text).join('') ?? '').join('\n') }} />
                            ) : (
                                // Proper Sanity portable text
                                <PortableText value={article.body} />
                            )}
                        </div>

                        {/* Bottom Ad */}
                        <AdBanner slot="article_below_content" width={300} height={250} />

                        {/* Share */}
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>शेयर करें:</h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Facebook', icon: <FaFacebookF size={18} />, bg: '#1877f2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://garhwapalamunews.com/news/${decodedSlug}`)}` },
                                    { label: 'Twitter', icon: <FaTwitter size={18} />, bg: '#1da1f2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://garhwapalamunews.com/news/${decodedSlug}`)}&text=${encodeURIComponent(article.title)}` },
                                    { label: 'WhatsApp', icon: <FaWhatsapp size={20} />, bg: '#25d366', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + `https://garhwapalamunews.com/news/${decodedSlug}`)}` },
                                    { label: 'Telegram', icon: <FaTelegramPlane size={18} />, bg: '#0088cc', href: `https://t.me/share/url?url=${encodeURIComponent(`https://garhwapalamunews.com/news/${decodedSlug}`)}&text=${encodeURIComponent(article.title)}` }
                                ].map(item => (
                                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" title={`Share on ${item.label}`}
                                        className="hover:opacity-85 transition-opacity"
                                        style={{ background: item.bg, color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related */}
                {article.related && article.related.length > 0 && (
                    <section style={{ marginTop: '4rem' }}>
                        <SectionHeading title="ये भी पढ़ें" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                            {article.related.map((item: any) => (
                                <Link key={item._id} href={`/news/${item.slug.current}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                        {item.featureImage?.asset && (
                                            <div style={{ position: 'relative', height: 160, width: '100%' }}>
                                                <Image
                                                    src={urlFor(item.featureImage).width(400).height(250).url()}
                                                    alt={item.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: '1rem' }}>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.4 }} className="hover:text-red-600">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}
