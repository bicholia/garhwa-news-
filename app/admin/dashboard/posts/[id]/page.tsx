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
                    // Convert Portable Text body[] to plain HTML if bodyHtml not stored
                    const convertBodyToHtml = (blocks: any[]): string => {
                        if (!Array.isArray(blocks)) return ''
                        return blocks.map((block: any) => {
                            if (block._type === 'image') {
                                const url = block.asset?.url || ''
                                return url ? `<figure style="margin:1.5rem 0;text-align:center"><img src="${url}" alt="News Image" style="max-width:100%;border-radius:8px;" /></figure>` : ''
                            }
                            if (block._type !== 'block') return ''
                            const tag = block.style === 'h1' ? 'h1'
                                : block.style === 'h2' ? 'h2'
                                : block.style === 'h3' ? 'h3'
                                : block.style === 'blockquote' ? 'blockquote'
                                : 'p'
                            const text = (block.children || []).map((child: any) => {
                                let t = child.text || ''
                                if (child.marks?.includes('strong')) t = `<strong>${t}</strong>`
                                if (child.marks?.includes('em')) t = `<em>${t}</em>`
                                if (child.marks?.includes('underline')) t = `<u>${t}</u>`
                                return t
                            }).join('')
                            return text ? `<${tag}>${text}</${tag}>` : ''
                        }).filter(Boolean).join('')
                    }

                    // Normalize data for PostForm
                    setPost({
                        _id: data._id,
                        title: data.title || '',
                        excerpt: data.excerpt || '',
                        // bodyHtml pehle check karo (hamare custom editor se save hota hai)
                        // Agar nahi hai to Portable Text body ko HTML me convert karo
                        body: data.bodyHtml || convertBodyToHtml(data.body) || '',
                        category: data.category?.slug?.current || data.category || 'crime',
                        district: data.district || 'garhwa',
                        featured: data.featured || false,
                        featureImageUrl: data.featureImage?.asset?.url || data.featureImageUrl || '',
                        featureImageId: data.featureImage?.asset?._ref || data.featureImageId || '',
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                        publishedAt: data.publishedAt || '',
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
