'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, Calendar, Globe, TrendingUp, PlayCircle, Sun, Moon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/lib/ThemeContext'
import WeatherWidget from '@/components/WeatherWidget'
import Image from 'next/image'

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)
    const [breakingNews, setBreakingNews] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()

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

    useEffect(() => {
        if (!mounted) return
        fetch('/api/news/breaking')
            .then(res => res.json())
            .then(data => setBreakingNews(data))
            .catch(() => setBreakingNews([]))

        // LAZY CRON INTEGRATION
        const lastLazyRun = localStorage.getItem('th_lazy_cron_agent');
        const now = Date.now();
        if (!lastLazyRun || now - parseInt(lastLazyRun) > 3 * 60 * 60 * 1000) {
            localStorage.setItem('th_lazy_cron_agent', now.toString());
            fetch('/api/ai-news-agent?manual=true').catch(() => {});
        }
    }, [mounted])

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

    const mainNav = [
        { name: 'HOME', href: '/' },
        { name: 'INDIA', href: '/india' },
        { name: 'LATEST', href: '/news' },
        { name: 'GARHWA', href: '/garhwa' },
        { name: 'PALAMU', href: '/palamu' },
        { name: 'JHARKHAND', href: '/jharkhand' },
        { name: 'CRIME', href: '/category/crime' },
        { name: 'EDUCATION', href: '/category/health-education' },
    ]

    const quickLinks = [
        { name: 'Breaking News', href: '/news' },
        { name: 'International News', href: '/category/international' },
        { name: 'National News', href: '/category/national' },
        { name: 'Life Update', href: '/category/life-update' },
        { name: 'Weather Update', href: '/category/weather' },
        { name: 'Crime Report', href: '/category/crime' }
    ]

    return (
        <>
            <header className={`w-full z-[1000] transition-all duration-500 ease-in-out ${isScrolled ? 'fixed top-0 shadow-premium backdrop-blur-md bg-ndtv-black/95' : 'relative bg-ndtv-black'}`}>
                {/* TIER 1: Main Bar */}
                <div className="text-white border-b border-white/5">
                    <div className="container flex items-center justify-between h-12 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-8 lg:gap-12">
                            <Link href="/" className="shrink-0 flex items-center group">
                                <span className="text-2xl lg:text-3xl font-black tracking-tighter flex items-center gap-2">
                                    <span className="text-white uppercase group-hover:text-brand-red transition-all duration-300">THINKINDIA</span>
                                    <span className="text-brand-red uppercase group-hover:text-white transition-all duration-300">NEWS</span>
                                </span>
                            </Link>

                            {/* Main Desktop Nav */}
                            {isDesktop && (
                                <nav className="hidden lg:block h-full">
                                    <ul className="flex items-center gap-8 h-full text-[13px] font-bold tracking-widest">
                                        {mainNav.map(item => (
                                            <li key={item.name} className="h-full flex items-center relative group/nav">
                                                <Link 
                                                    href={item.href} 
                                                    className={`hover:text-brand-red transition-all duration-300 uppercase ${pathname === item.href ? 'text-brand-red' : 'text-gray-300'}`}
                                                >
                                                    {item.name}
                                                </Link>
                                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-red transition-transform duration-300 origin-left ${pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 lg:gap-5">
                            <button 
                                onClick={() => setSearchOpen(true)}
                                className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 group"
                                aria-label="Search"
                            >
                                <Search size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button 
                                onClick={toggleTheme}
                                className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 text-brand-red group"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={18} className="group-hover:rotate-90 transition-transform" /> : <Moon size={18} className="group-hover:-rotate-12 transition-transform" />}
                            </button>
                            {!isDesktop && (
                                <button 
                                    onClick={() => setMobileOpen(true)} 
                                    className="p-2.5 hover:bg-white/10 rounded-full transition-all"
                                    aria-label="Menu"
                                >
                                    <Menu size={22} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* TIER 2: White Trending Bar */}
                {!isScrolled && isDesktop && (
                    <div className="bg-white border-b border-gray-200 py-2 overflow-hidden">
                        <div className="container flex items-center gap-4">
                            <div className="bg-brand-red text-white text-[10px] font-black px-2 py-1 rounded inline-flex shrink-0">
                                QUICK LINKS
                            </div>
                            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                                {quickLinks.map((link, idx) => (
                                    <Link 
                                        key={idx} 
                                        href={link.href}
                                        className="whitespace-nowrap text-[12px] font-medium text-gray-600 hover:text-brand-red border-r border-gray-200 last:border-0 pr-6"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[2000] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-0 right-0 w-[280px] h-full bg-ndtv-black text-white p-6 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-xl font-black tracking-tighter">
                                THINK<span className="text-brand-red">INDIA</span> NEWS
                            </span>
                            <button onClick={() => setMobileOpen(false)} className="hover:rotate-90 transition-transform" aria-label="Close menu"><X size={24} /></button>
                        </div>
                        <nav className="flex flex-col gap-6 font-bold text-lg">
                            {mainNav.map(item => (
                                <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto space-y-4 pt-10 border-t border-white/10">
                            <WeatherWidget />
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">© 2026 ThinkIndia News</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 bg-ndtv-black/95 z-[3000] flex items-center justify-center p-6 backdrop-blur-md">
                    <button onClick={() => setSearchOpen(false)} className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform" aria-label="Close search">
                        <X size={36} strokeWidth={1.5} />
                    </button>
                    <div className="w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="Type to search..."
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-transparent border-b-4 border-white pb-4 text-4xl lg:text-6xl text-white font-bold outline-none placeholder:text-white/20"
                        />
                        <p className="mt-6 text-white/40 font-medium">Press ENTER to reveal the news archives.</p>
                    </div>
                </div>
            )}
        </>
    )
}
