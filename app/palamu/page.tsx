import { client, urlFor } from '@/lib/sanity'
import { getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import PublicLayout from '@/components/PublicLayout'
import Link from 'next/link'
import { MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import Pagination from '@/components/Pagination'
import AdBanner from '@/components/AdBanner'

export const revalidate = 3600

const POSTS_PER_PAGE = 20

export async function generateMetadata() {
    return {
        title: 'Palamu News Bureau | पलामू न्यूज़ | ThinkIndia.press',
        description: 'Get latest Palamu news, breaking stories and regional updates from the ThinkIndia.press Palamu Bureau.',
    }
}

export default async function PalamuPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams
    const currentPage = Number(page) || 1
    const offset = (currentPage - 1) * POSTS_PER_PAGE

    const [pgData, snArticles, snTotal] = await Promise.all([
        getNewsByDistrict('palamu', POSTS_PER_PAGE, offset),
        client.fetch(
            `*[_type == "article" && district == "palamu"] | order(publishedAt desc)[$offset...$limit] {
                _id, title, "slug": slug.current, excerpt, featureImage, publishedAt
            }`,
            { offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(`count(*[_type == "article" && district == "palamu"])`)
    ])

    const articles = mergeAndSortNews(pgData.articles || pgData, snArticles, POSTS_PER_PAGE)
    const totalCount = pgData.total + snTotal
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <PublicLayout>
            <div className="bg-white min-h-screen">
                <div className="bg-ndtv-black py-12 lg:py-16 border-b border-brand-red">
                    <div className="container">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                                        REGIONAL BUREAU
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                                        <MapPin size={14} className="text-brand-red" /> Jharkhand / Palamu
                                    </div>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter serif-font">
                                    PALAMU <span className="text-brand-red">NEWS</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/10">
                                <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-white text-[12px] font-black uppercase">Verified Reports</div>
                                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">ThinkIndia.press HQ Monitoring</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-9">
                            <div className="flex items-center justify-between border-b-2 border-gray-100 mb-10 pb-4">
                                <h2 className="text-[14px] font-black text-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-3 h-3 bg-brand-red rounded-full animate-pulse" />
                                    Latest From Palamu Bureau
                                </h2>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                            </div>

                            {articles.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">
                                    No reports currently available for this sector.
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                        {articles.map((article: any, i: number) => {
                                            const img = article.image_url || (article.featureImage?.asset ? urlFor(article.featureImage).width(400).height(250).url() : null)
                                            return (
                                                <Link key={i} href={`/news/${article.slug}`} className="group flex flex-col">
                                                    <div className="aspect-video relative overflow-hidden rounded-sm bg-gray-100 mb-4">
                                                        {img ? <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} /> : null}
                                                        <div className="absolute top-2 left-2 bg-ndtv-black/80 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">THINK INDIA</div>
                                                    </div>
                                                    <h3 className="text-[16px] font-bold text-gray-900 leading-[1.35] group-hover:text-brand-red transition-colors serif-font line-clamp-3">
                                                        {article.title}
                                                    </h3>
                                                    <p className="mt-3 text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                                                        {article.excerpt || "Detailed news report from the Palamu regional bureau."}
                                                    </p>
                                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <span>{new Date(article.publishedAt || article.published_at).toLocaleDateString()}</span>
                                                        <span className="group-hover:text-brand-red transition-colors">Read Report &rarr;</span>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="mt-16 pt-10 border-t border-gray-100">
                                            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/palamu" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <aside className="lg:col-span-3 space-y-10">
                            <AdBanner slot="district_sidebar" width={300} height={600} />
                            <div className="bg-[#F8F8F8] p-6 rounded-sm border-t-4 border-brand-red">
                                <h3 className="text-[12px] font-black text-black uppercase tracking-widest mb-6">Trending Topics</h3>
                                <div className="space-y-4">
                                    {['Palamu Election', 'Medininagar News', 'Jharkhand Updates', 'Crime Watch'].map((tag, i) => (
                                        <Link key={i} href={`/search?q=${tag}`} className="block text-[11px] font-bold text-gray-600 hover:text-brand-red bg-white p-3 rounded shadow-sm border border-gray-100 transition-all">
                                            # {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
