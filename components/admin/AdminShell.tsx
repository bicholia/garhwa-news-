'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/lib/ProfileContext'

import { useState } from 'react'
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, Radio, Menu, X } from 'lucide-react'

const navigation = [
    { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'ऑटो-पायलट', href: '/admin/dashboard/auto-pilot', icon: <Radio size={18} /> },
    { name: 'सभी न्यूज़', href: '/admin/dashboard/posts', icon: <FileText size={18} /> },
    { name: 'नई खबर लिखें', href: '/admin/dashboard/posts/new', icon: <PlusCircle size={18} /> },
    { name: 'इमेज मैनेजर', href: '/admin/dashboard/image-manager', icon: <PlusCircle size={18} /> },
    { name: 'सेटिंग्स', href: '/admin/dashboard/settings', icon: <Settings size={18} /> },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile } = useProfile()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 45,
                        backdropFilter: 'blur(4px)'
                    }}
                    className="lg:hidden"
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <aside style={{
                background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
                position: 'fixed', left: 0, top: 0, bottom: 0,
                display: 'flex', flexDirection: 'column',
                zIndex: 50, overflowY: 'auto',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className={`w-[240px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Brand & Close button on mobile */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                    <div className="overflow-hidden">
                        <div className="text-red-500 font-black text-sm md:text-base tracking-tight flex items-center gap-2 whitespace-nowrap">
                            <FileText size={18} /> ThinkIndia.press
                        </div>
                        <div className="text-indigo-400 text-[10px] mt-0.5 uppercase tracking-widest font-bold truncate">
                            Admin Control Panel
                        </div>
                    </div>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden"
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>
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
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                onClick={() => setIsSidebarOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.65rem 0.85rem', borderRadius: '0.5rem',
                                    marginBottom: '2px',
                                    background: isActive ? 'rgba(239,68,68,0.9)' : 'transparent',
                                    color: isActive ? 'white' : '#94a3b8',
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.875rem', textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
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
            <div className="flex-1 flex flex-col lg:ml-[240px]">
                {/* Top Header */}
                <header className="h-[58px] bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shadow-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Hamburger for mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden"
                            style={{ 
                                background: '#f1f5f9', border: '1px solid #e2e8f0', 
                                borderRadius: '0.5rem', padding: '0.4rem',
                                color: '#475569', cursor: 'pointer'
                            }}
                        >
                            <Menu size={20} />
                        </button>

                        {/* Breadcrumb area */}
                        <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }} className="hidden sm:block">
                            {pathname === '/admin/dashboard' && 'डैशबोर्ड'}
                            {pathname === '/admin/dashboard/posts' && 'सभी खबरें'}
                            {pathname === '/admin/dashboard/posts/new' && 'नई खबर लिखें'}
                            {pathname === '/admin/dashboard/image-manager' && 'इमेज मैनेजर'}
                            {pathname === '/admin/dashboard/settings' && 'सेटिंग्स / प्रोफाइल'}
                        </div>
                    </div>

                    {/* Profile in Header */}
                    <Link href="/admin/dashboard/settings" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-brand-red flex items-center justify-center flex-shrink-0">
                            {profile.photoUrl ? (
                                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-black text-[10px]">{initials}</span>
                            )}
                        </div>
                        <span className="hidden sm:inline text-slate-700 text-sm font-bold truncate max-w-[100px]">{profile.name}</span>
                    </Link>
                </header>

                <main className="p-4 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
