'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PremiumLoader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Whenever the route change starts (pathname or searchParams changes)
        setLoading(true)

        // Simulate the loading time since Next.js app router doesn't have 
        // native router events for complete load. This ensures the bar reaches 100%.
        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    if (!loading) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(220, 38, 38, 0.2)', // Light red background
            zIndex: 9999,
            pointerEvents: 'none',
            overflow: 'hidden'
        }}>
            <div
                className="premium-loader-bar"
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#dc2626', // Red-600 to match site theme
                    boxShadow: '0 0 10px #dc2626, 0 0 5px #dc2626',
                    transformOrigin: 'left',
                    animation: 'loadProgress 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }}
            />
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes loadProgress {
          0% { transform: scaleX(0); opacity: 1; }
          40% { transform: scaleX(0.4); opacity: 1; }
          80% { transform: scaleX(0.8); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}} />
        </div>
    )
}
