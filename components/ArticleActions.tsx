
'use client'

/**
 * ArticleActions.tsx
 * Client-side component for handling sharing and saving.
 * Redesigned for better UX and AdSense friendliness (engagement).
 */

import React, { useState, useEffect } from 'react'
import { Bookmark, Share2, Copy, Send } from 'lucide-react'
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface ArticleActionsProps {
    title: string
    slug: string
    excerpt?: string
}

export default function ArticleActions({ title, slug, excerpt }: ArticleActionsProps) {
    const [saved, setSaved] = useState(false)
    const [copied, setCopied] = useState(false)
    const [url, setUrl] = useState('')
    
    useEffect(() => {
        setUrl(`${window.location.origin}/news/${slug}`)
        const savedBriefs = JSON.parse(localStorage.getItem('saved_briefs') || '[]')
        setSaved(savedBriefs.includes(slug))
    }, [slug])

    const handleSave = () => {
        const savedBriefs = JSON.parse(localStorage.getItem('saved_briefs') || '[]')
        if (saved) {
            const updated = savedBriefs.filter((s: string) => s !== slug)
            localStorage.setItem('saved_briefs', JSON.stringify(updated))
            setSaved(false)
        } else {
            savedBriefs.push(slug)
            localStorage.setItem('saved_briefs', JSON.stringify(savedBriefs))
            setSaved(true)
        }
    }

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text: excerpt || title, url })
            } catch (err) {
                if ((err as Error).name !== 'AbortError') console.error('Error sharing:', err)
            }
        } else {
            copyToClipboard()
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareSocial = (platform: string) => {
        const encodedUrl = encodeURIComponent(url)
        const encodedText = encodeURIComponent(title)
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        
        let shareUrl = ''
        if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        if (platform === 'whatsapp') {
            // Use app scheme on mobile for direct WhatsApp app opening
            shareUrl = isMobile
                ? `whatsapp://send?text=${encodedText}%20${url}`
                : `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
        }
        if (platform === 'telegram') {
            shareUrl = isMobile
                ? `tg://msg_url?url=${encodedUrl}&text=${encodedText}`
                : `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        }
        
        if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="my-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left: Share Label & Social Icons */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-brand-red font-black uppercase tracking-widest text-[11px]">
                        <Share2 size={16} />
                        <span>इस खबर को शेयर करें (Share this News)</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <ShareButton 
                            icon={<FaWhatsapp className="w-5 h-5" />} 
                            label="WhatsApp" 
                            color="bg-[#25D366]" 
                            onClick={() => shareSocial('whatsapp')} 
                        />
                        <ShareButton 
                            icon={<FaFacebookF className="w-5 h-5" />} 
                            label="Facebook" 
                            color="bg-[#1877F2]" 
                            onClick={() => shareSocial('facebook')} 
                        />
                        <ShareButton 
                            icon={<FaTelegramPlane className="w-5 h-5" />} 
                            label="Telegram" 
                            color="bg-[#0088cc]" 
                            onClick={() => shareSocial('telegram')} 
                        />
                        <ShareButton 
                            icon={<FaTwitter className="w-5 h-5" />} 
                            label="Twitter" 
                            color="bg-[#1DA1F2]" 
                            onClick={() => shareSocial('twitter')} 
                        />
                        <ShareButton 
                            icon={<Share2 className="w-5 h-5" />} 
                            label="Share" 
                            color="bg-gray-700" 
                            onClick={shareNative} 
                            title="Share this news"
                        />
                    </div>
                </div>

                {/* Right: Actions (Save & Copy) */}
                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] font-bold text-gray-600 hover:bg-gray-100 transition-colors relative"
                    >
                        <Copy size={16} />
                        {copied ? 'Link Copied!' : 'Copy Link'}
                        <AnimatePresence>
                            {copied && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-[10px]"
                                >
                                    Saved to Clipboard
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${saved ? 'bg-brand-red text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                        {saved ? 'Saved' : 'Save'}
                    </button>
                    

                </div>
            </div>
        </div>
    )
}

function ShareButton({ icon, label, color, onClick, title }: { icon: React.ReactNode, label: string, color: string, onClick: () => void, title?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${color} text-white flex items-center justify-center w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-all`}
            title={title || `Share on ${label}`}
        >
            {icon}
        </motion.button>
    )
}
