'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Newspaper, Trash2 } from 'lucide-react'

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])
    const [filterEmpty, setFilterEmpty] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts')
            if (res.status === 401) {
                router.push('/admin/login')
                return
            }
            const data = await res.json()
            setPosts(Array.isArray(data) ? data : [])
        } catch (err) {
            setError('खबरें लोड नहीं हो सकीं')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('क्या आप इस खबर को हटाना चाहते हैं?')) return
        try {
            const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setPosts(posts.filter(p => p._id !== id))
            } else {
                alert('डिलीट नहीं हो सका')
            }
        } catch {
            alert('एरर आई')
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`क्या आप वाकई ${selectedPostIds.length} खबरों को हटाना चाहते हैं?`)) return
        try {
            const res = await fetch('/api/admin/posts/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedPostIds })
            })
            if (res.ok) {
                setPosts(posts.filter(p => !selectedPostIds.includes(p._id)))
                setSelectedPostIds([])
            } else {
                alert('डिलीट नहीं हो सका')
            }
        } catch {
            alert('एरर आई')
        }
    }

    const toggleSelectAll = () => {
        if (selectedPostIds.length === posts.length) {
            setSelectedPostIds([])
        } else {
            setSelectedPostIds(posts.map(p => p._id))
        }
    }

    const toggleSelectPost = (id: string) => {
        if (selectedPostIds.includes(id)) {
            setSelectedPostIds(selectedPostIds.filter(postId => postId !== id))
        } else {
            setSelectedPostIds([...selectedPostIds, id])
        }
    }

    const categoryColors: Record<string, string> = {
        'top-story': '#dc2626',
        'crime': '#991b1b',
        'administration': '#2563eb',
        'city-facilities': '#0891b2',
        'disaster-accident': '#ea580c',
        'health-education': '#16a34a',
        'public-issues': '#7c3aed',
        'rural-development': '#059669',
        'social-events': '#db2777',
        'politics': '#1d4ed8',
        'national': '#b45309',
        'international': '#0369a1',
        'sports': '#0891b2',
        'entertainment': '#c026d3',
        'business': '#d97706',
        'finance': '#15803d',
        'technology': '#4f46e5',
        'jobs': '#047857',
        'lifestyle': '#ec4899',
        'love-relationships': '#e11d48',
        'astrology': '#7e22ce',
        'religion': '#92400e',
        'auto': '#374151',
        'agriculture': '#3f6212',
    }
    const displayedPosts = filterEmpty ? posts.filter(p => !p.hasBody) : posts

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                        href="/admin/dashboard"
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
                            सभी खबरें
                        </h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                            {loading ? 'लोड हो रहा है...' : `कुल ${filterEmpty ? displayedPosts.length : posts.length} खबरें`}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setFilterEmpty(!filterEmpty)}
                        style={{
                            background: filterEmpty ? '#fff1f2' : 'white',
                            color: filterEmpty ? '#e11d48' : '#475569',
                            border: `1.5px solid ${filterEmpty ? '#fecdd3' : '#e2e8f0'}`,
                            padding: '0.7rem 1.2rem',
                            borderRadius: '0.75rem',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.15s'
                        }}
                    >
                        {filterEmpty ? '✓ खाली खबरें दिख रही हैं' : 'खाली खबरें खोजें'}
                    </button>
                    {selectedPostIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            style={{
                                background: '#fef2f2',
                                color: '#dc2626',
                                padding: '0.7rem 1.2rem',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                border: '1px solid #fca5a5',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Trash2 size={16} /> हटाएँ ({selectedPostIds.length})
                        </button>
                    )}
                    <Link
                        href="/admin/dashboard/posts/new"
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '0.7rem 1.5rem',
                            borderRadius: '0.75rem',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                        }}
                    >
                        + नई खबर लिखें
                    </Link>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', color: '#dc2626', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    <div style={{ fontSize: '1rem' }}>खबरें लोड हो रही हैं...</div>
                </div>
            )}

            {/* Empty */}
            {!loading && posts.length === 0 && !error && (
                <div style={{
                    textAlign: 'center', padding: '4rem',
                    background: 'white', borderRadius: '1rem',
                    border: '2px dashed #e2e8f0', color: '#94a3b8'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><Newspaper size={48} color="#94a3b8" /></div>
                    <h3 style={{ color: '#475569', fontWeight: 700 }}>अभी कोई खबर नहीं है</h3>
                    <p style={{ marginTop: '0.5rem' }}>पहली खबर लिखने के लिए ऊपर "+ नई खबर लिखें" पर क्लिक करें</p>
                </div>
            )}

            {/* Posts Table */}
            {!loading && posts.length > 0 && (
                <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                    {/* Table Head */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr 100px 100px 100px 100px 100px',
                        padding: '0.75rem 1.5rem',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        alignItems: 'center'
                    }}>
                        <input
                            type="checkbox"
                            checked={posts.length > 0 && selectedPostIds.length === posts.length}
                            onChange={toggleSelectAll}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#dc2626' }}
                        />
                        <span>शीर्षक (Title)</span>
                        <span>Photo</span>
                        <span>Content</span>
                        <span>श्रेणी</span>
                        <span>तारीख</span>
                        <span style={{ textAlign: 'right' }}>Actions</span>
                    </div>

                    {/* Rows */}
                    {displayedPosts.map((post, idx) => (
                        <div
                            key={post._id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr 100px 100px 100px 100px 100px',
                                padding: '0.6rem 1.5rem',
                                borderBottom: idx < posts.length - 1 ? '1px solid #f1f5f9' : 'none',
                                alignItems: 'center',
                                transition: 'background 0.15s',
                                background: selectedPostIds.includes(post._id) ? '#fef2f2' : 'transparent',
                                fontSize: '0.85rem'
                            }}
                            onMouseEnter={e => { if (!selectedPostIds.includes(post._id)) e.currentTarget.style.background = '#f8fafc' }}
                            onMouseLeave={e => { if (!selectedPostIds.includes(post._id)) e.currentTarget.style.background = 'transparent' }}
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    checked={selectedPostIds.includes(post._id)}
                                    onChange={() => toggleSelectPost(post._id)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#dc2626' }}
                                />
                            </div>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500, color: '#0f172a' }}>
                                {post.title || 'No Title'}
                            </div>
                            <div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: post.hasImage ? '#f0fdf4' : '#fff1f2',
                                    color: post.hasImage ? '#16a34a' : '#e11d48',
                                    border: `1px solid ${post.hasImage ? '#bbf7d0' : '#fecdd3'}`
                                }}>
                                    {post.hasImage ? '✓ Yes' : '✗ No'}
                                </span>
                            </div>
                            <div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: post.hasBody ? '#f0fdf4' : '#fff1f2',
                                    color: post.hasBody ? '#16a34a' : '#e11d48',
                                    border: `1px solid ${post.hasBody ? '#bbf7d0' : '#fecdd3'}`
                                }}>
                                    {post.hasBody ? '✓ Yes' : '✗ No'}
                                </span>
                            </div>
                            <div>
                                <span style={{
                                    background: categoryColors[post.category] || '#64748b',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700
                                }}>
                                    {post.category || 'N/A'}
                                </span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' }) : '—'}
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <Link
                                    href={`/admin/dashboard/posts/${post._id}`}
                                    style={{
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '0.4rem',
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    style={{
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '0.4rem',
                                        background: '#fef2f2',
                                        color: '#dc2626',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Del
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
