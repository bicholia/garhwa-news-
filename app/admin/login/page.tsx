'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                setError(data.error || 'गलत पासवर्ड')
            }
        } catch (err) {
            setError('सर्वर से कनेक्ट नहीं हो पाया')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'white',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 8px 20px rgba(220,38,38,0.4)'
                    }}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        एडमिन लॉगिन
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                        NR Daily News — Secure Access
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fca5a5',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                            marginBottom: '1.25rem',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#374151',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            पासवर्ड (Password)
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit',
                                transition: 'border-color 0.15s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 15px rgba(220,38,38,0.4)',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        {loading ? 'वेरिफाई हो रहा है...' : 'डैशबोर्ड खोलें →'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                    © {new Date().getFullYear()} NR Daily News. Unauthorized access is prohibited.
                </p>
            </div>
        </div>
    )
}
