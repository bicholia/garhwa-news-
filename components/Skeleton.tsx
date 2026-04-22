import React from 'react'

interface SkeletonProps {
    className?: string
    width?: string | number
    height?: string | number
    variant?: 'text' | 'rect' | 'circle'
}

export default function Skeleton({ 
    className = '', 
    width, 
    height, 
    variant = 'rect' 
}: SkeletonProps) {
    const baseClass = "animate-pulse bg-gray-200"
    const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-sm'
    
    return (
        <div 
            className={`${baseClass} ${variantClass} ${className}`}
            style={{ width, height }}
        />
    )
}

export function NewsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton height={400} className="w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                        <Skeleton height={200} className="w-full" />
                        <Skeleton height={20} className="w-3/4" />
                        <Skeleton height={15} className="w-full" />
                        <Skeleton height={15} className="w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    )
}
