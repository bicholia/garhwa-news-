import { client } from '@/lib/sanity'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
import Pagination from '@/components/Pagination'
import { notFound } from 'next/navigation'
import PublicLayout from '@/components/PublicLayout'

export const revalidate = 60

const POSTS_PER_PAGE = 12

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]{ name }`,
        { slug }
    )
    if (!category) return {}
    return {
        title: `${category.name} समाचार | गढ़वा पलामू न्यूज़`,
        description: `गढ़वा और पलामू क्षेत्र से ${category.name} से जुड़ी ताज़ा खबरें। पढ़ें विस्तार से।`,
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

    const category = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]{ name }`,
        { slug }
    )

    if (!category) notFound()

    const [articles, totalCount] = await Promise.all([
        client.fetch(
            `*[_type == "article" && category->slug.current == $slug] | order(publishedAt desc)[$offset...$limit] {
        _id,
        title,
        slug,
        excerpt,
        featureImage,
        publishedAt,
        author->{name}
      }`,
            { slug, offset, limit: offset + POSTS_PER_PAGE }
        ),
        client.fetch(
            `count(*[_type == "article" && category->slug.current == $slug])`,
            { slug }
        ),
    ])

    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

    return (
        <PublicLayout>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <SectionHeading title={`${category.name} समाचार`} />

                {articles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        इस श्रेणी में अभी कोई समाचार उपलब्ध नहीं है।
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {articles.map((article: any) => (
                                <ArticleCard key={article._id} article={article} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                basePath={`/category/${slug}`}
                            />
                        )}
                    </>
                )}
            </main>
        </PublicLayout>
    )
}
