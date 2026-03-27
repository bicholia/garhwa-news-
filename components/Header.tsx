'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Phone, ArrowLeft, Calendar, Mail } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import WeatherWidget from '@/components/WeatherWidget'
import Image from 'next/image'

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const checkSize = () => setIsDesktop(window.innerWidth >= 768)
        checkSize()
        window.addEventListener('resize', checkSize)
        return () => window.removeEventListener('resize', checkSize)
    }, [])

    const navItems = [
        { name: 'होम', href: '/' },
        { name: 'गढ़वा', href: '/garhwa' },
        { name: 'पलामू', href: '/palamu' },
        { name: 'झारखंड', href: '/jharkhand' },
        { name: 'अपराध', href: '/category/crime' },
        { name: 'प्रशासन', href: '/category/administration' },
        { name: 'स्वास्थ्य', href: '/category/health-education' },
        { name: 'ग्रामीण विकास', href: '/category/rural-development' },
        { name: 'जनसमस्या', href: '/category/public-issues' },
    ]

    return (
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Top Bar for Weather and Date */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9', height: '40px', display: 'flex', alignItems: 'center' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                            <Calendar size={14} />
                            {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                            <Mail size={16} />
                            <span className="text-sm">संपर्क करें</span>
                        </div>
                        <WeatherWidget />
                    </div>
                    {isDesktop && (
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', letterSpacing: '1px' }}>
                            NR DAILY NEWS &bull; TRUTH ABOVE ALL
                        </div>
                    )}
                </div>
            </div>
            <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                    {/* Left Actions - Logo & Back */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {pathname !== '/' && (
                            <button
                                onClick={() => router.back()}
                                style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                aria-label="Go Back"
                            >
                                <ArrowLeft size={20} color="#374151" />
                            </button>
                        )}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Image 
                                src="/logo.png" 
                                alt="NR Daily News Logo" 
                                width={isDesktop ? 150 : 120} 
                                height={isDesktop ? 50 : 40} 
                                style={{ height: isDesktop ? '50px' : '40px', width: 'auto' }}
                                priority
                            />
                            <div style={{ display: isDesktop ? 'block' : 'none' }}>
                                <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem', lineHeight: 1 }}>गढ़वा पलामू न्यूज़</div>
                                <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>सच्चाई के साथ</div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    {isDesktop && (
                        <nav style={{ display: 'flex', gap: '20px' }}>
                            {navItems.map(item => (
                                <Link key={item.name} href={item.href} style={{ color: '#374151', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s' }} className="hover:text-red-600">
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Right actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {searchOpen ? (
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: 20, padding: '4px 12px' }}>
                                <input
                                    type="text"
                                    placeholder="खोजें..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = (e.target as HTMLInputElement).value
                                            if (val) {
                                                window.location.href = `/search?q=${encodeURIComponent(val)}`
                                            }
                                        }
                                    }}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: 120 }}
                                    aria-label="Search articles"
                                />
                                <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', padding: 4 }} aria-label="Close search">
                                    <X size={16} color="#6b7280" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setSearchOpen(true)}
                                style={{ padding: 12, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                aria-label="Open Search">
                                <Search size={20} style={{ color: '#374151' }} />
                            </button>
                        )}

                        {!isDesktop && (
                            <button onClick={() => setMobileOpen(!mobileOpen)}
                                style={{ background: 'none', border: 'none', padding: 11, cursor: 'pointer', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                aria-label={mobileOpen ? "Close Menu" : "Open Menu"}>
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && !isDesktop && (
                    <div style={{ paddingBottom: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px' }}>
                        {navItems.map(item => (
                            <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}
                                style={{ color: '#111827', fontWeight: 600, fontSize: '1rem', padding: '4px 0' }}>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}
