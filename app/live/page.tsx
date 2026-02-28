'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import PublicLayout from '@/components/PublicLayout'

export default function LivePage() {
    const [time, setTime] = useState('')
    const [liveUpdates, setLiveUpdates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch initial data
        const fetchUpdates = async () => {
            try {
                const data = await client.fetch(`*[_type == "liveUpdate"] | order(publishedAt desc)`)
                setLiveUpdates(data)
            } catch (error) {
                console.error('Failed to fetch live updates:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUpdates()

        // Timer
        setTime(new Date().toLocaleTimeString('hi-IN'))
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('hi-IN'))
        }, 1000)

        // Real-time listener (optional, but good for "live")
        const subscription = client.listen(`*[_type == "liveUpdate"]`).subscribe((update) => {
            fetchUpdates()
        })

        return () => {
            clearInterval(interval)
            subscription.unsubscribe()
        }
    }, [])

    return (
        <PublicLayout>
            <div style={{ background: '#f4f5f7', minHeight: '100vh', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
                <div className="container" style={{ maxWidth: 760 }}>

                    {/* Live header */}
                    <div style={{ background: '#111827', color: 'white', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dc2626', padding: '4px 12px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 900 }}>
                                    <span className="live-pulse" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                                    LIVE
                                </span>
                                <h1 style={{ fontWeight: 900, fontSize: '1.3rem' }}>ब्रेकिंग लाइव ब्लॉग</h1>
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: '0.82rem', fontFamily: 'monospace' }}>{time}</span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '0.83rem' }}>गढ़वा-पलामू की ताज़ा खबरें मिनट-दर-मिनट</p>
                    </div>

                    {/* Updates */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>अपडेट लोड हो रहे हैं...</div>
                        ) : liveUpdates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', background: 'white', borderRadius: 10 }}>अभी कोई लाइव अपडेट नहीं है।</div>
                        ) : (
                            liveUpdates.map((update, i) => (
                                <div key={i} style={{
                                    background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                    borderLeft: `4px solid ${update.isNew ? '#dc2626' : '#e5e7eb'}`,
                                    display: 'flex', gap: '1rem', alignItems: 'flex-start'
                                }}>
                                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 50 }}>
                                        <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontFamily: 'monospace', display: 'block' }}>
                                            {new Date(update.publishedAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {update.isNew && (
                                            <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, marginTop: 3, display: 'block', letterSpacing: 1 }}>NEW</span>
                                        )}
                                    </div>
                                    <p style={{ color: '#111827', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.5, flex: 1 }}>{update.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Telegram CTA */}
                    <div className="cta-block cta-tg" style={{ marginTop: '2rem' }}>
                        <div>
                            <h2>Telegram पर Live अपडेट पाएं</h2>
                            <p>हर मिनट की खबर सबसे पहले आपके Telegram पर</p>
                        </div>
                        <a href="https://t.me/garhwapalamunews" target="_blank" rel="noopener" className="cta-btn">
                            Channel Join करें
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
