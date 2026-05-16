'use client'

import React, { useState } from 'react'
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

    const resolveImageUrl = (story: any, w = 800, h = 500) => {
        if (!story) return null;
        if (story.image_url) return story.image_url;
        if (typeof story.featureImage === 'string') return story.featureImage;
        if (story.featureImage?.asset?._ref) {
            try {
                return urlFor(story.featureImage).width(w).height(h).url();
            } catch (e) {
                // Fallback handled below
            }
        }
        return `/placeholder_${Math.abs(story._id?.length || 0 % 4) + 1}.png`;
    };

    const mainImageUrl = resolveImageUrl(mainStory, 1200, 800);

    if (!mainStory) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-24 px-4 lg:px-0">
            
            {/* COLUMN 1: CINEMATIC MAIN STORY (LHS) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col group">
                <Link href={`/news/${mainStory.slug?.current || mainStory.slug}`} className="block relative overflow-hidden rounded-[32px] shadow-premium mb-10 group">
                    <div className="relative aspect-[16/10] lg:aspect-[16/9]">
                        {mainImageUrl ? (
                            <img 
                                src={mainImageUrl} 
                                alt={mainStory.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                            />
                        ) : (
                            <div className="w-full h-full bg-brand-navy flex items-center justify-center text-brand-gold/20"><Globe size={100} /></div>
                        )}
                        {/* Elegant Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                        
                        <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full">
                            <div className="inline-flex items-center gap-2 bg-brand-red text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-full mb-4 shadow-xl">
                                <Flame size={12} className="animate-pulse" /> Bureau Flash
                            </div>
                            <h1 className="text-2xl lg:text-5xl font-black text-white leading-[1.1] mb-5 serif-font tracking-tight group-hover:text-brand-gold transition-colors duration-500 drop-shadow-2xl">
                                {mainStory.title}
                            </h1>
                            <p className="text-gray-300 text-sm lg:text-base font-medium max-w-2xl line-clamp-2 hidden md:block">
                                {mainStory.excerpt || mainStory.description || "Leading investigative reporting from ThinkIndia News bureau."}
                            </p>
                        </div>
                    </div>
                </Link>
                
                {/* Micro-feed below main story - Magazines Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                    {topStories.slice(0, 3).map((s, i) => (
                        <Link key={i} href={`/news/${s.slug}`} className="group space-y-4">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                <img 
                                    src={resolveImageUrl(s, 400, 300) || ''} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.5] group-hover:grayscale-0" 
                                    alt={s.title}
                                />
                            </div>
                            <h5 className="text-lg font-black text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-red transition-colors serif-font">
                                {s.title}
                            </h5>
                        </Link>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: EDITORIAL SELECTION (RHS) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-gray-50 dark:bg-white/5 rounded-[40px] p-8 lg:p-10 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
                    <h3 className="text-sm font-black text-brand-navy dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <TrendingUp size={18} className="text-brand-red" /> Global Intel
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setSidebarTab('trending')} className={`w-2 h-2 rounded-full transition-all ${sidebarTab === 'trending' ? 'bg-brand-red w-6' : 'bg-gray-300'}`} />
                        <button onClick={() => setSidebarTab('latest')} className={`w-2 h-2 rounded-full transition-all ${sidebarTab === 'latest' ? 'bg-brand-red w-6' : 'bg-gray-300'}`} />
                    </div>
                </div>

                <div className="space-y-10">
                    {(sidebarTab === 'trending' ? trendingStories : topStories.slice(3)).slice(0, 5).map((story, idx) => (
                        <Link key={idx} href={`/news/${story.slug?.current || story.slug}`} className="group block">
                            <div className="flex gap-6 items-start">
                                <span className="text-4xl font-black text-gray-200 dark:text-white/10 group-hover:text-brand-gold/40 transition-colors serif-font italic">0{idx + 1}</span>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">{story.category?.name || 'General'}</span>
                                    <h4 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-[1.3] group-hover:text-brand-red transition-all duration-300 serif-font">
                                        {story.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                                        <Clock size={12} /> {new Date(story.publishedAt || story.published_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/news" className="mt-auto pt-10 border-t border-gray-200 dark:border-white/10 group flex items-center justify-between">
                    <span className="text-[12px] font-black text-brand-navy dark:text-white uppercase tracking-[0.2em]">Explore Full Bureau Archive</span>
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
