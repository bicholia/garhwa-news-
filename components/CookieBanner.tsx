'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if consent was already given
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Show banner with a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
        return () => { }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true')
        setIsVisible(false)
        // Track interest silently
        fetch('/api/track-interest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'cookie_accept' })
        }).catch(err => console.error('Tracking failed:', err))
    }

    if (!isVisible) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 48px)',
            maxWidth: '600px',
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                        <path d="M12 12L2.5 12" />
                        <path d="M12 12l9.5 0" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M16 8h.01" />
                        <path d="M17 13h.01" />
                        <path d="M9 15h.01" />
                        <path d="M7 10h.01" />
                        <path d="M12 18h.01" />
                    </svg>
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        margin: 0,
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        कुकीज़ और गोपनीयता (Cookies & Privacy)
                    </h3>
                    <p style={{
                        margin: '4px 0 0',
                        color: '#9ca3af',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        fontFamily: "'Noto Sans Devanagari', sans-serif"
                    }}>
                        हम अपनी वेबसाइट पर आपको बेहतर अनुभव देने के लिए कुकीज़ का उपयोग करते हैं। हमारी वेबसाइट का उपयोग जारी रखकर, आप हमारी <Link href="/privacy-policy" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link> से सहमत होते हैं।
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        border: '1px solid #374151',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#1f2937'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
                >
                    बाद में
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                    स्वीकार करें
                </button>
            </div>
        </div>
    )
}
