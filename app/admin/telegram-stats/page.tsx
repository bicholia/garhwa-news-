import { getTelegramStats } from '@/lib/telegram'
import Link from 'next/link'

export const revalidate = 300 // Update stats every 5 minutes

export default async function TelegramStats() {
    const stats = await getTelegramStats()

    return (
        <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', padding: '2.5rem', maxWidth: 800, margin: '0 auto' }}>
                <div style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link
                            href="/admin/dashboard"
                            style={{
                                width: '38px', height: '38px',
                                background: 'white', border: '1.5px solid #e2e8f0',
                                borderRadius: '0.6rem', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#64748b', textDecoration: 'none',
                                fontSize: '1.1rem', flexShrink: 0
                            }}
                        >
                            ←
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 }}>Telegram Channel Analysis</h1>
                    </div>
                    <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>LIVE CONNECTED</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.5rem 0', fontWeight: 600 }}>SUBSCRIBERS</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>{stats.subscribers}</p>
                    </div>

                    <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.5rem 0', fontWeight: 600 }}>LAST SYNC</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>{stats.lastPost}</p>
                    </div>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.75rem', marginTop: 0 }}>System Automation Status</h2>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#3b82f6', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        <li>Article Pubished &rarr; Instant Telegram Notification (Webhook: Active)</li>
                        <li>30-Minute Synchronization &rarr; Safety Backup (Cron: Active)</li>
                        <li>SEO Tags &rarr; Global (Optimization: Enabled)</li>
                    </ul>
                </div>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <Link href="/admin/dashboard" style={{ color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
                        &larr; Return to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    )
}
