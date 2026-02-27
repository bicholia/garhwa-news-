'use client'

import { useState, useRef } from 'react'
import { useProfile } from '@/lib/ProfileContext'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'Noto Sans Devanagari','Inter',sans-serif",
    boxSizing: 'border-box' as const,
    background: 'white',
    transition: 'border-color 0.15s'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
}

const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.75rem',
    border: '1px solid #e2e8f0',
    marginBottom: '1.5rem'
}

export default function SettingsPage() {
    const { profile, updateProfile } = useProfile()
    const photoInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [saved, setSaved] = useState('')
    const [error, setError] = useState('')

    // Local edit state
    const [name, setName] = useState(profile.name)
    const [role, setRole] = useState(profile.role)

    const showSaved = (msg: string) => {
        setSaved(msg)
        setError('')
        setTimeout(() => setSaved(''), 3000)
    }

    const saveProfile = () => {
        if (!name.trim()) { setError('नाम खाली नहीं हो सकता'); return }
        updateProfile({ name: name.trim(), role: role.trim() })
        showSaved('प्रोफाइल अपडेट हो गई!')
    }

    const handlePhotoUpload = async (file: File) => {
        setUploading(true)
        setError('')
        const fd = new FormData()
        fd.append('file', file)
        try {
            const res = await fetch('/api/admin/profile', { method: 'POST', body: fd })
            const data = await res.json()
            if (res.ok) {
                updateProfile({ photoUrl: data.url })
                showSaved('प्रोफाइल फोटो अपलोड हो गई!')
            } else {
                setError('Upload failed: ' + data.error)
            }
        } catch {
            setError('Server error during upload')
        } finally {
            setUploading(false)
        }
    }

    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div style={{ maxWidth: '680px' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        सेटिंग्स और प्रोफाइल
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.3rem', fontSize: '0.9rem' }}>
                        अपनी प्रोफाइल जानकारी और सिस्टम सेटिंग्स यहाँ अपडेट करें
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {saved && (
                <div style={{ padding: '0.85rem 1.25rem', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '0.75rem', color: '#15803d', fontWeight: 600, marginBottom: '1.25rem' }}>
                    {saved}
                </div>
            )}
            {error && (
                <div style={{ padding: '0.85rem 1.25rem', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '0.75rem', color: '#dc2626', fontWeight: 600, marginBottom: '1.25rem' }}>
                    {error}
                </div>
            )}

            {/* ===== PROFILE PHOTO ===== */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    प्रोफाइल फोटो
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Current Photo */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            border: '3px solid #dc2626',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #dc2626, #7f1d1d)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(220,38,38,0.3)'
                        }}>
                            {profile.photoUrl ? (
                                <img src={profile.photoUrl} alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'white', fontWeight: 900, fontSize: '2rem' }}>{initials}</span>
                            )}
                        </div>
                        {/* Change button overlay */}
                        <button
                            onClick={() => photoInputRef.current?.click()}
                            style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: '28px', height: '28px',
                                background: '#dc2626', color: 'white',
                                border: '2px solid white', borderRadius: '50%',
                                cursor: 'pointer', fontSize: '0.75rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Change photo"
                        >Edit</button>
                    </div>

                    <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>{name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.2rem' }}>{role}</div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => photoInputRef.current?.click()}
                                disabled={uploading}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    background: uploading ? '#94a3b8' : '#dc2626',
                                    color: 'white', border: 'none', borderRadius: '0.6rem',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit'
                                }}
                            >
                                {uploading ? 'अपलोड...' : 'तस्वीर बदलें'}
                            </button>
                            {profile.photoUrl && (
                                <button
                                    onClick={() => updateProfile({ photoUrl: '' })}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        background: '#f8fafc', color: '#dc2626',
                                        border: '1.5px solid #fca5a5', borderRadius: '0.6rem',
                                        cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit'
                                    }}
                                >
                                    हटाएं
                                </button>
                            )}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            JPG, PNG, WebP — Max 5MB
                        </div>
                    </div>
                </div>

                <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handlePhotoUpload(f)
                        e.target.value = ''
                    }}
                />
            </div>

            {/* ===== PROFILE INFO ===== */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    प्रोफाइल जानकारी
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>आपका नाम (Full Name)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="जैसे: Bharat Kumar"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>पद / Role</label>
                        <input
                            type="text"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            placeholder="जैसे: Chief Editor, Reporter"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <button
                        onClick={saveProfile}
                        style={{
                            padding: '0.85rem 1.5rem',
                            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                            color: 'white', border: 'none', borderRadius: '0.75rem',
                            fontWeight: 700, fontSize: '0.95rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                            boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                            alignSelf: 'flex-start'
                        }}
                    >
                        प्रोफाइल सेव करें
                    </button>
                </div>
            </div>

            {/* ===== SECURITY SETTINGS ===== */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    सुरक्षा जानकारी
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { label: 'Secret Login URL', value: `localhost:3000/admin/login`, icon: '🔗' },
                        { label: 'Admin Password', value: '•••••••••••••• (env में सेट है)', icon: '🔑' },
                        { label: 'Session Duration', value: '24 घंटे', icon: '⏱️' },
                        { label: 'Rate Limit', value: '5 attempts / minute', icon: '🛡️' },
                    ].map(item => (
                        <div key={item.label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.75rem 1rem',
                            background: '#f8fafc', borderRadius: '0.6rem',
                            border: '1px solid #f1f5f9'
                        }}>
                            <span style={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                                {item.label}
                            </span>
                            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '0.75rem', fontSize: '0.82rem', color: '#92400e' }}>
                    पासवर्ड बदलने के लिए <strong>.env.local</strong> file में <code>ADMIN_PASSWORD</code> update करें और server restart करें।
                </div>
            </div>

            {/* ===== Site Config ===== */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    साइट जानकारी
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { label: 'Website', value: 'garhwa-news.vercel.app', color: '#2563eb' },
                        { label: 'Sanity Project', value: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk', color: '#7c3aed' },
                        { label: 'Dataset', value: 'production', color: '#059669' },
                        { label: 'Next.js Version', value: '16.1.6', color: '#0891b2' },
                    ].map(item => (
                        <div key={item.label} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '0.65rem 1rem', background: '#f8fafc',
                            borderRadius: '0.6rem', border: '1px solid #f1f5f9'
                        }}>
                            <span style={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</span>
                            <span style={{ color: item.color, fontWeight: 700, fontSize: '0.85rem' }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
