'use client'

import React from 'react'
import Link from 'next/link'
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import { Share2 } from 'lucide-react'

interface FloatingShareBarProps {
    title: string
    url: string
}

export default function FloatingShareBar({ title, url }: FloatingShareBarProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title, url });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    }

    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[90%] max-w-sm">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest ml-2">Share:</span>
                <div className="flex gap-4 pr-2">
                    <Link href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" className="bg-[#25D366] p-2.5 rounded-xl text-white shadow-lg shadow-[#25D366]/20">
                        <FaWhatsapp size={20} />
                    </Link>
                    <Link href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" className="bg-[#0088cc] p-2.5 rounded-xl text-white shadow-lg shadow-[#0088cc]/20">
                        <FaTelegramPlane size={20} />
                    </Link>
                    <button onClick={handleShare} className="bg-brand-red p-2.5 rounded-xl text-white shadow-lg shadow-brand-red/20">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
