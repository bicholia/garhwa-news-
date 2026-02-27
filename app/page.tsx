import { client } from '@/lib/sanity'
import ArticleCard from '@/components/ArticleCard'
import SectionHeading from '@/components/SectionHeading'
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

        {/* Garhwa News */}
        {data.garhwa && data.garhwa.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <SectionHeading title="गढ़वा समाचार" link="/garhwa" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.garhwa.map((article: any, idx: number) => (
                <ArticleCard key={article._id} article={article} priority={idx < 3} />
              ))}
            </div>
          </section>
        )}

        {/* Home Top Ad — slot must match Sanity globalAd.slot exactly */}
        <AdBanner slot="homepage_hero" width={728} height={90} />

        {/* Palamu News */}
        {data.palamu && data.palamu.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <SectionHeading title="पलामू समाचार" link="/palamu" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.palamu.map((article: any) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Jobs Section */}
        {data.jobs && data.jobs.length > 0 && (
          <section style={{ marginBottom: '2.5rem', background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fef3c7' }}>
            <SectionHeading title="सरकारी नौकरी 2026" link="/category/jobs" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {data.jobs.map((job: any) => (
                <div key={job._id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Link href={`/news/${job.slug.current}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.4 }} className="hover:text-red-600">
                      {job.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                      {job.excerpt?.slice(0, 70)}...
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crime News */}
        {data.crime && data.crime.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <SectionHeading title="अपराध समाचार" link="/category/crime" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {data.crime.map((article: any) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Home Middle Ad */}
        <AdBanner slot="homepage_middle" width={728} height={150} />

        {/* Telegram CTA */}
        <section style={{
          margin: '3rem 0',
          background: 'linear-gradient(135deg, #2563eb, #1e40af)',
          color: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Telegram पर जुड़ें</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>गढ़वा-पलामू की ब्रेकिंग न्यूज़ सबसे पहले पाने के लिए</p>
          <a
            href="https://t.me/nrdailynews"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#1e40af',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'transform 0.2s'
            }}
            className="hover:scale-105"
          >
            JOIN CHANNEL
          </a>
        </section>
      </div>
    </PublicLayout>
  )
}
