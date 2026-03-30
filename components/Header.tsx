'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Calendar, Globe, TrendingUp } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import WeatherWidget from '@/components/WeatherWidget'
import Image from 'next/image'

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        checkSize()
        window.addEventListener('resize', checkSize)
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('resize', checkSize)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
        setSearchOpen(false)
    }, [pathname])

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
        if (e.key === 'Escape') {
            setSearchOpen(false)
        }
    }

    const navItems = [
        { name: 'होम', href: '/' },
        { name: 'गढ़वा', href: '/garhwa' },
        { name: 'पलामू', href: '/palamu' },
        { name: 'झारखंड', href: '/jharkhand' },
        { name: 'अपराध', href: '/category/crime' },
        { name: 'प्रशासन', href: '/category/administration' },
        { name: 'शिक्षा-स्वास्थ्य', href: '/category/health-education' },
        { name: 'ग्रामीण विकास', href: '/category/rural-development' },
        { name: 'जनसमस्या', href: '/category/public-issues' },
    ]

    return (
        <>
            <header className={`w-full z-[1000] bg-white transition-all duration-300 ${mounted && isScrolled ? 'shadow-lg' : 'border-b border-gray-100'}`}>
                {/* Top Bar: Breaking News Ticker */}
                <div className="bg-brand-navy text-white h-10 overflow-hidden relative flex items-center">
                    <div className="container flex items-center h-full gap-0">
                        {/* Breaking Badge */}
                        <div className="flex items-center gap-2 bg-brand-gold px-4 h-full z-10 font-black text-[10px] uppercase tracking-widest italic shrink-0 whitespace-nowrap">
                            <TrendingUp size={13} className="animate-pulse" />
                            Breaking
                        </div>

                        {/* Scrolling Ticker */}
                        <div className="flex-1 overflow-hidden relative h-full flex items-center">
                            <div className="ticker-track absolute whitespace-nowrap flex gap-16 text-[11px] font-medium items-center">
                                <span>गढ़वा-पलामू में प्रशासन की बड़ी कार्रवाई, अवैध खनन पर लगाम...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>झारखंड में नई भर्ती योजना का ऐलान, युवाओं में उत्साह...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>पलामू विकास योजनाओं की समीक्षा के लिए पहुंचे मुख्यमंत्री...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>गढ़वा पलामू न्यूज़ — सच्चाई और निष्पक्षता के साथ...</span>
                                {/* Duplicate for seamless loop */}
                                <span>गढ़वा-पलामू में प्रशासन की बड़ी कार्रवाई, अवैध खनन पर लगाम...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>झारखंड में नई भर्ती योजना का ऐलान, युवाओं में उत्साह...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>पलामू विकास योजनाओं की समीक्षा के लिए पहुंचे मुख्यमंत्री...</span>
                                <span className="text-brand-gold">◆</span>
                                <span>गढ़वा पलामू न्यूज़ — सच्चाई और निष्पक्षता के साथ...</span>
                            </div>
                        </div>

                        {/* Date & Weather — client only */}
                        <div className="hidden lg:flex items-center gap-4 ml-4 shrink-0">
                            {mounted && (
                                <>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/60 uppercase tracking-wider">
                                        <Calendar size={11} />
                                        <span suppressHydrationWarning>
                                            {new Date().toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <WeatherWidget />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Branding Section */}
                <div className="py-4 lg:py-5 border-b border-gray-100">
                    <div className="container flex items-center justify-between gap-4">
                        {/* Left Meta — desktop only */}
                        <div className="hidden lg:flex flex-col gap-0.5 items-start w-48 shrink-0">
                            <div className="text-[9px] uppercase font-black tracking-[0.3em] text-brand-gold">Global Network</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                <Globe size={9} /> NR Agency · Intl. Edition
                            </div>
                        </div>

                        {/* Logo — Centered */}
                        <div className="flex-1 flex justify-center">
                            <Link href="/" className="group flex items-center">
                                <Image
                                    src="/logo-new.png"
                                    alt="NR Global News"
                                    width={240}
                                    height={72}
                                    className="h-14 lg:h-16 w-auto transition-all duration-500 group-hover:scale-105 drop-shadow-sm"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="w-48 flex justify-end items-center gap-2 lg:gap-3 shrink-0">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                aria-label="Search"
                            >
                                <Search size={20} className="text-brand-navy" strokeWidth={2.5} />
                            </button>

                            {/* Mobile Menu Button — only after mount */}
                            {mounted && !isDesktop && (
                                <button
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className="p-2.5 rounded-full bg-brand-navy text-white hover:bg-brand-gold transition-colors"
                                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                                >
                                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            )}

                            {/* CTA — desktop */}
                            <Link
                                href="/contact"
                                className="hidden lg:flex px-5 py-2 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-gold transition-all shadow-md hover:-translate-y-0.5"
                            >
                                Subscribe
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation — only show after mount to prevent hydration flash */}
                {mounted && isDesktop && (
                    <nav className="bg-white border-b border-gray-100">
                        <div className="container">
                            <ul className="flex justify-center items-center gap-1 py-0">
                                {navItems.map(item => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`relative inline-flex items-center px-4 py-4 text-[11px] uppercase font-black tracking-widest transition-all duration-200 group
                                                ${pathname === item.href
                                                    ? 'text-brand-gold'
                                                    : 'text-brand-navy hover:text-brand-gold'
                                                }`}
                                        >
                                            {item.name}
                                            <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-gold rounded-full transition-transform duration-300 origin-left
                                                ${pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                )}
            </header>

            {/* Mobile Full-Screen Menu */}
            {mounted && mobileOpen && !isDesktop && (
                <div className="fixed inset-0 bg-white z-[2000] overflow-y-auto">
                    <div className="p-6 min-h-screen flex flex-col">
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center mb-10">
                            <Image src="/logo-new.png" alt="NR Global News" width={140} height={44} className="h-10 w-auto" />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-2.5 bg-gray-100 rounded-full hover:bg-brand-navy hover:text-white transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Mobile Nav Links */}
                        <nav className="flex flex-col gap-2 flex-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-2xl font-black py-3 border-b border-gray-50 transition-colors
                                        ${pathname === item.href ? 'text-brand-gold' : 'text-brand-navy hover:text-brand-gold'}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Footer Links */}
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-brand-gold mb-5">
                                <TrendingUp size={20} />
                                <span className="font-black text-sm uppercase tracking-widest">NR Global Agency</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                <Link href="/about" className="hover:text-brand-gold transition-colors" onClick={() => setMobileOpen(false)}>About Agency</Link>
                                <Link href="/contact" className="hover:text-brand-gold transition-colors" onClick={() => setMobileOpen(false)}>Contact Us</Link>
                                <Link href="/privacy-policy" className="hover:text-brand-gold transition-colors" onClick={() => setMobileOpen(false)}>Privacy</Link>
                                <Link href="/terms" className="hover:text-brand-gold transition-colors" onClick={() => setMobileOpen(false)}>Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Full-Screen Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 bg-brand-navy/97 backdrop-blur-xl z-[3000] flex flex-col items-center justify-center p-6">
                    <button
                        onClick={() => setSearchOpen(false)}
                        className="absolute top-8 right-8 text-white/60 hover:text-brand-gold transition-colors p-3 rounded-full hover:bg-white/10"
                        aria-label="Close search"
                    >
                        <X size={36} strokeWidth={1.5} />
                    </button>
                    <div className="w-full max-w-2xl">
                        <p className="text-brand-gold font-black uppercase tracking-[0.4em] mb-8 text-center text-[10px]">
                            Search NR Global Archives
                        </p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="खोजें..."
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-3xl lg:text-5xl text-white font-serif focus:outline-none focus:border-brand-gold transition-colors placeholder:text-white/20"
                            />
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                                        setSearchOpen(false)
                                        setSearchQuery('')
                                    }
                                }}
                                className="absolute right-0 bottom-4 text-white/40 hover:text-brand-gold transition-colors"
                            >
                                <Search size={32} strokeWidth={1.5} />
                            </button>
                        </div>
                        <p className="text-white/30 mt-5 text-center text-xs font-medium">Press Enter or click to search · Escape to close</p>
                    </div>
                </div>
            )}

            {/* Ticker Animation — global style in Next.js App Router */}
            <style>{`
                .ticker-track {
                    animation: ticker 60s linear infinite;
                    will-change: transform;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </>
    )
}
