'use client'

import React, { ComponentType, useState, useEffect } from 'react'

export function withSafeRefresh<P extends object>(
    WrappedComponent: ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function SafeComponent(props: P) {
        const [hasError, setHasError] = useState(false)

        useEffect(() => {
            setHasError(false) // Reset on prop change
        }, [props])

        if (hasError) {
            return fallback ? <>{fallback}</> : <div style={{ padding: '1rem', color: '#dc2626', background: '#fef2f2', borderRadius: '8px' }}>Component error (Safe Refresh)</div>
        }

        try {
            return <WrappedComponent {...props} />
        } catch (e) {
            setHasError(true)
            return fallback ? <>{fallback}</> : <div style={{ padding: '1rem', color: '#dc2626', background: '#fef2f2', borderRadius: '8px' }}>Component error (Safe Refresh)</div>
        }
    }
}
