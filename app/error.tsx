'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('NR Daily News UI Error Caught:', error)
    }, [error])

    return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
            <div style={{ textAlign: 'center', maxWidth: '30rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><AlertTriangle size={48} color="#f59e0b" /></div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
                    सामग्री लोड नहीं हो सकी
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
                    जिस पेज को आप खोलने का प्रयास कर रहे हैं या जो डेटा आप देख रहे हैं, उसमें कोई समस्या आ गई है। कृपया पेज को रीफ्रेश करें।
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => reset()}
                        style={{ padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                        पेज रीलोड करें
                    </button>
                    <Link
                        href="/"
                        style={{ padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none' }}
                    >
                        होम पेज
                    </Link>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#991b1b', overflowX: 'auto' }}>
                        <strong>Developer Error details:</strong><br />
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    )
}
