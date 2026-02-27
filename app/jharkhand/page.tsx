import { client } from '@/lib/sanity'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
import Pagination from '@/components/Pagination'

export const revalidate = 60

const POSTS_PER_PAGE = 12

export async function generateMetadata() {
    return {
        title: 'झारखंड समाचार | गढ़वा पलामू न्यूज़',
        description: 'झारखंड राज्य की ताज़ा खबरें, राजधानी रांची, जमशेदपुर, धनबाद और अन्य प्रमंडलों की खबरें।',
    }
}

export default async function JharkhandPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams
    const currentPage = Number(page) || 1
    const offset = (currentPage - 1) * POSTS_PER_PAGE

    const [articles, totalCount] = await Promise.all([
        client.fetch(
            `*[_type == "article" && district == "jharkhand"] | order(publishedAt desc)[$offset...$limit] {
        _id,
        title,
        slug,
        excerpt,
        featureImage,
        publishedAt,
        author->{name}
      }`,
            { offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(`count(*[_type == "article" && district == "jharkhand"])`),
    ])

    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <SectionHeading title="झारखंड समाचार" />

            {articles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                    अभी कोई समाचार उपलब्ध नहीं है।
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {articles.map((article: any) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/jharkhand" />
                    )}
                </>
            )}
        </main>
    )
}
