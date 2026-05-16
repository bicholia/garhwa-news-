'use client'

import React from 'react'
import { FaWhatsapp, FaFacebookF, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import { Share2, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'

interface FloatingShareBarProps {
    title: string
    url: string
}

export default function FloatingShareBar({ title, url }: FloatingShareBarProps) {
    const [copied, setCopied] = useState(false)

    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)

    const platforms = [
        {
            label: 'WhatsApp',
            icon: <FaWhatsapp size={20} />,
            bg: 'bg-[#25D366]',
            shadow: 'shadow-[#25D366]/30',
            // whatsapp:// opens the app directly on mobile
            href: `whatsapp://send?text=${encodedTitle}%20${url}`,
            webHref: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            label: 'Facebook',
            icon: <FaFacebookF size={18} />,
            bg: 'bg-[#1877F2]',
            shadow: 'shadow-[#1877F2]/30',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            label: 'Telegram',
            icon: <FaTelegramPlane size={20} />,
            bg: 'bg-[#0088cc]',
            shadow: 'shadow-[#0088cc]/30',
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            label: 'Twitter',
            icon: <FaTwitter size={18} />,
            bg: 'bg-[#1DA1F2]',
            shadow: 'shadow-[#1DA1F2]/30',
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
    ]

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({ title, url }).catch(() => {})
        } else {
            navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handlePlatformClick = (href: string, webHref?: string) => {
        // Try to open app-scheme first, fallback to web on desktop
        if (webHref) {
            // For WhatsApp: try app scheme on mobile, web on desktop
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
            window.open(isMobile ? href : webHref, '_blank', 'noopener,noreferrer')
        } else {
            window.open(href, '_blank', 'noopener,noreferrer,width=600,height=500')
        }
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[95%] max-w-sm">
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest text-center mb-2.5">
                    इस खबर को शेयर करें
                </p>
                <div className="flex items-center justify-between gap-2">
                    {platforms.map(p => (
                        <button
                            key={p.label}
                            onClick={() => handlePlatformClick(p.href, p.webHref)}
                            className={`${p.bg} ${p.shadow} flex flex-col items-center justify-center gap-1 flex-1 py-2.5 px-1 rounded-xl text-white shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150`}
                            title={`${p.label} पर शेयर करें`}
                        >
                            {p.icon}
                            <span className="text-[8px] font-bold">{p.label}</span>
                        </button>
                    ))}

                    {/* Native / Copy button */}
                    <button
                        onClick={handleNativeShare}
                        className="bg-white/15 flex flex-col items-center justify-center gap-1 flex-1 py-2.5 px-1 rounded-xl text-white hover:bg-white/25 active:scale-95 transition-all duration-150"
                        title="More options"
                    >
                        {copied ? <LinkIcon size={18} /> : <Share2 size={18} />}
                        <span className="text-[8px] font-bold">{copied ? 'Copied!' : 'More'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
