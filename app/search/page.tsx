import { searchNews, mergeAndSortNews } from '@/lib/db'
import { client } from '@/lib/sanity'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
import PublicLayout from '@/components/PublicLayout'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const query = q || ''

    let articles: any[] = []

    if (query) {
        // Robust search across Postgres and Sanity
        const [pgResults, snResults] = await Promise.all([
            searchNews(query),
            client.fetch(
                `*[_type == "article" && (title match "*" + $q + "*" || excerpt match "*" + $q + "*" || body[].children[].text match "*" + $q + "*")] | order(publishedAt desc) {
                    _id, title, "slug": slug.current, excerpt, featureImage, publishedAt, author->{name}, district
                }`,
                { q: query }
            )
        ])
        
        articles = mergeAndSortNews(pgResults, snResults, 24)
    }

    return (
        <PublicLayout>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <SectionHeading title={query ? `खोज परिणाम: "${query}"` : 'खोजें'} />

                {query && articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <div className="text-6xl mb-6 opacity-20">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">कोई परिणाम नहीं मिला</h3>
                        <p className="text-sm font-medium">हमें आपकी खोज <strong>"{query}"</strong> के लिए कुछ नहीं मिला।</p>
                        <p className="text-xs mt-2 uppercase tracking-widest font-bold text-brand-red">कृपया अन्य शब्दों के साथ प्रयास करें</p>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article: any) => (
                            <ArticleCard key={article.id || article._id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <div className="text-6xl mb-6 opacity-20">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">सर्च बार में टाइप करें</h3>
                        <p className="text-sm font-medium">न्यूज़ खोजने के लिए ऊपर दिए गए सर्च बार का उपयोग करें।</p>
                    </div>
                )}
            </main>
        </PublicLayout>
    )
}
