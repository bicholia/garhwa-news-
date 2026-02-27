'use client'

import React from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="hi">
            <body>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
                    <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '32rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#dc2626', margin: 0 }}>500</h1>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
                            गंभीर तकनीकी समस्या
                        </h2>
                        <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: 1.6 }}>
                            सर्वर से संपर्क करने या डेटा लोड करने में कोई तकनीकी समस्या आ गई है। हमारी टीम इसे ठीक कर रही है।
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => reset()}
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#dc2626', color: 'white', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                                पुनः प्रयास करें
                            </button>
                            <a
                                href="/"
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
                            >
                                होम पेज पर जाएं
                            </a>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <pre style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', textAlign: 'left', fontSize: '0.8rem', overflowX: 'auto', borderRadius: '0.5rem', color: '#ef4444' }}>
                                {error.message}
                                {'\n'}
                                {error.stack}
                            </pre>
                        )}
                    </div>
                </div>
            </body>
        </html>
    )
}
