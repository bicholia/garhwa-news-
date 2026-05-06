'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { TrendingUp, Globe, Clock, Flame } from 'lucide-react'

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
                return null;
            }
        }
        return null;
    };

    const mainImageUrl = resolveImageUrl(mainStory, 800, 500);

    if (!mainStory) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 px-4 lg:px-0">
            {/* COLUMN 1: Main Story (LHS) */}
            <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6">
                <Link href={`/news/${mainStory.slug?.current || mainStory.slug}`} className="group">
                    <div className="relative aspect-video overflow-hidden rounded-md mb-6 bg-gray-100 shadow-premium group-hover:shadow-premium-hover transition-all duration-500">
                        {mainImageUrl ? (
                            <img src={mainImageUrl} alt={mainStory.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200"><Globe size={60} /></div>
                        )}
                        <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest flex items-center gap-2 shadow-2xl rounded-sm">
                            <Flame size={14} className="animate-pulse" /> Trending Now
                        </div>
                    </div>
                    <h1 className="text-3xl lg:text-[40px] font-bold text-gray-900 leading-[1.1] mb-5 group-hover:text-brand-red transition-all duration-300 serif-font">
                        {mainStory.title}
                    </h1>
                    <p className="text-[16px] text-gray-600 leading-relaxed font-medium mb-8 line-clamp-3">
                        {mainStory.excerpt || mainStory.description || "Leading investigative reporting from ThinkIndia News - your most trusted news source."}
                    </p>
                </Link>
                
                {/* Micro-feed below main story */}
                <div className="mt-auto hidden md:grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                    {topStories.slice(0, 2).map((s, i) => (
                        <Link key={i} href={`/news/${s.slug}`} className="flex gap-4 group items-center">
                            <div className="shrink-0 w-20 h-14 bg-gray-100 rounded-md overflow-hidden shadow-sm">
                                {resolveImageUrl(s, 200, 140) && <img src={resolveImageUrl(s, 200, 140) || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                            </div>
                            <h5 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-red transition-colors serif-font">{s.title}</h5>
                        </Link>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: Top Stories (Center) */}
            <div className="lg:col-span-3 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6">
                <h3 className="text-[12px] font-black text-brand-red uppercase tracking-[0.2em] mb-8 flex items-center gap-2 border-b border-brand-red/10 pb-3">
                    <TrendingUp size={16} /> Top Stories
                </h3>
                <div className="space-y-6">
                    {topStories.slice(2, 9).map((story, idx) => {
                        return (
                            <Link key={idx} href={`/news/${story.slug?.current || story.slug}`} className="flex gap-4 group items-start">
                                <span className="text-[20px] font-black text-gray-100 group-hover:text-brand-red/20 transition-colors w-6 shrink-0 mt-[-4px] italic">{idx + 1}</span>
                                <h4 className="text-[15px] font-bold text-gray-900 leading-[1.4] line-clamp-3 group-hover:text-brand-red transition-all duration-300 serif-font">
                                    {story.title}
                                </h4>
                            </Link>
                        );
                    })}
                </div>
                <Link href="/news" className="mt-8 text-[11px] font-black text-brand-red flex items-center gap-1 uppercase tracking-tighter hover:underline">
                    View Full Feed Archive <ArrowIcon />
                </Link>
            </div>

            {/* COLUMN 3: Sidebar (Right) */}
            <div className="lg:col-span-3 flex flex-col">

                {/* Tabbed Sidebar List */}
                <div className="flex gap-4 border-b border-gray-100 mb-6">
                    <button 
                        onClick={() => setSidebarTab('trending')}
                        className={`text-[11px] font-black uppercase pb-2 px-1 tracking-widest transition-all ${sidebarTab === 'trending' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}
                    >
                        Trending
                    </button>
                    <button 
                        onClick={() => setSidebarTab('latest')}
                        className={`text-[11px] font-black uppercase pb-2 px-1 tracking-widest transition-all ${sidebarTab === 'latest' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}
                    >
                        Latest
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {(sidebarTab === 'trending' ? trendingStories : topStories.slice(9)).slice(0, 6).map((story, idx) => (
                        <Link key={idx} href={`/news/${story.slug?.current || story.slug}`} className="py-4 group block">
                            <h4 className="text-[12px] font-bold text-gray-700 leading-snug group-hover:text-brand-red transition-colors flex gap-2">
                                <span className="mt-1"><Flame size={12} className="text-brand-red opacity-40" /></span>
                                {story.title}
                            </h4>
                        </Link>
                    ))}
                </div>
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
