import { getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import NewsGrid from '@/components/NewsGrid'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import { Suspense } from 'react'

export const revalidate = 600

export default async function IndiaPage() {
    const pgNews = await getNewsByDistrict('india', 24)
    const articles = mergeAndSortNews(pgNews.articles || pgNews, [], 24)

    return (
        <PublicLayout>
            <div className="bg-white min-h-screen">
                <div className="container py-12">
                    <div className="flex flex-col gap-12">
                        <div className="border-b-4 border-ndtv-black pb-4">
                            <h1 className="text-4xl lg:text-6xl font-black text-black uppercase tracking-tighter serif-font">
                                India <span className="text-brand-red">Reports</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest mt-4 text-[12px]">
                                National Intelligence · Fast. Fair. Fearless.
                            </p>
                        </div>

                        <div className="flex justify-center py-6 bg-gray-50 border border-gray-100 italic text-gray-400 text-sm">
                            <AdBanner slot="india_top" width={728} height={90} />
                        </div>

                        {articles.length > 0 ? (
                            <NewsGrid title="National Stories" articles={articles} variant="mixed" limit={24} />
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-lg">
                                <h2 className="text-2xl font-bold text-gray-300">National feed is being updated...</h2>
                                <p className="text-gray-400 mt-2">Our agents are currently scanning national news wires.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
