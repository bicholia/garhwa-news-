'use client'

import { useEffect } from 'react'

export function ErrorHandler() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error('Global error caught:', event.error)
            // Prevent default browser white screen in development if possible, 
            // though Next.js error overlay usually catches this first in dev.
            if (process.env.NODE_ENV === 'production') {
                event.preventDefault()
            }
        }

        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled rejection:', event.reason)
            if (process.env.NODE_ENV === 'production') {
                event.preventDefault()
            }
        }

        window.addEventListener('error', handleError)
        window.addEventListener('unhandledrejection', handleRejection)

        return () => {
            window.removeEventListener('error', handleError)
            window.removeEventListener('unhandledrejection', handleRejection)
        }
    }, [])

    return null
}
