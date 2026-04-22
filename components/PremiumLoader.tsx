'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PremiumLoader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    if (!loading) return null

    return (
        <div className="fixed inset-0 w-full h-full bg-white/80 backdrop-blur-md z-[99999] flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-red rounded-full animate-spin mb-4" />
                <div className="text-xl font-black tracking-tighter animate-pulse">
                    <span className="text-black">THINKINDIA</span>
                    <span className="text-brand-red">.PRESS</span>
                </div>
                <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                    Fast. Fair. Fearless.
                </div>
            </div>
            <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-100 overflow-hidden">
                <div className="h-full bg-brand-red animate-load-progress w-full transform-origin-left" />
            </div>
        </div>
    )
}
