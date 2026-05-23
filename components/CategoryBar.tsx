'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
    { name: 'Latest', href: '/news' },
    { name: 'India', href: '/india' },
    { name: 'Garhwa', href: '/garhwa' },
    { name: 'Palamu', href: '/palamu' },
    { name: 'Crime', href: '/category/crime' },
    { name: 'Politics', href: '/category/politics' },
    { name: 'Sports', href: '/category/sports' },
]

export default function CategoryBar() {
    const pathname = usePathname()

    return (
        <div className="bg-white dark:bg-ndtv-black border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar hidden lg:flex w-full">
            <div className="flex items-center px-4 h-10 gap-6 whitespace-nowrap">
                {categories.map((cat) => (
                    <Link 
                        key={cat.name} 
                        href={cat.href}
                        className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === cat.href ? 'text-brand-red border-b-2 border-brand-red h-full flex items-center mt-0.5' : 'text-gray-500 dark:text-gray-400 hover:text-brand-red'}`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
