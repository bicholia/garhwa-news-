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
            <div className="min-h-screen">
                <div className="container py-2 lg:py-6">
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
        </PublicLayout>
    )
}
