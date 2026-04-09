import { client, urlFor } from '@/lib/sanity'
import { getNewsBySlug, getRelatedNews, mergeAndSortNews } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane, FaLinkedinIn } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import SectionHeading from '@/components/SectionHeading'
import AdBanner from '@/components/AdBanner'
import PublicLayout from '@/components/PublicLayout'
import { Clock, MapPin, User, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react'
import ArticleActions from '@/components/ArticleActions'
import { scrubBrandNames, scrubSlug, scrubPortableText } from '@/lib/safety'

export const revalidate = 0 // Fetch fresh news every time

async function getArticle(slug: string) {
    const postgresArticle: any = await getNewsBySlug(slug)
    
    if (postgresArticle) {
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
        highlights,
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
        sanityArticle.title = scrubBrandNames(sanityArticle.title);
        sanityArticle.excerpt = scrubBrandNames(sanityArticle.excerpt);
        sanityArticle.slug = scrubSlug(sanityArticle.slug);
        sanityArticle.body = scrubPortableText(sanityArticle.body);
        
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
        title: `${article.title} | NR Global Agency`,
        description: article.excerpt?.substring(0, 160),
        keywords: article.seoKeywords || article.seo_keywords || `NR Global News, ${article.district}, ${article.category?.name}`,
        alternates: { canonical: `${domain}/news/${slug}` },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${domain}/news/${slug}`,
            siteName: 'NR Global News',
            type: 'article',
            images: [{ url: imageUrl }],
        },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) notFound()

    const publishedDate = article.publishedAt || article.published_at
    const formattedDate = new Date(publishedDate || Date.now()).toLocaleDateString('hi-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

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
                author: [{
                    '@type': 'Person',
                    name: article.author?.name || 'संवाददाता',
                }],
                publisher: {
                    '@type': 'NewsMediaOrganization',
                    name: 'NR Global News',
                    logo: 'https://garhwapalamunews.com/logo-new.png',
                }
            }
        ]
    }

    return (
        <PublicLayout>
            <div className="bg-news-paper min-h-screen pb-20">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                
                {/* Hero Banner Area */}
                <div className="bg-brand-navy pt-10 pb-20 lg:pt-16 lg:pb-32 px-4">
                    <div className="container max-w-4xl mx-auto text-center">
                        <div className="flex justify-center items-center gap-4 mb-8">
                             <Link href={`/category/${article.category?.slug?.current || article.category?.slug || 'news'}`} 
                                className="bg-brand-gold text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-lg">
                                {typeof article.category === 'string' ? article.category : article.category?.name || 'REPORT'}
                            </Link>
                            <span className="text-white/20 text-xs font-black uppercase tracking-widest hidden md:inline">NR Agency Intelligence</span>
                        </div>
                        <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white font-serif leading-[1.15] mb-8 tracking-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                             <div className="flex items-center gap-2"><Clock size={14} className="text-brand-gold" /> {formattedDate}</div>
                             <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-gold" /> {article.location || article.district}</div>
                             <div className="flex items-center gap-2"><User size={14} className="text-brand-gold" /> {article.author?.name || 'By NR Desk'}</div>
                        </div>
                    </div>
                </div>

                <main className="container max-w-4xl mx-auto -mt-16 lg:-mt-24 px-4 relative z-10">
                    <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Featured Image */}
                        {(article.featureImage?.asset || article.image_url) && (
                            <div className="relative aspect-[16/9] w-full group">
                                <Image
                                    src={article.image_url || urlFor(article.featureImage).width(1200).height(675).url()}
                                    alt={article.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                    <div className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-brand-gold" /> Authenticated Agency Media
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 lg:p-16">
                            {/* Short Intro / Excerpt */}
                            {article.excerpt && (
                                <p className="text-xl lg:text-2xl font-black text-brand-navy font-serif leading-relaxed mb-12 italic border-l-4 border-brand-gold pl-8">
                                    {article.excerpt}
                                </p>
                            )}

                            {/* Action Bar */}
                            <ArticleActions title={article.title} slug={slug} excerpt={article.excerpt} />

                            {/* Highlights */}
                            {Array.isArray(article.highlights) && article.highlights.length > 0 && (
                                <div className="bg-brand-navy/5 rounded-2xl p-8 lg:p-12 mb-12 border border-brand-gold/10">
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-gold mb-8 flex items-center gap-3">
                                        <TrendingUp size={16} /> Intelligence Summary
                                    </h2>
                                    <ul className="space-y-6">
                                        {article.highlights.map((h: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-4 text-brand-navy font-bold leading-relaxed italic">
                                                <span className="w-2 h-2 mt-2 bg-brand-gold rounded-full shrink-0" /> {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Main Body */}
                            <div className="prose prose-lg max-w-none text-gray-700 leading-[1.8] font-medium selection:bg-brand-gold/20">
                                {article.content ? (
                                    article.content.split('\n').map((para: string, i: number) => (
                                        <p key={i} className="mb-8">{para}</p>
                                    ))
                                ) : article.body?.length > 0 && typeof article.body[0]?.children?.[0]?.text === 'string' && article.body[0].children[0].text.trimStart().startsWith('<') ? (
                                    <div dangerouslySetInnerHTML={{ __html: article.body.map((b: any) => b.children?.map((c: any) => c.text).join('') ?? '').join('\n') }} />
                                ) : (
                                    <PortableText value={article.body} />
                                )}
                            </div>

                            {/* Tags Section */}
                            {Array.isArray(article.tags) && article.tags.length > 0 && (
                                <div className="mt-20 pt-10 border-t border-gray-50 flex flex-wrap gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold w-full mb-2 italic">Classified Data Tags</span>
                                    {article.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-news-paper px-4 py-2 rounded-lg text-xs font-black text-brand-navy uppercase tracking-widest border border-gray-100 hover:bg-brand-navy hover:text-white transition-all cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </article>

                    {/* Author Ecosystem Box */}
                    {article.author && (
                        <div className="mt-12 p-8 lg:p-12 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-brand-gold/20 p-1 bg-white relative">
                                {article.author?.image?.asset ? (
                                    <Image src={urlFor(article.author.image).width(200).height(200).url()} alt={article.author?.name || 'Author'} fill className="object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full h-full bg-brand-navy flex items-center justify-center text-white font-serif text-3xl font-black rounded-xl">{(article.author?.name || 'NR').charAt(0)}</div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2 block italic">Authenticated Agent</span>
                                <h3 className="text-2xl font-black text-brand-navy font-serif mb-3">
                                    <Link href={`/author/${article.author?.slug?.current || article.author?.slug || 'admin'}`} className="hover:text-brand-gold transition-colors">
                                        {article.author?.name || 'NR Bureau Member'}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                                    {article.author?.bio || `${article.author?.name || 'NR Bureau'} is a senior intelligence correspondent for NR Global Agency, specializing in regional geopolitical developments and sociopolitical analysis.`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Related Archives */}
                    {article.related && article.related.length > 0 && (
                        <section className="mt-24">
                            <SectionHeading title="System Related Archives" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                                {article.related.map((item: any) => (
                                    <Link key={item._id || item.id} href={`/news/${item.slug.current || item.slug}`} className="group bg-white rounded-2xl p-4 shadow-lg hover:-translate-y-2 transition-all duration-500 border border-gray-50">
                                        {(item.featureImage?.asset || item.image_url) && (
                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                                <Image
                                                    src={item.image_url || urlFor(item.featureImage).width(400).height(225).url()}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-sm font-black text-brand-navy font-serif leading-tight group-hover:text-brand-gold transition-colors italic">
                                            {item.title}
                                        </h3>
                                        <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-brand-navy/30">
                                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1">Open <ArrowRight size={8} /></span>
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
