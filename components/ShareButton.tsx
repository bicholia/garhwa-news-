'use client'

import React, { useState } from 'react'
import { Share2, Check, Link as LinkIcon } from 'lucide-react'

interface ShareButtonProps {
    title: string
    slug: string
    excerpt?: string
    className?: string
}

export default function ShareButton({ title, slug, excerpt, className = "" }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const url = `${window.location.origin}/news/${slug}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: excerpt || title,
                    url: url,
                })
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err)
                }
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        }
    }

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-brand-gold hover:text-white transition-all duration-300 group/share ${className}`}
            title="Share News"
        >
            {copied ? (
                <>
                    <Check size={14} className="text-green-500 group-hover/share:text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span>
                </>
            ) : (
                <>
                    <Share2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
                </>
            )}
        </button>
    )
}
