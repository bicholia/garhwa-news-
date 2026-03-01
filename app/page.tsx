import { client, urlFor } from '@/lib/sanity'
import NewsGrid from '@/components/NewsGrid'
import BreakingNews from '@/components/BreakingNews'
import WhatsAppButton from '@/components/WhatsAppButton'
import PublicLayout from '@/components/PublicLayout'
import AdBanner from '@/components/AdBanner'
import Link from 'next/link'

export const revalidate = 0 // Disable cache for home to always show latest news

async function getHomepageData() {
  const featuredQuery = `*[_type == "article"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    featureImage,
    publishedAt,
    author->{name}
  }`

  const garhwaQuery = `*[_type == "article" && district == "garhwa"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    featureImage,
    publishedAt,
    author->{name}
  }`

  const palamuQuery = `*[_type == "article" && district == "palamu"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    featureImage,
    publishedAt,
    author->{name}
  }`

  const jobsQuery = `*[_type == "article" && category->slug.current == "jobs"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    excerpt,
    featureImage,
    publishedAt
  }`

  const crimeQuery = `*[_type == "article" && category->slug.current == "crime"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    slug,
    excerpt,
    featureImage,
    publishedAt
  }`

  const [featured, garhwa, palamu, jobs, crime] = await Promise.all([
    client.fetch(featuredQuery),
    client.fetch(garhwaQuery),
    client.fetch(palamuQuery),
    client.fetch(jobsQuery),
    client.fetch(crimeQuery),
  ])

  return { featured, garhwa, palamu, jobs, crime }
}

export default async function Home() {
  const data = await getHomepageData()

  return (
    <PublicLayout>
      <BreakingNews />
      <WhatsAppButton />

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>

        {/* Highly Prioritized Featured Hero Section */}
        {data.featured && data.featured.length > 0 && (
          <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Big Featured Card */}
            <Link href={`/news/${data.featured[0].slug.current}`} style={{ gridColumn: 'span 2', textDecoration: 'none', position: 'relative', height: '100%', minHeight: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              {data.featured[0].featureImage?.asset ? (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img src={urlFor(data.featured[0].featureImage).width(1200).height(800).url()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <Link key={article._id} href={`/news/${article.slug.current}`} style={{ display: 'flex', gap: '1rem', textDecoration: 'none', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f3f4f6' }}>
                    {article.featureImage?.asset && (
                      <img src={urlFor(article.featureImage).width(200).height(200).url()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <Link href={`/news/${job.slug.current}`} style={{ textDecoration: 'none' }}>
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

        {/* Telegram CTA */}
        <section style={{
          margin: '4rem 0',
          background: 'linear-gradient(135deg, #2563eb, #1e40af)',
          color: 'white',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, pointerEvents: 'none' }}>
            <svg width="300" height="300" viewBox="0 0 24 24" fill="white"><path d="M20.665 3.717l-17.73 6.837c-1.213.486-1.203 1.163-.223 1.467l4.56 1.42 1.583 4.86c.19.525.097.733.65.733.427 0 .617-.197.854-.428l2.05-1.99 4.265 3.15c.783.43 1.35.21 1.543-.727l2.8-13.203c.287-1.147-.433-1.664-1.183-1.32z" /></svg>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>झारखंड की ताज़ा ख़बरों के लिए</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>हमारे Telegram चैनल से जुड़ें और घर बैठे पल-पल की खबरें पाएं।</p>
          <a
            href="https://t.me/nrdailynews"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#1e40af',
              padding: '1rem 3rem',
              borderRadius: '9999px',
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          >
            JOIN TELEGRAM NOW
          </a>
        </section>
      </div>
    </PublicLayout>
  )
}
