import Link from 'next/link'
import { createClient } from '@sanity/client'
import { Newspaper, Sparkles, Megaphone, CheckCircle2, PenLine, ClipboardList, IndianRupee, UploadCloud } from 'lucide-react'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

async function getStats() {
    try {
        const total = await client.fetch(`count(*[_type == "article"])`)
        const today = await client.fetch(
            `count(*[_type == "article" && publishedAt >= $from])`,
            { from: new Date(new Date().setHours(0, 0, 0, 0)).toISOString() }
        )
        return { total, today }
    } catch {
        return { total: 0, today: 0 }
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const statCards = [
        { label: 'कुल खबरें', value: stats.total, color: '#2563eb', bg: '#eff6ff', icon: <Newspaper size={28} color="#2563eb" /> },
        { label: 'आज की खबरें', value: stats.today, color: '#059669', bg: '#f0fdf4', icon: <Sparkles size={28} color="#059669" /> },
        { label: 'Telegram', value: 'Active', color: '#0088cc', bg: '#f0f9ff', icon: <Megaphone size={28} color="#0088cc" /> },
        { label: 'CMS Status', value: 'Online', color: '#7c3aed', bg: '#f5f3ff', icon: <CheckCircle2 size={28} color="#7c3aed" /> },
    ]

    return (
        <div>
            {/* Welcome */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    नमस्ते, Admin!
                </h1>
                <p style={{ color: '#64748b', marginTop: '0.35rem' }}>
                    NR Daily News Admin Panel — आज की तारीख: {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {statCards.map((card) => (
                    <div key={card.label} style={{
                        background: 'white',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        border: '1px solid #e2e8f0',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                        <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <Link href="/admin/dashboard/posts/new" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white', padding: '1.5rem', borderRadius: '1rem',
                    textDecoration: 'none', fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
                    transition: 'transform 0.2s'
                }}>
                    <span style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}><PenLine size={36} color="white" /></span>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>नई खबर लिखें</div>
                        <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '0.2rem' }}>Sanity CMS में तुरंत पब्लिश करें</div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/posts" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'white', border: '2px solid #e2e8f0',
                    color: '#0f172a', padding: '1.5rem', borderRadius: '1rem',
                    textDecoration: 'none', fontWeight: 700,
                    transition: 'border-color 0.2s'
                }}>
                    <span style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}><ClipboardList size={36} color="#0f172a" /></span>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>सभी खबरें देखें</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>Edit या Delete करें</div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/ads" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'white', border: '2px dashed #3b82f6',
                    color: '#0f172a', padding: '1.5rem', borderRadius: '1rem',
                    textDecoration: 'none', fontWeight: 700,
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'pointer'
                }}
                >
                    <span style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}><IndianRupee size={36} color="#1d4ed8" /></span>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>विज्ञापन (Ads)</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>लोकल बैनर अपलोड करें</div>
                    </div>
                </Link>

                <Link href="/admin/dashboard/bulk-upload" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '2px solid #86efac',
                    color: '#0f172a', padding: '1.5rem', borderRadius: '1rem',
                    textDecoration: 'none', fontWeight: 700,
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer'
                }}
                >
                    <span style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}><UploadCloud size={36} color="#15803d" /></span>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>📦 Bulk Upload</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>Excel से कई खबरें एक साथ</div>
                    </div>
                </Link>
            </div>

            {/* System Status */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                    सिस्टम स्टेटस
                </h2>
                {[
                    { name: 'Sanity CMS', status: 'Connected', color: '#059669' },
                    { name: 'Next.js Server', status: 'Running', color: '#059669' },
                    { name: 'Admin Session', status: 'Active', color: '#059669' },
                ].map(item => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#475569', fontWeight: 500 }}>{item.name}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: item.color, fontWeight: 700, fontSize: '0.85rem' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }}></span>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
