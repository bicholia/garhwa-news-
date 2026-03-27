import { client } from '@/lib/sanity'
import { getNewsByCategory, mergeAndSortNews } from '@/lib/db'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
import { notFound } from 'next/navigation'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const author = await client.fetch(
        `*[_type == "author" && slug.current == $slug][0]{
      name,
      bio,
      image
    }`,
        { slug }
    )

    if (!author) notFound()

    // Fetch articles from both sources
    // Note: Since AI news currently uses 'संवाददाता', we fetch 'स्थानीय समाचार' as a fallback 
    // or we could filter Postgres by author_name if we had one. 
    // For now, we fetch Sanity articles for this specific author and 
    // could potentially merge with relevant PG articles if needed.
    const [snArticles, pgArticles] = await Promise.all([
        client.fetch(
            `*[_type == "article" && author->slug.current == $slug] | order(publishedAt desc) {
                _id, title, slug, excerpt, featureImage, publishedAt, author->{name}
            }`,
            { slug }
        ),
        // If the author is "Admin" or "Reporter", we could fetch from PG
        // For now, let's just support the merge utility in case PG adds this author
        [] 
    ])

    const articles = mergeAndSortNews(pgArticles, snArticles, 20)

    return (
        <PublicLayout>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>{author.name}</h1>
                    {author.bio && <p style={{ color: '#4b5563', marginTop: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>{author.bio}</p>}
                    <div style={{ marginTop: '1rem', padding: '4px 12px', border: '1px solid #e5e7eb', borderRadius: '20px', display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                        कुल प्रकाशित लेख: {articles.length}
                    </div>
                </div>

                <SectionHeading title={`${author.name} के लेख`} />

                {articles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        अभी कोई लेख उपलब्ध नहीं है।
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {articles.map((article: any) => (
                            <ArticleCard key={article.id || article._id} article={article} />
                        ))}
                    </div>
                )}
            </main>
        </PublicLayout>
    )
}
