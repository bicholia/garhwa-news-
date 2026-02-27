import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity'

export const metadata: Metadata = {
    title: 'वीडियो समाचार | NR Daily News गढ़वा पलामू',
    description: 'गढ़वा और पलामू की खबरों के वीडियो देखें। ब्रेकिंग न्यूज़ वीडियो और लाइव रिपोर्टिंग।',
}

async function getVideos() {
    return await client.fetch(`*[_type == "video"] | order(publishedAt desc) {
        title,
        youtubeId,
        publishedAt
    }`)
}

export default async function VideosPage() {
    const videos = await getVideos()

    return (
        <div style={{ background: '#f4f5f7', minHeight: '100vh', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
            <div className="container">

                {/* Banner */}
                <div className="page-banner" style={{ background: 'linear-gradient(135deg, #111827, #374151)', marginBottom: '1.5rem' }}>
                    <h1>वीडियो समाचार</h1>
                    <p>गढ़वा-पलामू की खबरें अब वीडियो में भी</p>
                    <div className="breadcrumb">
                        <Link href="/">होम</Link>
                        <span>›</span>
                        <span style={{ fontWeight: 600, opacity: 1 }}>वीडियो</span>
                    </div>
                </div>

                {/* YouTube CTA */}
                <div style={{ background: '#dc2626', color: 'white', borderRadius: 10, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>YouTube पर Subscribe करें</div>
                        <div style={{ color: '#fca5a5', fontSize: '0.82rem' }}>ताज़ा वीडियो नोटिफिकेशन पाएं</div>
                    </div>
                    <a href="https://youtube.com/@nrdailynews" target="_blank" rel="noopener"
                        style={{ background: 'white', color: '#dc2626', fontWeight: 800, padding: '8px 22px', borderRadius: 50, fontSize: '0.85rem' }}>
                        Subscribe
                    </a>
                </div>

                {/* Videos grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {videos.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            अभी कोई वीडियो उपलब्ध नहीं है।
                        </div>
                    ) : (
                        videos.map((video: any, i: number) => (
                            <div key={i} className="card news-card" style={{ overflow: 'hidden' }}>
                                <iframe
                                    style={{ width: '100%', display: 'block' }}
                                    height={200}
                                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                <div style={{ padding: '0.75rem' }}>
                                    <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem', lineHeight: 1.4 }}>{video.title}</h3>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        {new Date(video.publishedAt).toLocaleDateString('hi-IN')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
