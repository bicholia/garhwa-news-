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
        const [pgResults, snResults] = await Promise.all([
            searchNews(query),
            client.fetch(
                `*[_type == "article" && (title match "*" + $q + "*" || excerpt match "*" + $q + "*")] | order(priority desc, publishedAt desc) {
                    _id, title, slug, excerpt, featureImage, publishedAt, author->{name}, priority
                }`,
                { q: query }
            )
        ])
        
        articles = mergeAndSortNews(pgResults, snResults, 20)
    }

    return (
        <PublicLayout>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <SectionHeading title={query ? `खोज परिणाम: "${query}"` : 'खोजें'} />

                {query && articles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <p>इस शब्द के लिए कोई समाचार नहीं मिला।</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>कृपया कुछ और खोजें।</p>
                    </div>
                ) : articles.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {articles.map((article: any) => (
                            <ArticleCard key={article.id || article._id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <p>ऊपर के सर्च बार में खबर का शब्द लिखें।</p>
                    </div>
                )}
            </main>
        </PublicLayout>
    )
}
