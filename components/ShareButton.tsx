'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Share2, Check, Link as LinkIcon, X } from 'lucide-react'
import { FaWhatsapp, FaFacebookF, FaTelegramPlane, FaTwitter } from 'react-icons/fa'

interface ShareButtonProps {
    title: string
    slug: string
    excerpt?: string
    className?: string
}

export default function ShareButton({ title, slug, excerpt, className = "" }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const getUrl = () => `${window.location.origin}/news/${slug}`

    const shareLinks = [
        {
            label: 'WhatsApp',
            icon: <FaWhatsapp size={17} />,
            bg: 'bg-[#25D366]',
            href: (url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n' + url)}`,
        },
        {
            label: 'Facebook',
            icon: <FaFacebookF size={16} />,
            bg: 'bg-[#1877F2]',
            href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            label: 'Telegram',
            icon: <FaTelegramPlane size={17} />,
            bg: 'bg-[#0088cc]',
            href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
        {
            label: 'Twitter',
            icon: <FaTwitter size={16} />,
            bg: 'bg-[#1DA1F2]',
            href: (url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        },
    ]

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const url = getUrl()
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback
        }
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setOpen(prev => !prev)
    }

    const handlePlatformShare = (e: React.MouseEvent, href: (url: string) => string) => {
        e.preventDefault()
        e.stopPropagation()
        const url = getUrl()
        window.open(href(url), '_blank', 'noopener,noreferrer,width=600,height=500')
        setOpen(false)
    }

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                onClick={handleToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-brand-red hover:text-white transition-all duration-300 group/share text-gray-700"
                title="Share News"
                aria-label="Share this news"
            >
                {copied ? (
                    <>
                        <Check size={14} className="text-green-500 group-hover/share:text-white" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Copied!</span>
                    </>
                ) : (
                    <>
                        <Share2 size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
                    </>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[500] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 flex flex-col gap-2 min-w-[170px] animate-fade-in"
                    style={{ animation: 'fadeInUp 0.18s ease' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Arrow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />

                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center mb-1">
                        Share करें
                    </p>

                    {/* Platform buttons */}
                    {shareLinks.map(platform => (
                        <button
                            key={platform.label}
                            onClick={(e) => handlePlatformShare(e, platform.href)}
                            className={`${platform.bg} text-white flex items-center gap-3 px-4 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 hover:scale-[1.03] transition-all duration-150 w-full`}
                        >
                            {platform.icon}
                            {platform.label} पर Share करें
                        </button>
                    ))}

                    {/* Copy Link */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl text-[12px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-150 w-full"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />}
                        {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </div>
    )
}
