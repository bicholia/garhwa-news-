'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode | ((error: Error) => ReactNode)
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError?.(error, errorInfo)
        // Log to monitoring service
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError && this.state.error) {
            if (typeof this.props.fallback === 'function') {
                return this.props.fallback(this.state.error)
            }
            if (this.props.fallback) {
                return this.props.fallback
            }
            return (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#991b1b',
                    fontSize: '0.875rem'
                }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>⚠️ Component temporarily unavailable</div>
                    <div>This part of the page could not be loaded.</div>
                </div>
            )
        }
        return this.props.children
    }
}
