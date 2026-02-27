'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export default function EditPostPage() {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        fetch(`/api/admin/posts/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data?._id) {
                    // Normalize data for PostForm
                    setPost({
                        _id: data._id,
                        title: data.title || '',
                        excerpt: data.excerpt || '',
                        // Body can be stored as bodyHtml (from our custom rich editor)
                        body: data.bodyHtml || (Array.isArray(data.body) && data.body[0]?.children?.[0]?.text) || '',
                        category: data.category?.slug?.current || data.category || 'crime',
                        district: data.district || 'garhwa',
                        featured: data.featured || false,
                        featureImageUrl: data.featureImage?.asset?.url || data.featureImageUrl || '',
                        featureImageId: data.featureImage?.asset?._ref || data.featureImageId || '',
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                    })
                } else {
                    setError('खबर नहीं मिली')
                }
            })
            .catch(() => setError('खबर लोड नहीं हो सकी'))
            .finally(() => setLoading(false))
    }, [id])

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link
                    href="/admin/dashboard/posts"
                    style={{
                        width: '38px', height: '38px',
                        background: 'white', border: '1.5px solid #e2e8f0',
                        borderRadius: '0.6rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', textDecoration: 'none',
                        fontSize: '1.1rem', flexShrink: 0
                    }}
                >
                    ←
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        खबर सम्पादित करें
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.2rem', fontSize: '0.9rem' }}>
                        बदलाव करके अपडेट करें
                    </p>
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    खबर लोड हो रही है...
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', color: '#dc2626' }}>
                    {error}
                </div>
            )}

            {!loading && post && (
                <PostForm initialData={post} isEditing={true} />
            )}
        </div>
    )
}
