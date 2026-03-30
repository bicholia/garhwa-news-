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
        <div className="fixed top-0 left-0 w-full h-[3px] bg-brand-gold/10 z-[9999] pointer-events-none overflow-hidden">
            <div
                className="premium-loader-bar animate-load-progress"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#B45309', // Brand Gold
                    boxShadow: '0 0 15px #B45309, 0 0 5px #B45309',
                    transformOrigin: 'left',
                }}
            />
        </div>
    )
}
