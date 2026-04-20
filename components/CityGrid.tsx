'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface CityGridProps {
    cities: { name: string, articles: any[] }[]
}

export default function CityGrid({ cities }: CityGridProps) {
    if (!cities || cities.length === 0) return null

    return (
        <div className="bg-[#1a1a1a] text-white py-16 mt-16 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
            
            <div className="container">
                <div className="flex items-center gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shrink-0">
                        <MapPin size={18} className="text-brand-red" /> 
                        Regional intelligence Hub
                    </h2>
                    <div className="h-[1px] bg-white/10 grow hidden md:block" />
                    <div className="flex gap-4">
                        {cities.map(c => (
                            <span key={c.name} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"># {c.name}</span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {cities.map((city, idx) => (
                        <div key={idx} className="flex flex-col">
                            <h3 className="text-brand-red text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center justify-between border-b border-white/5 pb-2">
                                {city.name} News
                                <Link href={`/${city.name.toLowerCase()}`} className="text-white hover:text-brand-red transition-colors">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </Link>
                            </h3>
                            <div className="space-y-4">
                                {city.articles.slice(0, 3).map((article, aIdx) => (
                                    <Link key={aIdx} href={`/news/${article.slug}`} className="group block">
                                        <h4 className="text-[13px] font-bold text-gray-400 group-hover:text-white transition-colors leading-[1.4] line-clamp-3">
                                            {article.title}
                                        </h4>
                                        <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-gray-600" suppressHydrationWarning>
                                            Bureau Report · {new Date(article.publishedAt || article.published_at).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="container mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                <span>© 2026 Think India Regional Network</span>
                <span className="text-brand-red opacity-50">Jharkhand · Garhwa · Palamu · Latehar · Chatra</span>
            </div>
        </div>
    )
}
