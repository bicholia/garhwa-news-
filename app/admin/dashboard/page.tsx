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
        const [total, today, cmsCheck, missingImagesCount] = await Promise.all([
            client.fetch(`count(*[_type == "article"])`),
            client.fetch(
                `count(*[_type == "article" && publishedAt >= $from])`,
                { from: new Date(new Date().setHours(0, 0, 0, 0)).toISOString() }
            ),
            client.fetch(`count(*[_id == "nonexistent"])`).then(() => 'Online').catch(() => 'Offline'),
            client.fetch(`count(*[_type == "article" && !defined(featureImage)])`)
        ])
        
        const telegramStatus = process.env.TELEGRAM_BOT_TOKEN ? 'Connected' : 'Not Configured'
        
        return { 
            total, 
            today, 
            cmsStatus: cmsCheck, 
            telegramStatus,
            missingImages: missingImagesCount
        }
    } catch {
        return { total: 0, today: 0, cmsStatus: 'Offline', telegramStatus: 'Unknown' }
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const statCards = [
        { label: 'कुल खबरें', value: stats.total, color: '#2563eb', bg: '#eff6ff', icon: <Newspaper size={28} color="#2563eb" /> },
        { label: 'आज की खबरें', value: stats.today, color: '#059669', bg: '#f0fdf4', icon: <Sparkles size={28} color="#059669" /> },
        { label: 'बिना फोटो वाली', value: stats.missingImages, color: '#dc2626', bg: '#fef2f2', icon: <UploadCloud size={28} color="#dc2626" /> },
        { label: 'CMS Status', value: stats.cmsStatus, color: stats.cmsStatus === 'Online' ? '#7c3aed' : '#dc2626', bg: '#f5f3ff', icon: <CheckCircle2 size={28} color={stats.cmsStatus === 'Online' ? '#7c3aed' : '#dc2626'} /> },
    ]

    return (
        <div>
            {/* Welcome */}
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-slate-900 m-0">
                    नमस्ते, Admin!
                </h1>
                <p className="text-slate-500 mt-1 lg:mt-1.5 text-xs lg:text-sm">
                    ThinkIndia.press Admin Panel — आज की तारीख: {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                        <div className="mb-2 md:mb-3">{card.icon}</div>
                        <div className="text-2xl md:text-4xl font-extrabold" style={{ color: card.color }}>{card.value}</div>
                        <div className="text-slate-500 font-semibold text-[10px] md:text-sm mt-1 uppercase tracking-wider">{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

                <Link href="/admin/dashboard/image-manager" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: '2px solid #ef4444',
                    color: '#0f172a', padding: '1.5rem', borderRadius: '1rem',
                    textDecoration: 'none', fontWeight: 700,
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer'
                }}
                >
                    <span style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}><UploadCloud size={36} color="#dc2626" /></span>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>🖼️ इमेज मैनेजर</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>बिना फोटो वाली खबरें फिक्स करें</div>
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    सिस्टम स्टेटस
                </h2>
                {[
                    { name: 'Sanity CMS', status: 'Connected', color: '#059669' },
                    { name: 'Next.js Server', status: 'Running', color: '#059669' },
                    { name: 'Admin Session', status: 'Active', color: '#059669' },
                ].map(item => (
                    <div key={item.name} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                        <span className="text-slate-600 font-medium text-sm">{item.name}</span>
                        <span className="flex items-center gap-2 font-bold text-xs" style={{ color: item.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: item.color }}></span>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
