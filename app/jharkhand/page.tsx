import { client, urlFor } from '@/lib/sanity'
import { getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import PublicLayout from '@/components/PublicLayout'
import Link from 'next/link'
import { MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import Pagination from '@/components/Pagination'
import AdBanner from '@/components/AdBanner'

export const revalidate = 3600

const POSTS_PER_PAGE = 24 // Even higher for state-wide news

export async function generateMetadata() {
    return {
        title: 'Jharkhand News Bureau | झारखंड न्यूज़ | ThinkIndia.press',
        description: 'Comprehensive Jharkhand state news coverage, political analysis and regional updates from ThinkIndia.press.',
    }
}

export default async function JharkhandPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams
    const currentPage = Number(page) || 1
    const offset = (currentPage - 1) * POSTS_PER_PAGE

    const [pgData, snArticles, snTotal] = await Promise.all([
        getNewsByDistrict('jharkhand', POSTS_PER_PAGE, offset),
        client.fetch(
            `*[_type == "article" && district == "jharkhand"] | order(publishedAt desc)[$offset...$limit] {
                _id, title, "slug": slug.current, excerpt, featureImage, publishedAt
            }`,
            { offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(`count(*[_type == "article" && district == "jharkhand"])`)
    ])

    const articles = mergeAndSortNews(pgData.articles || pgData, snArticles, POSTS_PER_PAGE)
    const totalCount = pgData.total + snTotal
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <PublicLayout>
            <div className="bg-white min-h-screen">
                <div className="bg-ndtv-black py-16 lg:py-20 border-b-4 border-brand-red">
                    <div className="container">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-brand-red text-white text-[12px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-sm shadow-2xl">
                                        STATE HEADQUARTERS
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-400 text-[12px] font-bold uppercase tracking-widest">
                                        <MapPin size={16} className="text-brand-red" /> India / Jharkhand
                                    </div>
                                </div>
                                <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight uppercase tracking-tighter serif-font">
                                    JHARKHAND <span className="text-brand-red">BUREAU</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-9">
                            <div className="flex items-center justify-between border-b-2 border-gray-100 mb-12 pb-6">
                                <h2 className="text-[16px] font-black text-black uppercase tracking-[0.2em] flex items-center gap-4">
                                    <span className="w-4 h-4 bg-brand-red rounded-full animate-ping" />
                                    State-Wide Intelligence Stream
                                </h2>
                                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Archive {currentPage}</span>
                            </div>

                            {articles.length === 0 ? (
                                <div className="text-center py-32 bg-gray-50 rounded-sm border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">Bureau report queue is currently empty.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                        {articles.map((article: any, i: number) => {
                                            const img = article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(400).height(250).url() : null)
                                            return (
                                                <Link key={i} href={`/news/${article.slug}`} className="group flex flex-col">
                                                    <div className="aspect-video relative overflow-hidden rounded-sm bg-gray-100 mb-6 border border-gray-100">
                                                        {img ? <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={article.title} /> : null}
                                                        <div className="absolute bottom-3 right-3 bg-brand-red text-white text-[9px] font-black uppercase px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">Full Report</div>
                                                    </div>
                                                    <h3 className="text-[18px] font-bold text-gray-900 leading-[1.3] group-hover:text-brand-red transition-colors serif-font line-clamp-3">
                                                        {article.title}
                                                    </h3>
                                                    <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">ThinkIndia.press Bureau</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{new Date(article.publishedAt || article.published_at).toLocaleDateString()}</span>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="mt-20 pt-12 border-t border-gray-100">
                                            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/jharkhand" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <aside className="lg:col-span-3">
                            <div className="sticky top-24 space-y-10">
                                <AdBanner slot="state_sidebar" width={300} height={600} />
                                <div className="bg-ndtv-black p-8 rounded-sm text-white">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-red mb-6">Bureau Alerts</h3>
                                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed mb-8">Get critical state-wide news updates delivered to your device in real-time.</p>
                                    <button className="w-full py-3 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-white hover:text-brand-red">Enable Alerts</button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
