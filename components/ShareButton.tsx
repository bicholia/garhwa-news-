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
            icon: <FaWhatsapp size={15} />,
            bg: 'bg-[#25D366]',
            href: (url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n' + url)}`,
        },
        {
            label: 'Facebook',
            icon: <FaFacebookF size={14} />,
            bg: 'bg-[#1877F2]',
            href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            label: 'Telegram',
            icon: <FaTelegramPlane size={15} />,
            bg: 'bg-[#0088cc]',
            href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
        {
            label: 'Twitter',
            icon: <FaTwitter size={14} />,
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 group/share shadow-sm ${open ? 'bg-brand-red text-white' : 'bg-brand-red text-white hover:bg-red-700'}`}
                title="Share News"
                aria-label="Share this news"
            >
                {copied ? (
                    <>
                        <Check size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Done</span>
                    </>
                ) : (
                    <>
                        <Share2 size={12} strokeWidth={2.5} />
                        <span className="text-[9px] font-black uppercase tracking-widest">SHARE</span>
                    </>
                )}
            </button>

            {/* Dropdown Panel - Aligned to Left of button to avoid screen edge cutting */}
            {open && (
                <div
                    className="absolute bottom-full mb-2 left-0 z-[500] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-1.5 flex flex-col gap-1 min-w-[130px] animate-fade-in origin-bottom-left"
                    style={{ animation: 'fadeInUp 0.15s ease-out' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Platform buttons */}
                    {shareLinks.map(platform => (
                        <button
                            key={platform.label}
                            onClick={(e) => handlePlatformShare(e, platform.href)}
                            className={`${platform.bg} text-white flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:brightness-110 active:scale-95 transition-all w-full`}
                        >
                            <div className="w-4 flex justify-center shrink-0">
                                {platform.icon}
                            </div>
                            <span className="flex-1 text-left">{platform.label}</span>
                        </button>
                    ))}

                    <div className="h-px bg-gray-50 my-0.5" />

                    {/* Copy Link */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all w-full"
                    >
                        <div className="w-4 flex justify-center shrink-0">
                            {copied ? <Check size={12} className="text-green-500" /> : <LinkIcon size={12} />}
                        </div>
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
