import { client, urlFor } from '@/lib/sanity'
import { getNewsBySlug, getRelatedNews, mergeAndSortNews } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import AdBanner from '@/components/AdBanner'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 0 // Fetch fresh news every time

async function getArticle(slug: string) {
    const postgresArticle: any = await getNewsBySlug(slug)
    
    if (postgresArticle) {
        // Fetch related from both
        const [pgRelated, snRelated]: [any[], any[]] = await Promise.all([
            getRelatedNews(postgresArticle.category, postgresArticle.district, slug, 3),
            client.fetch(`*[_type == "article" && district == $district] | order(publishedAt desc)[0...3] {
                _id, title, "slug": slug.current, featureImage, publishedAt
            }`, { district: postgresArticle.district })
        ])
        
        return {
            ...postgresArticle,
            related: mergeAndSortNews(pgRelated, snRelated, 3)
        }
    }

    // Fallback to Sanity
    const query = `* [_type == "article" && slug.current == $slug][0] {
        title,
        excerpt,
        featureImage,
        body,
        location,
        tags,
        updates,
        publishedAt,
        _updatedAt,
        localAd,
        "author": author -> { name, slug, image, bio },
        "category": category -> {
            "slug": slug.current,
            "name": name
        },
        district,
        seoKeywords,
        "related": * [_type == "article" && category._ref == ^.category._ref && slug.current != $slug] | order(publishedAt desc)[0...3] {
            _id,
            title,
            "slug": slug.current,
            featureImage,
            publishedAt
        }
    } `
    const sanityArticle: any = await client.fetch(query, { slug })
    
    if (sanityArticle) {
        const pgRelated = await getRelatedNews(sanityArticle.category?.name, sanityArticle.district, slug, 3)
        sanityArticle.related = mergeAndSortNews(pgRelated, sanityArticle.related, 3)
    }
    
    return sanityArticle
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) return {}
    
    const domain = 'https://garhwapalamunews.com'
    const imageUrl = (article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(1200).height(630).url() : `${domain}/og-image.png`))

    return {
        title: `${article.title} | गढ़वा पलामू न्यूज़`,
        description: article.excerpt?.substring(0, 160),
        keywords: article.seoKeywords || article.seo_keywords || `${article.district}, Garhwa News, Palamu News, Jharkhand News, ${article.category?.name}, गढ़वा समाचार, पलामू न्यूज़, ${article.title}`,
        alternates: {
            canonical: `${domain}/news/${slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${domain}/news/${slug}`,
            siteName: 'NR Daily News',
            locale: 'hi_IN',
            type: 'article',
            publishedTime: article.publishedAt || article.published_at,
            authors: [article.author?.name || 'NR Daily News Bureau'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [imageUrl],
        },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) notFound()

    const publishedDate = article.publishedAt || article.published_at
    const formattedDate = new Date(publishedDate).toLocaleDateString('hi-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    // Structured Data for SEO (GEO/AEO)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'NewsArticle',
                headline: article.title,
                description: article.excerpt,
                image: (article.featureImage?.asset || article.image_url) ? [
                    article.image_url || urlFor(article.featureImage).width(1200).height(630).url()
                ] : [],
                datePublished: article.publishedAt || article.published_at,
                dateModified: article._updatedAt || article.publishedAt || article.published_at,
                author: [{
                    '@type': 'Person',
                    name: article.author?.name || 'संवाददाता',
                    jobTitle: 'Journalist',
                    url: article.author?.slug ? `https://garhwapalamunews.com/author/${article.author.slug.current}` : undefined,
                }],
                publisher: {
                    '@type': 'NewsMediaOrganization',
                    name: 'NR Daily News',
                    logo: 'https://garhwapalamunews.com/logo.png',
                    sameAs: ['https://facebook.com/garhwa.news', 'https://twitter.com/garhwapalamunews']
                },
                wordCount: article.content ? article.content.split(' ').length : 0,
                keywords: [...(article.tags || []), article.category?.name, article.district].filter(Boolean).join(', ')
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://garhwapalamunews.com' },
                    { '@type': 'ListItem', position: 2, name: article.category?.name || 'News', item: `https://garhwapalamunews.com/category/${article.category?.slug}` },
                    { '@type': 'ListItem', position: 3, name: article.title, item: `https://garhwapalamunews.com/news/${decodedSlug}` }
                ]
            },
            // AEO: FAQ Schema based on highlights
            article.highlights?.length > 0 ? {
                '@type': 'FAQPage',
                mainEntity: article.highlights.map((h: string) => ({
                    '@type': 'Question',
                    name: `खबर का मुख्य बिंदु: ${h.split(':')[0] || 'मुख्य जानकारी'}`,
                    acceptedAnswer: { '@type': 'Answer', text: h }
                }))
            } : null
        ].filter(Boolean)
    }

    return (
        <PublicLayout>
            <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <main className="container" style={{ maxWidth: 880, paddingTop: '2rem' }}>
                    <article style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                        {/* Feature Image */}
                        {(article.featureImage?.asset || article.image_url) && (
                            <div style={{ position: 'relative', width: '100%', height: 450 }}>
                                <Image
                                    src={article.image_url || urlFor(article.featureImage).width(1200).height(630).url()}
                                    alt={article.title}
                                    fill
                                    priority
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>
                                    © NR Daily News Photo
                                </div>
                            </div>
                        )}

                        <div style={{ padding: '2rem' }}>
                            {/* Meta */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <Link href={`/category/${article.category?.slug || (typeof article.category === 'string' ? 'news' : article.category?.slug || 'news')}`} style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'none' }}>
                                    {typeof article.category === 'string' ? article.category : (article.category?.name || 'NEWS').toUpperCase()}
                                </Link>
                                {article.location && (
                                    <>
                                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>|</span>
                                        <span style={{ color: '#111827', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📍 {article.location}
                                        </span>
                                    </>
                                )}
                                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>|</span>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>{formattedDate}</span>
                            </div>

                            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                                {article.title}
                            </h1>

                            {/* GEO/SXO: Key Highlights Box */}
                            {article.highlights && article.highlights.length > 0 && (
                                <div style={{ background: '#f0f9ff', borderLeft: '5px solid #0ea5e9', padding: '1.5rem', marginBottom: '2.5rem', borderRadius: '0 8px 8px 0' }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0369a1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🎯 मुख्य बिंदु (Key Highlights)
                                    </h2>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#0c4a6e', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: 600 }}>
                                        {article.highlights.map((h: string, idx: number) => (
                                            <li key={idx} style={{ lineHeight: 1.5 }}>{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#374151', overflow: 'hidden', position: 'relative' }}>
                                    {article.author?.image?.asset ? (
                                        <Image src={urlFor(article.author.image).width(88).height(88).url()} alt={article.author.name} fill style={{ objectFit: 'cover' }} />
                                    ) : (
                                        article.author?.name?.charAt(0) || 'S'
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                                        {article.author ? (
                                            <Link href={`/author/${article.author.slug.current || article.author.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-red-600">
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
                                {article.content ? (
                                    article.content.split('\n').map((para: string, i: number) => (
                                        <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
                                    ))
                                ) : article.body?.length > 0 && typeof article.body[0]?.children?.[0]?.text === 'string' && article.body[0].children[0].text.trimStart().startsWith('<') ? (
                                    // HTML content from admin form — render directly
                                    <div dangerouslySetInnerHTML={{ __html: article.body.map((b: any) => b.children?.map((c: any) => c.text).join('') ?? '').join('\n') }} />
                                ) : (
                                    // Proper Sanity portable text
                                    <PortableText value={article.body} />
                                )}
                            </div>

                            {/* Bottom Ad */}
                            <AdBanner slot="article_below_content" width={300} height={250} />

                            {/* Live Updates Timeline */}
                            {article.updates && article.updates.length > 0 && (
                                <div style={{ marginTop: '3rem', padding: '2rem', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#92400e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                                        Live Updates (ताज़ा अपडेट)
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px dashed #fcd34d', paddingLeft: '1.5rem', marginLeft: '6px' }}>
                                        {article.updates.map((update: any, idx: number) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '-1.85rem', top: '0.2rem', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', border: '2px solid white' }}></div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', marginBottom: '0.25rem' }}>
                                                    {new Date(update.time).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}, {new Date(update.time).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '1.05rem', color: '#374151', lineHeight: 1.6, fontWeight: 500 }}>
                                                    {update.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }`}</style>
                                </div>
                            )}

                            {/* Keywords / Tags for Local SEO */}
                            {article.tags && article.tags.length > 0 && (
                                <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4b5563' }}>Tags:</span>
                                    {article.tags.map((tag: string, idx: number) => (
                                        <span key={idx} style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Author Bio Box for SEO (E-E-A-T) */}
                            {article.author && (
                                <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280' }}>
                                        {article.author?.image?.asset ? (
                                            <Image src={urlFor(article.author.image).width(140).height(140).url()} alt={article.author.name} fill style={{ objectFit: 'cover' }} />
                                        ) : article.author.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem 0' }}>
                                            लेखक: <Link href={`/author/${article.author.slug.current || article.author.slug}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{article.author.name}</Link>
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
                                            {article.author.bio || `${article.author.name} गढ़वा पलामू न्यूज़ के वरिष्ठ संवाददाता हैं। वे स्थानीय राजनीति, अपराध और सामाजिक मुद्दों पर गहरी पकड़ रखते हैं।`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>शेयर करें:</h3>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Facebook', icon: <FaFacebookF size={18} />, bg: '#1877f2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://garhwapalamunews.com/news/${decodedSlug}`)}` },
                                        { label: 'Twitter', icon: <FaTwitter size={18} />, bg: '#1da1f2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://garhwapalamunews.com/news/${decodedSlug}`)}&text=${encodeURIComponent(article.title)}` },
                                        { label: 'WhatsApp', icon: <FaWhatsapp size={20} />, bg: '#25d366', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + `https://garhwapalamunews.com/news/${decodedSlug}`)}` },
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
                                    <Link key={item._id || item.id} href={`/news/${item.slug.current || item.slug}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                            {(item.featureImage?.asset || item.image_url) && (
                                                <div style={{ position: 'relative', height: 160, width: '100%' }}>
                                                    <Image
                                                        src={item.image_url || urlFor(item.featureImage).width(400).height(250).url()}
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
        </PublicLayout>
    )
}
