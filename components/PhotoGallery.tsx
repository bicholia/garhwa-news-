'use client'

import React from 'react'
import Link from 'next/link'
import { Camera, ArrowRight, Globe } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

interface PhotoGalleryProps {
    articles: any[]
}

export default function PhotoGallery({ articles }: PhotoGalleryProps) {
    if (!articles || articles.length === 0) return null

    const mainPhoto = articles[0]
    const otherPhotos = articles.slice(1, 5)

    const resolveImageUrl = (photo: any, w: number, h: number) => {
        if (!photo) return null;
        if (photo.image_url) return photo.image_url;
        if (typeof photo.featureImage === 'string') return photo.featureImage;
        if (photo.featureImage?.asset?._ref) {
            try {
                return urlFor(photo.featureImage).width(w).height(h).url();
            } catch (e) {
                // Fallback handled below
            }
        }
        return null;
    };

    const DigitalBureauBox = ({ large = false }: { large?: boolean }) => (
        <div className="w-full h-full bg-[#0B1120] flex flex-col items-center justify-center">
            <div className="border border-brand-red/40 rounded-xl px-5 py-4 text-center">
                <div className={`text-brand-red font-black uppercase tracking-[0.4em] mb-1.5 ${large ? 'text-[9px]' : 'text-[7px]'}`}>ThinkIndia Bureau</div>
                <div className={`text-white font-black serif-font tracking-tighter ${large ? 'text-3xl' : 'text-lg'}`}>DIGITAL BUREAU</div>
            </div>
        </div>
    );

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between border-b-2 border-ndtv-black mb-8 pb-3">
                <h2 className="text-xl lg:text-2xl font-black text-black dark:text-white uppercase tracking-tight serif-font flex items-center gap-3">
                    <span className="w-2 h-8 bg-ndtv-black dark:bg-white inline-block" />
                    <Camera size={24} className="text-brand-red" /> 
                    Visual Stories <span className="text-brand-red">/ Photos</span>
                </h2>
                <Link href="/news" className="text-[11px] font-black text-brand-red hover:underline flex items-center gap-1 uppercase tracking-widest leading-none">
                    More Photos <ArrowRight size={12} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 relative items-stretch">
                {/* Main Large Photo */}
                <div className="lg:col-span-8 relative aspect-video lg:aspect-auto lg:h-full overflow-hidden group">
                    <Link href={`/news/${mainPhoto.slug?.current || mainPhoto.slug}`} className="w-full h-full block relative">
                        {resolveImageUrl(mainPhoto, 1200, 800) ? (
                            <img 
                                src={resolveImageUrl(mainPhoto, 1200, 800)!} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <DigitalBureauBox large />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-0 left-0 p-6 lg:p-10 w-full">
                            <span className="bg-brand-red text-white text-[10px] font-black px-3 py-1 uppercase mb-4 inline-block tracking-widest shadow-lg">Story In Photos</span>
                            <h3 className="text-white text-2xl lg:text-3xl font-black leading-tight serif-font group-hover:underline decoration-brand-red decoration-2">
                                {mainPhoto.title}
                            </h3>
                        </div>
                    </Link>
                </div>

                {/* Smaller Photo Grid */}
                <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-1.5">
                    {otherPhotos.map((photo, i) => (
                        <Link 
                            key={i} 
                            href={`/news/${photo.slug?.current || photo.slug}`} 
                            className="relative aspect-video lg:aspect-auto lg:flex-1 overflow-hidden group"
                        >
                            {resolveImageUrl(photo, 600, 400) ? (
                                <img 
                                    src={resolveImageUrl(photo, 600, 400)!} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <DigitalBureauBox />
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-300" />
                            <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <h4 className="text-white text-[11px] lg:text-[13px] font-bold leading-tight line-clamp-2 serif-font group-hover:underline">
                                    {photo.title}
                                </h4>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full p-2 text-white">
                                <Globe size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
