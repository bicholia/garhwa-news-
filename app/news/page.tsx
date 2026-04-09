import { client } from '@/lib/sanity'
import { getAllNews, mergeAndSortNews } from '@/lib/db'
import PublicLayout from '@/components/PublicLayout'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'

export const revalidate = 300 // Revalidate every 5 minutes

export const metadata: Metadata = {
    title: 'सभी समाचार | All News | NR Daily News',
    description: 'गढ़वा, पलामू और झारखंड की सभी ताज़ा खबरें। NR Daily News पर पढ़ें सभी ब्रेकिंग न्यूज़, लोकल न्यूज़ और राज्य की खबरें।',
    keywords: 'NR Daily News, Garhwa News, Palamu News, Jharkhand News, सभी समाचार',
}

const ARTICLES_PER_PAGE = 12

async function getAllArticles(page: number = 1) {
    const offset = (page - 1) * ARTICLES_PER_PAGE
    const limit = ARTICLES_PER_PAGE + offset

    const [pgArticles, snArticles] = await Promise.all([
        getAllNews(100),
        client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...100] {
            _id, title, slug, excerpt, featureImage, publishedAt, district,
            "author": author->{ name },
            "category": category->{ name, "slug": slug.current }
        }`)
    ])

    const merged = mergeAndSortNews(pgArticles, snArticles, 100)
    const total = merged.length
    const articles = merged.slice(offset, offset + ARTICLES_PER_PAGE)
    const totalPages = Math.ceil(total / ARTICLES_PER_PAGE)

    return { articles, total, totalPages, currentPage: page }
}

export default async function AllNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const page = Math.max(1, parseInt(params.page || '1', 10))
    const { articles, total, totalPages, currentPage } = await getAllArticles(page)

    return (
        <PublicLayout>
            <div className="bg-news-paper min-h-screen">

                {/* Page Header */}
                <div className="bg-brand-navy py-14 lg:py-20 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <Newspaper className="absolute -bottom-10 -right-10 w-72 h-72 text-white" />
                    </div>
                    <div className="container max-w-6xl mx-auto relative z-10">
                        <div className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs mb-4">
                            NR Daily News Bureau
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white font-serif leading-tight mb-4">
                            सभी समाचार
                        </h1>
                        <p className="text-gray-400 font-medium max-w-xl">
                            गढ़वा, पलामू और झारखंड की सभी ताज़ा और विश्वसनीय खबरें एक ही जगह।
                        </p>
                        <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                            <span className="text-brand-gold">{total}+</span> कुल खबरें
                            <span className="w-1 h-1 rounded-full bg-gray-600 inline-block" />
                            पेज {currentPage} / {totalPages}
                        </div>
                    </div>
                </div>

                {/* Category Quick Links */}
                <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
                    <div className="container max-w-6xl mx-auto px-4 overflow-x-auto hide-scrollbar">
                        <div className="flex items-center gap-1 py-3 whitespace-nowrap text-xs font-black uppercase tracking-widest">
                            <Link href="/news" className="px-6 py-2.5 bg-brand-navy text-white rounded-full">सभी</Link>
                            <Link href="/garhwa" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">गढ़वा</Link>
                            <Link href="/palamu" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">पलामू</Link>
                            <Link href="/jharkhand" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">झारखंड</Link>
                            <Link href="/category/crime" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">अपराध</Link>
                            <Link href="/category/jobs" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">नौकरियां</Link>
                            <Link href="/category/education" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">शिक्षा</Link>
                            <Link href="/category/politics" className="px-6 py-2.5 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors">राजनीति</Link>
                        </div>
                    </div>
                </div>

                <main className="container max-w-6xl mx-auto px-4 py-12">
                    {articles.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="text-brand-navy/20 text-8xl mb-8">📰</div>
                            <h2 className="text-2xl font-black text-brand-navy font-serif mb-4">कोई समाचार नहीं मिला</h2>
                            <p className="text-gray-500">अभी कोई खबर उपलब्ध नहीं है। बाद में दोबारा देखें।</p>
                        </div>
                    ) : (
                        <>
                            {/* Articles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                {articles.map((article: any, idx: number) => (
                                    <ArticleCard
                                        key={article._id || article.id}
                                        article={article}
                                        priority={idx < 6}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-8">
                                    {currentPage > 1 && (
                                        <Link
                                            href={`/news?page=${currentPage - 1}`}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-brand-navy font-black text-xs uppercase tracking-widest rounded-full hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={14} /> पिछला
                                        </Link>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum: number
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }
                                            return (
                                                <Link
                                                    key={pageNum}
                                                    href={`/news?page=${pageNum}`}
                                                    className={`w-11 h-11 flex items-center justify-center rounded-full text-xs font-black transition-all ${
                                                        pageNum === currentPage
                                                            ? 'bg-brand-navy text-white shadow-md'
                                                            : 'bg-white border border-gray-200 text-brand-navy hover:bg-brand-navy hover:text-white'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {currentPage < totalPages && (
                                        <Link
                                            href={`/news?page=${currentPage + 1}`}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-brand-gold transition-all shadow-sm"
                                        >
                                            अगला <ChevronRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

        </PublicLayout>
    )
}
