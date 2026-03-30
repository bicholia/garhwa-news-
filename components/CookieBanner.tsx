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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-2xl bg-brand-navy/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 z-[9999] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-brand-gold/10 p-3 rounded-2xl text-brand-gold shrink-0">
                <ShieldCheck size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-2 italic">Data Privacy & Intelligence Sovereignty</h3>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    We utilize advanced cookies to ensure the integrity of your intelligence feed. By proceeding, you acknowledge our <Link href="/privacy-policy" className="text-brand-gold hover:underline">Global Privacy Protocols</Link>.
                </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-8 py-3 bg-brand-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-navy transition-all shadow-lg shadow-brand-gold/20"
                >
                    Authorize
                </button>
            </div>
        </div>
    )
}
