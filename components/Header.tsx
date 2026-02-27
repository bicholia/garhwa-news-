'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Phone } from 'lucide-react'

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)

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
            <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <div style={{ background: '#b91c1c', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 900, lineHeight: 1.1 }}>
                            <span style={{ display: 'block', color: '#fde68a', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 700 }}>NR DAILY</span>
                            NEWS
                        </div>
                        <div style={{ display: isDesktop ? 'block' : 'none' }}>
                            <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem', lineHeight: 1 }}>गढ़वा पलामू न्यूज़</div>
                            <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>सच्चाई के साथ</div>
                        </div>
                    </Link>

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

                        <a href="https://wa.me/918789320315" target="_blank" rel="noopener noreferrer"
                            style={{ background: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, display: isDesktop ? 'flex' : 'none', alignItems: 'center', gap: 6 }}>
                            WHATSAPP
                        </a>

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
