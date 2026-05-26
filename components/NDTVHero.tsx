'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { TrendingUp, Globe, Clock, Flame, ChevronRight } from 'lucide-react'

interface NDTVHeroProps {
    mainStory: any
    topStories: any[]
    trendingStories: any[]
}

export default function NDTVHero({ mainStory, topStories, trendingStories }: NDTVHeroProps) {
    const [sidebarTab, setSidebarTab] = useState<'trending' | 'latest'>('trending')
    const [activeHeroIdx, setActiveHeroIdx] = useState(0)

    const heroStories = [mainStory, ...topStories.slice(0, 3)].filter(Boolean)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHeroIdx((prev) => (prev + 1) % heroStories.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [heroStories.length])

    const resolveImageUrl = (story: any, w = 800, h = 500) => {
        if (!story) return null;
        if (story.image_url) return story.image_url;
        if (typeof story.featureImage === 'string') return story.featureImage;
        if (story.featureImage?.asset?._ref) {
            try {
                return urlFor(story.featureImage).width(w).height(h).url();
            } catch (e) {
                // Fallback
            }
        }
        return `/placeholder_${Math.abs((story._id?.length || 0) % 4) + 1}.png`;
    };

    if (!mainStory) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 mb-2 lg:mb-8 px-0">
            
            {/* COLUMN 1: CINEMATIC MAIN STORY / MOBILE CAROUSEL (LHS) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                <div className="relative overflow-hidden rounded-[0px] lg:rounded-[20px] shadow-card mb-2 lg:mb-4 group">
                    <div className="relative aspect-[16/10] lg:aspect-[16/9]">
                        {heroStories.map((s, i) => (
                            <Link 
                                key={i}
                                href={`/news/${s.slug?.current || s.slug}`}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === activeHeroIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <img 
                                    src={resolveImageUrl(s, 1200, 800) || ''} 
                                    alt={s.title} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent opacity-90" />
                                
                                <div className="absolute bottom-0 left-0 p-5 lg:p-8 w-full">
                                    <div className="inline-flex items-center gap-2 bg-brand-red text-white text-[8px] lg:text-[9px] font-black px-2.5 py-1 uppercase tracking-[0.2em] rounded-full mb-3 shadow-xl">
                                        <Flame size={10} className="animate-pulse" /> {i === 0 ? 'Bureau Flash' : 'Editorial Choice'}
                                    </div>
                                    <h1 className="text-lg lg:text-3xl font-black text-white leading-tight lg:leading-[1.1] mb-2 lg:mb-4 serif-font tracking-tight group-hover:text-brand-red transition-colors duration-500 drop-shadow-2xl line-clamp-3 lg:line-clamp-none">
                                        {s.title}
                                    </h1>
                                    <p className="text-gray-300 text-sm lg:text-base font-medium max-w-2xl line-clamp-2 hidden md:block">
                                        {s.excerpt || s.description || "Leading investigative reporting from ThinkIndia News bureau."}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* Carousel Dots */}
                    <div className="absolute bottom-4 right-6 z-20 flex gap-2 lg:hidden">
                        {heroStories.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeHeroIdx ? 'bg-brand-red w-4' : 'bg-white/40'}`} />
                        ))}
                    </div>
                </div>
                
                {/* Micro-feed below main story - Magazines Layout (Hidden on Mobile as it's now in carousel) */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {topStories.slice(0, 3).map((s, i) => (
                        <Link key={i} href={`/news/${s.slug}`} className="group space-y-3">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                <img 
                                    src={resolveImageUrl(s, 400, 300) || ''} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.5] group-hover:grayscale-0" 
                                    alt={s.title}
                                />
                            </div>
                            <h5 className="text-[15px] lg:text-lg font-black text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-red transition-colors serif-font">
                                {s.title}
                            </h5>
                        </Link>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: EDITORIAL SELECTION (RHS) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-white dark:bg-[#0B1120] lg:bg-white/60 lg:dark:bg-[#0B1120]/80 lg:backdrop-blur-2xl rounded-[24px] p-6 lg:p-6 border border-gray-200/50 dark:border-white/10 shadow-premium">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                    <h3 className="text-sm font-black text-brand-navy dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <TrendingUp size={18} className="text-brand-red" /> Trending News
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setSidebarTab('trending')} className={`w-2 h-2 rounded-full transition-all ${sidebarTab === 'trending' ? 'bg-brand-red w-6' : 'bg-gray-300'}`} />
                        <button onClick={() => setSidebarTab('latest')} className={`w-2 h-2 rounded-full transition-all ${sidebarTab === 'latest' ? 'bg-brand-red w-6' : 'bg-gray-300'}`} />
                    </div>
                </div>

                <div className="space-y-4 divide-y divide-gray-100 dark:divide-white/5">
                    {(sidebarTab === 'trending' ? trendingStories : topStories.slice(3)).slice(0, 3).map((story, idx) => (
                        <Link key={idx} href={`/news/${story.slug?.current || story.slug}`} className="group block first:pt-0 pt-4">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">{story.category?.name || 'General'}</span>
                                <h4 className="text-[13px] lg:text-base font-bold text-gray-900 dark:text-white leading-[1.3] group-hover:text-brand-red transition-all duration-300 serif-font">
                                    {story.title}
                                </h4>
                                {story.excerpt && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">
                                        {story.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                                    <Clock size={10} /> <span suppressHydrationWarning>{new Date(story.publishedAt || story.published_at).toLocaleDateString('hi-IN')}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/news" className="mt-auto pt-10 border-t border-gray-200 dark:border-white/10 group flex items-center justify-between">
                    <span className="text-[12px] font-black text-brand-navy dark:text-white uppercase tracking-[0.2em]">View All News</span>
                    <div className="w-10 h-10 rounded-full bg-brand-navy dark:bg-white text-white dark:text-brand-navy flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                    </div>
                </Link>
            </div>
        </div>
    )
}

function ArrowIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
    )
}
