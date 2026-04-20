import { client, urlFor } from '@/lib/sanity'
import { getNewsBySlug, getRelatedNews, mergeAndSortNews, getAllNews } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import PublicLayout from '@/components/PublicLayout'
import { Clock, MapPin, User, ShieldCheck, PlayCircle, TrendingUp } from 'lucide-react'
import ArticleActions from '@/components/ArticleActions'
import { scrubBrandNames, scrubSlug, scrubPortableText } from '@/lib/safety'

export const revalidate = 0 

async function getArticle(slug: string) {
    const postgresArticle: any = await getNewsBySlug(slug)
    
    if (postgresArticle) {
        const [pgRelated, snRelated]: [any[], any[]] = await Promise.all([
            getRelatedNews(postgresArticle.category, postgresArticle.district, slug, 6),
            client.fetch(`*[_type == "article" && district == $district] | order(publishedAt desc)[0...6] {
                _id, title, "slug": slug.current, featureImage, publishedAt
            }`, { district: postgresArticle.district })
        ])
        
        return {
            ...postgresArticle,
            related: mergeAndSortNews(pgRelated, snRelated, 6)
        }
    }

    const query = `* [_type == "article" && slug.current == $slug][0] {
        title, excerpt, featureImage, body, location, tags, updates, publishedAt, _updatedAt, localAd, highlights,
        "author": author -> { name, slug, image, bio },
        "category": category -> { "slug": slug.current, "name": name },
        district, seoKeywords,
        "related": * [_type == "article" && category._ref == ^.category._ref && slug.current != $slug] | order(publishedAt desc)[0...6] {
            _id, title, "slug": slug.current, featureImage, publishedAt
        }
    } `
    const sanityArticle: any = await client.fetch(query, { slug })
    
    if (sanityArticle) {
        sanityArticle.title = scrubBrandNames(sanityArticle.title);
        sanityArticle.excerpt = scrubBrandNames(sanityArticle.excerpt);
        sanityArticle.body = scrubPortableText(sanityArticle.body);
        const pgRelated = await getRelatedNews(sanityArticle.category?.name, sanityArticle.district, slug, 6)
        sanityArticle.related = mergeAndSortNews(pgRelated, sanityArticle.related, 6)
    }
    
    return sanityArticle
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    if (!article) return {}
    const domain = 'https://thinkindia.press'
    const imageUrl = article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(1200).height(630).url() : `${domain}/og-image.png`)

    return {
        title: `${article.title} | Think India`,
        description: article.excerpt?.substring(0, 160),
        openGraph: { title: article.title, images: [{ url: imageUrl }] },
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getArticle(decodedSlug)
    const sidebarNews = await getAllNews(10)

    if (!article) notFound()

    const imageUrl = article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(1200).height(630).url() : null)
    const date = article.publishedAt || article.published_at

    return (
        <PublicLayout>
            <div className="bg-white min-h-screen">
                <div className="bg-gray-50 border-b border-gray-100 py-4 hidden lg:flex justify-center">
                    <AdBanner slot="article_top" width={728} height={90} />
                </div>

                <div className="container max-w-7xl mx-auto py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* MAIN CONTENT (LHS) */}
                        <article className="lg:col-span-8 flex flex-col">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                <Link href="/" className="hover:text-brand-red">Home</Link>
                                <span>&rarr;</span>
                                <Link href={`/news`} className="hover:text-brand-red">News</Link>
                                <span>&rarr;</span>
                                <span className="text-brand-red">{article.district || 'India'}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-black leading-[1.15] mb-6 serif-font">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 border-y border-gray-100 py-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                                        <User size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black uppercase text-black">{article.author?.name || 'Think India Bureau'}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">News Correspondent</span>
                                    </div>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
                                <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold uppercase tracking-widest" suppressHydrationWarning>
                                    <Clock size={14} /> 
                                    Updated: {new Date(date).toLocaleString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {imageUrl && (
                                <div className="relative aspect-video rounded-sm overflow-hidden mb-8 bg-gray-100">
                                    <Image src={imageUrl} alt={article.title} fill className="object-cover" priority />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 text-white text-[12px] font-medium italic">
                                        Representative Image — Think India Bureau
                                    </div>
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none text-gray-900 leading-[1.8] serif-font article-body">
                                {article.body ? (
                                    <PortableText value={article.body} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
                                )}
                            </div>

                            {/* Share & Actions */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share This:</span>
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"><FaFacebookF size={14} /></button>
                                        <button className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform"><FaTwitter size={14} /></button>
                                        <button className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"><FaWhatsapp size={14} /></button>
                                    </div>
                                </div>
                                <Link href="/news" className="flex items-center gap-2 px-6 py-2 border-2 border-brand-red text-brand-red text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-brand-red hover:text-white transition-all">
                                    Read More News &rarr;
                                </Link>
                            </div>
                        </article>

                        {/* SIDEBAR (RHS) */}
                        <aside className="lg:col-span-4 flex flex-col gap-10">
                            {/* AD SLOT */}
                            <AdBanner slot="article_sidebar" width={300} height={250} />

                            {/* RELATED NEWS (NDTV STYLE) */}
                            <div className="bg-[#F8F8F8] p-6 rounded-sm border-t-4 border-brand-red">
                                <h3 className="text-[12px] font-black text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-brand-red" /> More From {article.district || 'Jharkhand'}
                                </h3>
                                <div className="space-y-6">
                                    {(article.related || []).slice(0, 6).map((item: any, i: number) => {
                                        const thumb = item.featureImage?.asset ? urlFor(item.featureImage).width(100).height(100).url() : '/placeholder.png'
                                        return (
                                            <Link key={i} href={`/news/${item.slug}`} className="flex gap-4 group">
                                                <div className="shrink-0 w-20 h-20 relative rounded-sm overflow-hidden bg-white">
                                                    <Image src={thumb} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-brand-red transition-colors serif-font line-clamp-3">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
