'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/lib/ProfileContext'

import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, Radio } from 'lucide-react'

const navigation = [
    { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'ऑटो-पायलट', href: '/admin/dashboard/auto-pilot', icon: <Radio size={18} /> },
    { name: 'सभी न्यूज़', href: '/admin/dashboard/posts', icon: <FileText size={18} /> },
    { name: 'नई खबर लिखें', href: '/admin/dashboard/posts/new', icon: <PlusCircle size={18} /> },
    { name: 'सेटिंग्स', href: '/admin/dashboard/settings', icon: <Settings size={18} /> },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile } = useProfile()

    const handleLogout = () => {
        document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/')
    }

    const initials = profile.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Noto Sans Devanagari','Inter',sans-serif" }}>

            {/* ===== SIDEBAR ===== */}
            <aside style={{
                width: '240px',
                background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
                position: 'fixed', left: 0, top: 0, bottom: 0,
                display: 'flex', flexDirection: 'column',
                zIndex: 50, overflowY: 'auto'
            }}>
                {/* Brand */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} /> ThinkIndia.press
                    </div>
                    <div style={{ color: '#6366f1', fontSize: '0.68rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Admin Control Panel
                    </div>
                </div>

                {/* Profile Card in Sidebar */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '44px', height: '44px',
                            borderRadius: '50%',
                            border: '2px solid rgba(239,68,68,0.6)',
                            overflow: 'hidden', flexShrink: 0,
                            background: '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {profile.photoUrl ? (
                                <img src={profile.photoUrl} alt={profile.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>{initials}</span>
                            )}
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>
                                {profile.name}
                            </div>
                            <div style={{ color: '#a5b4fc', fontSize: '0.72rem', marginTop: '2px' }}>
                                {profile.role}
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/dashboard/settings" style={{
                        display: 'block', marginTop: '0.75rem',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255,255,255,0.07)',
                        color: '#94a3b8', fontSize: '0.75rem',
                        borderRadius: '6px', textDecoration: 'none',
                        textAlign: 'center' as const,
                        transition: 'background 0.2s'
                    }}>
                        Profile Edit करें
                    </Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0.75rem' }}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.65rem 0.85rem', borderRadius: '0.5rem',
                                marginBottom: '2px',
                                background: isActive ? 'rgba(239,68,68,0.9)' : 'transparent',
                                color: isActive ? 'white' : '#94a3b8',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.875rem', textDecoration: 'none',
                                transition: 'all 0.2s'
                            }}>
                                <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' as const }}>{item.icon}</span>
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '0.65rem 0.85rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#f87171', border: 'none', borderRadius: '0.5rem',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                        fontFamily: 'inherit', transition: 'background 0.2s'
                    }}>
                        <LogOut size={16} /> लॉगआउट
                    </button>
                </div>
            </aside>

            {/* ===== MAIN ===== */}
            <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <header style={{
                    height: '58px', background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center',
                    padding: '0 1.5rem',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 40,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    {/* Breadcrumb area */}
                    <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                        {pathname === '/admin/dashboard' && 'डैशबोर्ड'}
                        {pathname === '/admin/dashboard/posts' && 'सभी खबरें'}
                        {pathname === '/admin/dashboard/posts/new' && 'नई खबर लिखें'}
                        {pathname === '/admin/dashboard/settings' && 'सेटिंग्स / प्रोफाइल'}
                    </div>

                    {/* Profile in Header */}
                    <Link href="/admin/dashboard/settings" style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        textDecoration: 'none', padding: '0.3rem 0.75rem',
                        borderRadius: '2rem', background: '#f8fafc',
                        border: '1px solid #e2e8f0', transition: 'background 0.2s'
                    }}>
                        <div style={{
                            width: '30px', height: '30px',
                            borderRadius: '50%', overflow: 'hidden',
                            background: '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {profile.photoUrl ? (
                                <img src={profile.photoUrl} alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '0.75rem' }}>{initials}</span>
                            )}
                        </div>
                        <span style={{ color: '#374151', fontSize: '0.85rem', fontWeight: 600 }}>{profile.name}</span>
                    </Link>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    )
}
