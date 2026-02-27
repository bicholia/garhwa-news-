import { client } from '@/lib/sanity'
import Link from 'next/link'

async function getBreakingNews() {
    // First try articles marked as breaking
    const breaking = await client.fetch(
        `*[_type == "article" && isBreaking == true] | order(publishedAt desc)[0...5] {
        title,
        "slug": slug.current
      }`
    )

    // Fallback: if no breaking news, show latest 5 articles
    if (!breaking || breaking.length === 0) {
        return await client.fetch(
            `*[_type == "article"] | order(publishedAt desc)[0...5] {
            title,
            "slug": slug.current
          }`
        )
    }

    return breaking
}

export default async function BreakingNews() {
    const news = await getBreakingNews()

    if (!news || news.length === 0) return null

    return (
        <div style={{ background: '#dc2626', color: 'white', overflow: 'hidden', height: 40, display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                    background: 'white',
                    color: '#dc2626',
                    padding: '2px 8px',
                    borderRadius: 4,
                    marginRight: 16,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    flexShrink: 0
                }}>
                    BREAKING NEWS
                </span>
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div className="animate-marquee" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
                        {/* Duplicate for seamless loop */}
                        {[...news, ...news].map((item: any, i: number) => (
                            <span key={i} style={{ margin: '0 20px', fontSize: '0.9rem', fontWeight: 600 }}>
                                <Link href={`/news/${item.slug}`} style={{ color: 'white', textDecoration: 'none' }} className="hover:underline">
                                    {item.title}
                                </Link>
                                {i < news.length * 2 - 1 && <span style={{ margin: '0 12px', opacity: 0.5 }}>◆</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
        </div>
    )
}
