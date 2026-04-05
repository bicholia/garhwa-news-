'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, Sparkles, Zap } from 'lucide-react'

const navigation = [
    { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Neural Quick-Post', href: '/admin/dashboard/quick-post', icon: <Zap size={18} fill="#6366f1" color="#6366f1" /> },
    { name: 'सभी न्यूज़', href: '/admin/dashboard/posts', icon: <FileText size={18} /> },
    { name: 'नई न्यूज़ लिखें', href: '/admin/dashboard/posts/new', icon: <PlusCircle size={18} /> },
    { name: 'सेटिंग्स', href: '/admin/dashboard/settings', icon: <Settings size={18} /> },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push('/')
    }

    return (
        <div style={{
            width: '240px',
            background: '#0f172a',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0, top: 0,
            zIndex: 50,
            fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif"
        }}>
            {/* Brand */}
            <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
                <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                    NR Daily News
                </div>
                <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Admin Control Panel
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.7rem 0.85rem',
                                borderRadius: '0.5rem',
                                marginBottom: '2px',
                                background: isActive ? '#dc2626' : 'transparent',
                                color: isActive ? 'white' : '#94a3b8',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1e293b' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '0.5rem',
                        background: 'transparent',
                        color: '#64748b',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        width: '100%',
                        fontFamily: 'inherit',
                        transition: 'color 0.2s'
                    }}
                >
                    <LogOut size={16} />
                    लॉगआउट (Logout)
                </button>
            </div>
        </div>
    )
}
