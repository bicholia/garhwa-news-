'use client'

/**
 * ArticleActions.tsx
 * Client-side component for handling 'Save Brief' and 'Distribute' actions.
 * Provides bookmarking, native sharing, and social media connectivity.
 */

import React, { useState, useEffect } from 'react'
import { Bookmark, Share2 } from 'lucide-react'
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface ArticleActionsProps {
    title: string
    slug: string
    excerpt?: string
}

export default function ArticleActions({ title, slug, excerpt }: ArticleActionsProps) {
    const [saved, setSaved] = useState(false)
    const [shared, setShared] = useState(false)
    
    // Safety check for production environment
    const [url, setUrl] = useState('')
    
    useEffect(() => {
        setUrl(`${window.location.origin}/news/${slug}`)
        // Check if article is already saved in bookmarks
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: excerpt || title,
                    url: url,
                })
            } catch (err) {
                // If user cancels, we ignore the error
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err)
                }
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(url)
            setShared(true)
            setTimeout(() => setShared(false), 2000)
        }
    }

    const shareSocial = (platform: string) => {
        const encodedUrl = encodeURIComponent(url)
        const encodedText = encodeURIComponent(title)
        
        let shareUrl = ''
        if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
        
        if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="flex items-center justify-between mb-12 py-6 border-y border-gray-100 bg-white/50 backdrop-blur-sm px-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-10">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${saved ? 'text-brand-gold' : 'text-brand-navy hover:text-brand-gold'}`}
                >
                    <Bookmark 
                        size={18} 
                        fill={saved ? '#91752D' : 'none'} 
                        className={`transition-all duration-300 ${saved ? 'scale-110 drop-shadow-[0_0_8px_rgba(145,117,45,0.3)]' : ''}`} 
                    /> 
                    {saved ? 'Article Saved' : 'Save Brief'}
                </motion.button>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy hover:text-brand-gold transition-all"
                >
                    <Share2 size={18} className={shared ? 'text-brand-gold scale-110' : ''} /> 
                    {shared ? 'Copied to Intelligence Grid' : 'Distribute Brief'}
                </motion.button>
            </div>
            
            <div className="flex items-center gap-6">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 mr-2 md:block hidden">Gateway</span>
                <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} whileTap={{ scale: 0.85 }}>
                    <FaFacebookF 
                        onClick={() => shareSocial('facebook')}
                        className="text-gray-400 hover:text-brand-navy cursor-pointer transition-colors w-4 h-4" 
                    />
                </motion.div>
                <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} whileTap={{ scale: 0.85 }}>
                    <FaTwitter 
                        onClick={() => shareSocial('twitter')}
                        className="text-gray-400 hover:text-brand-navy cursor-pointer transition-colors w-4 h-4" 
                    />
                </motion.div>
                <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} whileTap={{ scale: 0.85 }}>
                    <FaWhatsapp 
                        onClick={() => shareSocial('whatsapp')}
                        className="text-gray-400 hover:text-[#25D366] cursor-pointer transition-colors w-4 h-4" 
                    />
                </motion.div>
            </div>
        </div>
    )
}
