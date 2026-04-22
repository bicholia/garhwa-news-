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

    return (
        <div className="mb-16 bg-white">
            <div className="flex items-center justify-between border-b-2 border-ndtv-black mb-8 pb-3">
                <h2 className="text-xl lg:text-2xl font-black text-black uppercase tracking-tight serif-font flex items-center gap-3">
                    <span className="w-2 h-8 bg-ndtv-black inline-block" />
                    <Camera size={24} className="text-brand-red" /> 
                    Visual Stories <span className="text-brand-red">/ Photos</span>
                </h2>
                <Link href="/news" className="text-[11px] font-black text-brand-red hover:underline flex items-center gap-1 uppercase tracking-widest leading-none">
                    More Photos <ArrowRight size={12} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 relative">
                {/* Main Large Photo */}
                <div className="lg:col-span-8 relative aspect-[16/9] lg:aspect-auto overflow-hidden group">
                    <Link href={`/news/${mainPhoto.slug}`}>
                        {mainPhoto.image_url || (mainPhoto.featureImage?.asset?._ref && mainPhoto.featureImage.asset._ref.startsWith('image-')) ? (
                            <img 
                                src={mainPhoto.image_url || urlFor(mainPhoto.featureImage).width(1200).height(800).url()} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
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
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-1">
                    {otherPhotos.map((photo, i) => (
                        <Link key={i} href={`/news/${photo.slug}`} className="relative aspect-video lg:aspect-auto lg:h-[calc(50%-1px)] overflow-hidden group">
                            {photo.image_url || (photo.featureImage?.asset?._ref && photo.featureImage.asset._ref.startsWith('image-')) ? (
                                <img 
                                    src={photo.image_url || urlFor(photo.featureImage).width(600).height(400).url()} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-all" />
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h4 className="text-white text-[13px] font-bold leading-tight line-clamp-2 serif-font group-hover:underline">
                                    {photo.title}
                                </h4>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full p-2 text-white">
                                <Globe size={14} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
