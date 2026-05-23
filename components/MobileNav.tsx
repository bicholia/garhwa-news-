'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Newspaper, TrendingUp, Search, User } from 'lucide-react'

const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Latest', icon: Newspaper, path: '/news' },
    { name: 'Trending', icon: TrendingUp, path: '/india' },
    { name: 'Search', icon: Search, path: '/search' }
]

export default function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/90 dark:bg-ndtv-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-[2000] pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    const Icon = item.icon
                    return (
                        <Link 
                            key={item.name} 
                            href={item.path}
                            className={`flex flex-col items-center justify-center gap-1 w-full transition-all duration-300 ${isActive ? 'text-brand-red scale-110' : 'text-gray-400'}`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
