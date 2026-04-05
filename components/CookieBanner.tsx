'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, X } from 'lucide-react'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true')
        setIsVisible(false)
        fetch('/api/track-interest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'cookie_accept' })
        }).catch(err => console.error('Tracking failed:', err))
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 w-full bg-brand-navy/95 backdrop-blur-xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] border-t border-white/10 z-[9998] animate-in slide-in-from-bottom duration-700">
            <div className="container py-4 md:py-6 flex flex-col lg:flex-row items-center gap-4 md:gap-8 max-w-6xl mx-auto">
                <div className="bg-brand-gold/10 p-3 rounded-2xl text-brand-gold shrink-0 hidden md:block">
                    <ShieldCheck size={28} />
                </div>
                <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1 md:mb-2 italic">Data Privacy & Intelligence Sovereignty</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-3xl mx-auto lg:mx-0">
                        We utilize advanced cookies to ensure the integrity of your intelligence feed. By proceeding, you acknowledge our <Link href="/privacy-policy" className="text-brand-gold hover:underline border-b border-brand-gold/30 pb-0.5">Global Privacy Protocols</Link>.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-3 w-full lg:w-auto shrink-0">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-8 py-3 bg-brand-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-navy transition-all shadow-xl shadow-brand-gold/20"
                    >
                        Authorize
                    </button>
                </div>
            </div>
        </div>
    )
}
