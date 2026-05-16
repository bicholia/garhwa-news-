import { client, urlFor } from '@/lib/sanity'
import { getNewsByCategoryPage, CATEGORY_MAP, mergeAndSortNews } from '@/lib/db'
import PublicLayout from '@/components/PublicLayout'
import Link from 'next/link'
import { Globe, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import Pagination from '@/components/Pagination'
import AdBanner from '@/components/AdBanner'

export const revalidate = 3600

const POSTS_PER_PAGE = 20

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const categoryName = CATEGORY_MAP[slug as keyof typeof CATEGORY_MAP] || slug
    
    return {
        title: `${categoryName} | ताज़ा समाचार | Think India`,
        description: `Think India ${categoryName} Bureau: Impact, Integrity, and Intelligence. Global reporting from the digital grid.`,
    }
}

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ page?: string }>
}) {
    const { slug } = await params
    const { page } = await searchParams
    const currentPage = Number(page) || 1
    const offset = (currentPage - 1) * POSTS_PER_PAGE

    const categoryName = CATEGORY_MAP[slug as keyof typeof CATEGORY_MAP] || slug

    const [pgData, snArticles, snTotal] = await Promise.all([
        getNewsByCategoryPage(slug, POSTS_PER_PAGE, offset),
        client.fetch(
            `*[_type == "article" && category->slug.current == $slug] | order(publishedAt desc)[$offset...$limit] {
                _id, title, slug, excerpt, featureImage, publishedAt
            }`,
            { slug, offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(`count(*[_type == "article" && category->slug.current == $slug])`, { slug })
    ])

    const articles = mergeAndSortNews(pgData.articles || pgData, snArticles, POSTS_PER_PAGE)
    const totalCount = pgData.total + snTotal
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <PublicLayout>
            <div className="min-h-screen pb-20">
                {/* Category Header */}
                <div className="bg-ndtv-black py-6 lg:py-8 border-b border-brand-red">
                    <div className="container">
                        <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight uppercase tracking-tighter serif-font">
                            {categoryName} <span className="text-brand-red">REPORTS</span>
                        </h1>
                    </div>
                </div>

                <div className="container py-12 flex flex-col lg:flex-row gap-12">
                    {/* Main Feed */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between border-b-2 border-gray-100 mb-10 pb-4">
                            <h2 className="text-[14px] font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-3">
                                <span className="w-3 h-3 bg-brand-red rounded-full animate-pulse" />
                                Latest {categoryName} Intelligence
                            </h2>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                        </div>

                        {articles.length === 0 ? (
                            <div className="text-center py-24 bg-gray-50 text-gray-400 italic">
                                No intelligence reports found in this sector.
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                    {articles.map((article: any, i: number) => {
                                        const img = article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(400).height(250).url() : null)
                                        return (
                                            <Link key={i} href={`/news/${typeof article.slug === 'string' ? article.slug : article.slug?.current}`} className="group flex flex-col">
                                                <div className="aspect-video relative overflow-hidden rounded-sm bg-gray-100 dark:bg-white/5 mb-4">
                                                    {img ? <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} /> : null}
                                                </div>
                                                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white leading-[1.35] group-hover:text-brand-red transition-colors serif-font line-clamp-3">
                                                    {article.title}
                                                </h3>
                                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    <span>{new Date(article.publishedAt || article.published_at).toLocaleDateString()}</span>
                                                    <span className="group-hover:text-brand-red transition-colors">Read More &rarr;</span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                {totalPages > 1 && (
                                    <div className="mt-20 pt-10 border-t border-gray-100">
                                        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/category/${slug}`} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 space-y-10">
                        <AdBanner slot="category_sidebar" width={300} height={250} />
                        <div className="bg-[#F8F8F8] dark:bg-white/5 p-6 rounded-sm border-t-4 border-brand-red">
                            <h3 className="text-[12px] font-black text-black dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-brand-red" /> Bureau Verified
                            </h3>
                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                                All reports in the {categoryName} sector are double-vetted by Think India editors for accuracy and independence.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    )
}
