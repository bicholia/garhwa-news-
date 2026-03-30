import { client } from '@/lib/sanity'
import { getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
import Pagination from '@/components/Pagination'
import PublicLayout from '@/components/PublicLayout'
import { MapPin, Globe, ShieldCheck } from 'lucide-react'

export const revalidate = 3600

const POSTS_PER_PAGE = 12

export async function generateMetadata() {
    return {
        title: 'पलामू न्यूज़ ब्यूरो | NR Global Agency',
        description: 'पलामू जिले की ताज़ा खबरें, विश्लेषण और ग्राउंड रिपोर्ट। NR Global Agency - निष्पक्ष पत्रकारिता का वैश्विक मानक।',
        openGraph: {
            images: ['/og-palamu.png']
        }
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
                _id, title, "slug": slug.current, excerpt, featureImage, publishedAt, author->{name}
            }`,
            { offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(`count(*[_type == "article" && district == "palamu"])`)
    ])

    const articles = mergeAndSortNews(pgData.articles, snArticles, POSTS_PER_PAGE)
    const totalCount = pgData.total + snTotal
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <PublicLayout>
            <div className="bg-news-paper min-h-screen pb-20">
                {/* Premium District Hero */}
                <div className="bg-brand-navy pt-16 pb-24 px-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 flex items-center justify-center -rotate-12 translate-x-1/4">
                        <Globe size={400} className="text-white/5" />
                    </div>
                    <div className="container max-w-6xl mx-auto text-center relative z-10">
                        <div className="flex justify-center items-center gap-3 mb-6">
                            <span className="bg-brand-gold text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                <ShieldCheck size={12} /> Authenticated Regional Bureau
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-serif leading-tight mb-6">
                            पलामू <span className="text-brand-gold italic">ब्यूरो</span>
                        </h1>
                        <div className="flex justify-center items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                             <div className="flex items-center gap-2"><MapPin size={16} className="text-brand-gold" /> Jharkhand, India</div>
                             <div className="flex items-center gap-2 underline decoration-brand-gold underline-offset-4">Intelligence HQ</div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <main className="container max-w-7xl mx-auto px-4 -mt-12 relative z-20">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                        <SectionHeading title="ताज़ा समाचार एवं विश्लेषण" />

                        {articles.length === 0 ? (
                            <div className="text-center py-24">
                                <Globe size={48} className="mx-auto text-gray-200 mb-4 animate-pulse" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                                    No classified reports found in this sector.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                                    {articles.map((article: any) => (
                                        <ArticleCard key={article.id || article._id} article={article} />
                                    ))}
                                </div>
                                
                                {totalPages > 1 && (
                                    <div className="mt-20 pt-10 border-t border-gray-50">
                                        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/palamu" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </PublicLayout>
    )
}
