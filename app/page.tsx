import { client, urlFor } from '@/lib/sanity'
import { getAllNews, getNewsByCategory, getNewsByDistrict, mergeAndSortNews } from '@/lib/db'
import NewsGrid from '@/components/NewsGrid'
import BreakingNews from '@/components/BreakingNews'
import MailButton from '@/components/MailButton'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'NR Daily News | गढ़वा पलामू की ताज़ा ख़बरें',
  description: 'गढ़वा, पलामू और झारखंड की सबसे तेज़ और सटीक ख़बरें। स्थानीय अपराध, राजनीति, शिक्षा और सरकारी नौकरियों के ताज़ा अपडेट के लिए NR Daily News से जुड़ें।',
  keywords: 'Garhwa News, Palamu News, Jharkhand Local News, गढ़वा समाचार, पलामू न्यूज़, आज की ताज़ा खबर झारखंड, NR Daily News',
  alternates: {
    canonical: 'https://garhwapalamunews.com',
  },
  openGraph: {
    title: 'NR Daily News | गढ़वा पलामू की ताज़ा ख़बरें',
    description: 'गढ़वा, पलामू और झारखंड की सबसे तेज़ और सटीक ख़बरें।',
    url: 'https://garhwapalamunews.com',
    siteName: 'NR Daily News',
    images: [{ url: 'https://garhwapalamunews.com/og-image.png', width: 1200, height: 630 }],
    locale: 'hi_IN',
    type: 'website',
  },
}

import { Metadata } from 'next'

async function getHomepageData() {
  const [pgFeatured, pgGarhwa, pgPalamu, pgJobs, pgCrime] = await Promise.all([
    getAllNews(10),
    getNewsByCategory('स्थानीय समाचार', 10),
    getNewsByDistrict('palamu', 10),
    getNewsByCategory('सरकारी नौकरियां', 10),
    getNewsByCategory('अपराध', 10),
  ])

  const featuredQuery = `*[_type == "article"] | order(publishedAt desc)[0...10] {
    _id, title, slug, excerpt, featureImage, publishedAt, author->{name}
  }`
  const garhwaQuery = `*[_type == "article" && district == "garhwa"] | order(publishedAt desc)[0...10] {
    _id, title, slug, excerpt, featureImage, publishedAt, author->{name}
  }`
  const palamuQuery = `*[_type == "article" && district == "palamu"] | order(publishedAt desc)[0...10] {
    _id, title, slug, excerpt, featureImage, publishedAt, author->{name}
  }`
  const jobsQuery = `*[_type == "article" && category->slug.current == "jobs"] | order(publishedAt desc)[0...10] {
    _id, title, slug, excerpt, featureImage, publishedAt
  }`
  const crimeQuery = `*[_type == "article" && category->slug.current == "crime"] | order(publishedAt desc)[0...10] {
    _id, title, slug, excerpt, featureImage, publishedAt
  }`

  const [snFeatured, snGarhwa, snPalamu, snJobs, snCrime] = await Promise.all([
    client.fetch(featuredQuery),
    client.fetch(garhwaQuery),
    client.fetch(palamuQuery),
    client.fetch(jobsQuery),
    client.fetch(crimeQuery),
  ])

  return {
    featured: mergeAndSortNews(pgFeatured, snFeatured, 3),
    garhwa: mergeAndSortNews(pgGarhwa, snGarhwa, 6),
    palamu: mergeAndSortNews(pgPalamu.articles || pgPalamu, snPalamu, 6),
    jobs: mergeAndSortNews(pgJobs, snJobs, 4),
    crime: mergeAndSortNews(pgCrime, snCrime, 4),
  }
}

export default async function Home() {
  const data = await getHomepageData()

  return (
    <PublicLayout>
      <BreakingNews />
      <MailButton />

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>

        {/* Highly Prioritized Featured Hero Section */}
        {data.featured && data.featured.length > 0 && (
          <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Big Featured Card */}
            <Link href={`/news/${typeof data.featured[0].slug === 'string' ? data.featured[0].slug : data.featured[0].slug?.current}`} style={{ gridColumn: 'span 2', textDecoration: 'none', position: 'relative', height: '100%', minHeight: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              {data.featured[0].image_url || data.featured[0].featureImage?.asset ? (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img src={data.featured[0].image_url || urlFor(data.featured[0].featureImage).width(1200).height(800).url()} alt={data.featured[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}></div>
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#1e293b' }}></div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2.5rem', color: 'white', maxWidth: '80%' }}>
                <span style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>TOP STORY</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>{data.featured[0].title}</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>{data.featured[0].excerpt}</p>
              </div>
            </Link>

            {/* Smaller Secondary Featured Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.featured.slice(1, 3).map((article: any) => (
                <Link key={article._id || article.id} href={`/news/${typeof article.slug === 'string' ? article.slug : article.slug?.current}`} style={{ display: 'flex', gap: '1rem', textDecoration: 'none', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f3f4f6' }}>
                    {(article.image_url || article.featureImage?.asset) && (
                      <img src={article.image_url || urlFor(article.featureImage).width(200).height(200).url()} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{article.title}</h3>
                    <div style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '4px', fontWeight: 700 }}>MUST READ</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdBanner slot="homepage_hero" width={728} height={90} />

        {/* News Sections with Limit and "View All" prioritization logic */}
        <NewsGrid title="गढ़वा समाचार" articles={data.garhwa} link="/garhwa" limit={6} />
        <NewsGrid title="पलामू समाचार" articles={data.palamu} link="/palamu" limit={6} />

        {/* Jobs Section (Specific UI layout) */}
        {data.jobs && data.jobs.length > 0 && (
          <section style={{ marginBottom: '3.5rem', background: '#fffbeb', padding: '2rem', borderRadius: '24px', border: '1px solid #fef3c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#92400e', margin: 0 }}>सरकारी नौकरी 🔥</h2>
              <Link href="/category/jobs" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309', textDecoration: 'none' }}>VIEW ALL JOBS</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.jobs.slice(0, 4).map((job: any) => (
                <div key={job._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Link href={`/news/${job.slug.current || job.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.3 }}>{job.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Latest Update &bull; APPLY NOW</div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <NewsGrid title="अपराध समाचार" articles={data.crime} link="/category/crime" limit={4} />

        <AdBanner slot="homepage_middle" width={728} height={90} />

      </div>
    </PublicLayout>
  )
}
