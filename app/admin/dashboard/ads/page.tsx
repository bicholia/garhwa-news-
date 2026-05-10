'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Image as ImageIcon, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Post = {
    _id: string
    title: string
    publishedAt: string
    localAd?: {
        url?: string
        isActive?: boolean
        image?: { asset?: { _id?: string; url?: string } }
    }
}

type GlobalAd = {
    _id: string
    title: string
    slot: string
    customWidth?: number
    customHeight?: number
    priority: number
    startDate?: string
    endDate?: string
    isActive: boolean
    url?: string
    altText?: string
    image?: { asset?: { _id?: string; url?: string } }
}

type UploadStatus = 'idle' | 'uploading' | 'saving' | 'success' | 'error'

// ── Upload Helper (with retry) ────────────────────────────────────────────────
async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
    })

    const data = await res.json()
    if (!res.ok || !data.assetId) {
        throw new Error(data.error || `Upload failed with status ${res.status}`)
    }

    return data.assetId as string
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusMsg({ status, msg }: { status: UploadStatus; msg: string }) {
    if (status === 'idle') return null
    const cfg = {
        uploading: { color: '#1d4ed8', bg: '#eff6ff', icon: <Loader2 size={16} className="spin" /> },
        saving: { color: '#7c3aed', bg: '#f5f3ff', icon: <Loader2 size={16} className="spin" /> },
        success: { color: '#15803d', bg: '#f0fdf4', icon: <CheckCircle size={16} /> },
        error: { color: '#dc2626', bg: '#fef2f2', icon: <XCircle size={16} /> },
    }[status]

    return (
        <div style={{ background: cfg.bg, color: cfg.color, padding: '0.75rem 1rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginTop: '0.75rem', fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {cfg.icon}{msg}
        </div>
    )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AdsManagerPage() {
    const [activeTab, setActiveTab] = useState<'local' | 'global'>('global')
    const [posts, setPosts] = useState<Post[]>([])
    const [globalAds, setGlobalAds] = useState<GlobalAd[]>([])
    const [loading, setLoading] = useState(true)
    const [pageError, setPageError] = useState('')

    // Separate file input refs
    const localFileRef = useRef<HTMLInputElement>(null)
    const globalFileRef = useRef<HTMLInputElement>(null)

    // Local modal
    const [activePost, setActivePost] = useState<Post | null>(null)
    const [localAdUrl, setLocalAdUrl] = useState('')
    const [localPreview, setLocalPreview] = useState('')
    const [localStatus, setLocalStatus] = useState<UploadStatus>('idle')
    const [localMsg, setLocalMsg] = useState('')

    // Global modal
    const [globalOpen, setGlobalOpen] = useState(false)
    const [globalPreview, setGlobalPreview] = useState('')
    const [globalStatus, setGlobalStatus] = useState<UploadStatus>('idle')
    const [globalMsg, setGlobalMsg] = useState('')
    const [globalForm, setGlobalForm] = useState({
        id: '', title: '', url: '', altText: '',
        slot: 'homepage_hero', customWidth: '', customHeight: '',
        priority: '0', startDate: '', endDate: '',
        isActive: true, existingAssetId: ''
    })

    // ── Fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (activeTab === 'local') fetchPosts()
        if (activeTab === 'global') fetchGlobalAds()
    }, [activeTab])

    async function fetchPosts() {
        setLoading(true); setPageError('')
        try {
            const res = await fetch('/api/admin/ads')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
            setPosts(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setPageError('Articles load nahi hue: ' + e.message)
        } finally { setLoading(false) }
    }

    async function fetchGlobalAds() {
        setLoading(true); setPageError('')
        try {
            const res = await fetch('/api/admin/global-ads')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
            setGlobalAds(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setPageError('Global banners load nahi hue: ' + e.message)
        } finally { setLoading(false) }
    }

    // ── LOCAL MODAL ────────────────────────────────────────────────────────────
    function openLocal(post: Post) {
        setActivePost(post)
        setLocalAdUrl(post.localAd?.url || '')
        setLocalPreview(post.localAd?.image?.asset?.url || '')
        setLocalStatus('idle'); setLocalMsg('')
        if (localFileRef.current) localFileRef.current.value = ''
    }

    function closeLocal() {
        setActivePost(null)
        setLocalPreview('')
        setLocalStatus('idle'); setLocalMsg('')
        if (localFileRef.current) localFileRef.current.value = ''
    }

    async function handleSaveLocal() {
        const file = localFileRef.current?.files?.[0]
        const hasExisting = !!activePost?.localAd?.image?.asset?._id

        if (!file && !hasExisting) {
            setLocalStatus('error')
            setLocalMsg('कृपया पहले एक banner image चुनें।')
            return
        }

        try {
            // Step 1: Upload image
            let assetId = activePost?.localAd?.image?.asset?._id || ''

            if (file) {
                setLocalStatus('uploading'); setLocalMsg(`Image upload ho rahi hai... (${(file.size / 1024).toFixed(0)} KB)`)
                assetId = await uploadImage(file)
                setLocalMsg('Image upload ho gaya! Ab save ho raha hai...')
            }

            // Step 2: Save to Sanity
            setLocalStatus('saving'); setLocalMsg('Sanity mein save ho raha hai...')
            const res = await fetch('/api/admin/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activePost!._id,
                    imageAssetId: assetId,
                    url: localAdUrl.trim(),
                    isActive: true,
                    action: 'update'
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `Save failed: HTTP ${res.status}`)

            setLocalStatus('success')
            setLocalMsg('✅ विज्ञापन सफलतापूर्वक सेव हो गया!')
            await fetchPosts()
            setTimeout(closeLocal, 1200)

        } catch (e: any) {
            setLocalStatus('error')
            setLocalMsg('❌ ' + (e.message || 'Unknown error'))
        }
    }

    async function handleRemoveLocal(id: string) {
        if (!confirm('क्या आप सच में इस विज्ञापन को हटाना चाहते हैं?')) return
        try {
            const res = await fetch('/api/admin/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'remove' })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Remove failed')
            await fetchPosts()
        } catch (e: any) {
            alert('❌ Error: ' + e.message)
        }
    }

    // ── GLOBAL MODAL ───────────────────────────────────────────────────────────
    function openGlobal(ad: GlobalAd | null = null) {
        setGlobalPreview('')
        setGlobalStatus('idle'); setGlobalMsg('')
        if (globalFileRef.current) globalFileRef.current.value = ''

        if (ad) {
            setGlobalForm({
                id: ad._id,
                title: ad.title || '',
                url: ad.url || '',
                altText: ad.altText || '',
                slot: ad.slot || 'homepage_hero',
                customWidth: ad.customWidth?.toString() || '',
                customHeight: ad.customHeight?.toString() || '',
                priority: ad.priority?.toString() || '0',
                startDate: ad.startDate ? ad.startDate.slice(0, 16) : '',
                endDate: ad.endDate ? ad.endDate.slice(0, 16) : '',
                isActive: ad.isActive ?? true,
                existingAssetId: ad.image?.asset?._id || ''
            })
            if (ad.image?.asset?.url) setGlobalPreview(ad.image.asset.url)
        } else {
            setGlobalForm({
                id: '', title: '', url: '', altText: '',
                slot: 'homepage_hero', customWidth: '', customHeight: '',
                priority: '0', startDate: '', endDate: '',
                isActive: true, existingAssetId: ''
            })
        }
        setGlobalOpen(true)
    }

    function closeGlobal() {
        setGlobalOpen(false)
        setGlobalPreview('')
        setGlobalStatus('idle'); setGlobalMsg('')
        if (globalFileRef.current) globalFileRef.current.value = ''
    }

    async function handleSaveGlobal(e: React.FormEvent) {
        e.preventDefault()
        const file = globalFileRef.current?.files?.[0]

        if (!file && !globalForm.existingAssetId) {
            setGlobalStatus('error')
            setGlobalMsg('Banner image required hai. Ek image upload karein.')
            return
        }

        if (!globalForm.title.trim()) {
            setGlobalStatus('error')
            setGlobalMsg('Campaign Title required hai.')
            return
        }

        try {
            let assetId = globalForm.existingAssetId

            if (file) {
                setGlobalStatus('uploading'); setGlobalMsg(`Image upload ho rahi hai... (${(file.size / 1024).toFixed(0)} KB)`)
                assetId = await uploadImage(file)
                setGlobalMsg('Image upload ho gaya! Ab save ho raha hai...')
            }

            setGlobalStatus('saving'); setGlobalMsg('Sanity mein save ho raha hai...')

            const payload = {
                action: globalForm.id ? 'update' : 'create',
                id: globalForm.id,
                imageAssetId: assetId,
                title: globalForm.title.trim(),
                url: globalForm.url.trim(),
                altText: globalForm.altText.trim(),
                slot: globalForm.slot,
                customWidth: globalForm.customWidth,
                customHeight: globalForm.customHeight,
                priority: globalForm.priority,
                startDate: globalForm.startDate ? new Date(globalForm.startDate).toISOString() : null,
                endDate: globalForm.endDate ? new Date(globalForm.endDate).toISOString() : null,
                isActive: globalForm.isActive
            }

            const res = await fetch('/api/admin/global-ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `Save failed: HTTP ${res.status}`)

            setGlobalStatus('success')
            setGlobalMsg('✅ Global Banner saved successfully!')
            await fetchGlobalAds()
            setTimeout(closeGlobal, 1200)

        } catch (e: any) {
            setGlobalStatus('error')
            setGlobalMsg('❌ ' + (e.message || 'Unknown error'))
        }
    }

    async function handleDeleteGlobal(id: string) {
        if (!confirm('Delete this global banner? This cannot be undone.')) return
        try {
            const res = await fetch('/api/admin/global-ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'delete' })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Delete failed')
            await fetchGlobalAds()
        } catch (e: any) {
            alert('❌ Delete failed: ' + e.message)
        }
    }

    async function toggleStatus(ad: GlobalAd) {
        try {
            const res = await fetch('/api/admin/global-ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    id: ad._id,
                    isActive: !ad.isActive,
                    title: ad.title,
                    slot: ad.slot,
                    imageAssetId: ad.image?.asset?._id
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            await fetchGlobalAds()
        } catch (e: any) {
            alert('❌ Status change failed: ' + e.message)
        }
    }

    const isLocalBusy = localStatus === 'uploading' || localStatus === 'saving'
    const isGlobalBusy = globalStatus === 'uploading' || globalStatus === 'saving'
    const totalWithAds = posts.filter(p => p.localAd?.image?.asset).length
    const totalEmpty = posts.length - totalWithAds

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div>
            <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/dashboard" style={{ width: 38, height: 38, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}>←</Link>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Banner Ads Manager</h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>Manage all advertisements across your platform</p>
                    </div>
                </div>
                {activeTab === 'local' && !loading && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 0.9rem', borderRadius: 8, fontWeight: 700 }}>{totalWithAds} Active</span>
                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.4rem 0.9rem', borderRadius: 8, fontWeight: 700 }}>{totalEmpty} Empty</span>
                    </div>
                )}
                {activeTab === 'global' && !loading && (
                    <button onClick={() => openGlobal()} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.7rem 1.2rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                        + Add Global Banner
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
                {(['global', 'local'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '3px solid #dc2626' : '3px solid transparent', padding: '0.75rem 1.5rem', fontWeight: activeTab === tab ? 800 : 600, color: activeTab === tab ? '#dc2626' : '#64748b', cursor: 'pointer', fontSize: '1rem' }}>
                        {tab === 'global' ? 'Global Site Banners' : 'Local Article Banners'}
                    </button>
                ))}
            </div>

            {/* Page-level error */}
            {pageError && (
                <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: 8, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <AlertCircle size={18} /> {pageError}
                    <button onClick={() => activeTab === 'global' ? fetchGlobalAds() : fetchPosts()} style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader2 size={20} className="spin" /> डेटा लोड हो रहा है...
                </div>
            ) : (
                <>
                    {/* ── GLOBAL TAB ── */}
                    {activeTab === 'global' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {globalAds.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
                                    <ImageIcon size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                                    <h3 style={{ color: '#475569', margin: '0 0 0.5rem' }}>No Global Banners yet</h3>
                                    <p style={{ color: '#94a3b8', margin: 0 }}>Click "+ Add Global Banner" to create your first banner.</p>
                                </div>
                            ) : globalAds.map(ad => (
                                <div key={ad._id} style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                    <div style={{ width: 120, height: 75, flexShrink: 0, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ad.image?.asset?.url
                                            ? <img src={ad.image.asset.url} alt="banner" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            : <ImageIcon size={28} color="#94a3b8" />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '0.2rem' }}>{ad.title}</div>
                                        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Slot: <strong>{ad.slot}</strong> · Priority: <strong>{ad.priority}</strong></div>
                                        {ad.url && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.url}</div>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                        <button onClick={() => toggleStatus(ad)} style={{ background: ad.isActive ? '#dcfce7' : '#f1f5f9', color: ad.isActive ? '#166534' : '#64748b', padding: '0.35rem 0.8rem', borderRadius: 99, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                                            {ad.isActive ? '✅ ACTIVE' : '⏸ INACTIVE'}
                                        </button>
                                        <button onClick={() => openGlobal(ad)} style={{ padding: '0.35rem 0.8rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                        <button onClick={() => handleDeleteGlobal(ad._id)} style={{ padding: '0.35rem 0.8rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── LOCAL TAB ── */}
                    {activeTab === 'local' && (
                        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0.85rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#64748b', fontSize: '0.88rem' }}>
                                <span>Article</span><span>Ad Status</span><span style={{ textAlign: 'right' }}>Actions</span>
                            </div>
                            {posts.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No articles found.</div>
                            ) : posts.map((post, idx) => {
                                const hasAd = !!post.localAd?.image?.asset?.url
                                return (
                                    <div key={post._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0.9rem 1.5rem', alignItems: 'center', borderBottom: idx < posts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '1rem' }}>{post.title}</div>
                                        <div>
                                            <span style={{ display: 'inline-block', background: hasAd ? '#dcfce7' : '#f1f5f9', color: hasAd ? '#166534' : '#64748b', padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700 }}>
                                                {hasAd ? '✅ Active' : '⬜ Empty'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openLocal(post)} style={{ padding: '0.35rem 0.8rem', background: hasAd ? '#eff6ff' : '#3b82f6', color: hasAd ? '#2563eb' : 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                                                {hasAd ? 'बदलें' : '+ Add'}
                                            </button>
                                            {hasAd && (
                                                <button onClick={() => handleRemoveLocal(post._id)} style={{ padding: '0.35rem 0.8rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>हटाएं</button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}

            {/* ── LOCAL MODAL ── */}
            {activePost && activeTab === 'local' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 0, marginBottom: '0.25rem' }}>
                            {activePost.localAd?.image ? 'विज्ञापन बदलें' : 'नया विज्ञापन लगाएं'}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', marginTop: 0 }}><strong>Article:</strong> {activePost.title}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Image preview */}
                            {localPreview && (
                                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                    <img src={localPreview} alt="preview" style={{ maxHeight: 90, borderRadius: 4, maxWidth: '100%' }} />
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Current image</div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>📷 Banner Image {!activePost.localAd?.image && '*'}</label>
                                <input
                                    type="file" ref={localFileRef} accept="image/*"
                                    disabled={isLocalBusy}
                                    onChange={e => {
                                        const f = e.target.files?.[0]
                                        if (f) {
                                            const r = new FileReader()
                                            r.onload = ev => setLocalPreview(ev.target?.result as string)
                                            r.readAsDataURL(f)
                                        }
                                        setLocalStatus('idle'); setLocalMsg('')
                                    }}
                                    style={{ width: '100%', padding: '0.6rem', border: '2px dashed #cbd5e1', borderRadius: 8, cursor: 'pointer', fontSize: '0.88rem' }}
                                />
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Max 8MB · JPG, PNG, WebP, GIF</div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>🔗 Target URL (optional)</label>
                                <input type="url" value={localAdUrl} onChange={e => setLocalAdUrl(e.target.value)} placeholder="https://example.com" disabled={isLocalBusy}
                                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.9rem' }} />
                            </div>

                            <StatusMsg status={localStatus} msg={localMsg} />

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={handleSaveLocal} disabled={isLocalBusy}
                                    style={{ flex: 1, padding: '0.8rem', background: isLocalBusy ? '#94a3b8' : '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: isLocalBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {isLocalBusy ? <><Loader2 size={16} className="spin" /> {localStatus === 'uploading' ? 'Upload...' : 'Saving...'}</> : '💾 सेव करें'}
                                </button>
                                <button onClick={closeLocal} disabled={isLocalBusy}
                                    style={{ padding: '0.8rem 1.2rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, cursor: isLocalBusy ? 'not-allowed' : 'pointer' }}>
                                    रद्द
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── GLOBAL MODAL ── */}
            {globalOpen && activeTab === 'global' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: 580, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 0, marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                            {globalForm.id ? '✏️ Edit Global Banner' : '+ Create Global Banner'}
                        </h2>

                        <form onSubmit={handleSaveGlobal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Campaign Title *</label>
                                <input required type="text" value={globalForm.title} onChange={e => setGlobalForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Diwali Sale 2026" disabled={isGlobalBusy}
                                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 8 }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Banner Slot *</label>
                                    <select value={globalForm.slot} onChange={e => setGlobalForm(f => ({ ...f, slot: e.target.value }))} disabled={isGlobalBusy}
                                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white' }}>
                                        <option value="homepage_hero">Homepage Hero</option>
                                        <option value="article_top_leaderboard">Article Top (728×90)</option>
                                        <option value="article_sidebar_rectangle">Article Sidebar (300×250)</option>
                                        <option value="article_below_content">Article Bottom (300×250)</option>
                                        <option value="custom">Custom Size</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Priority</label>
                                    <input type="number" value={globalForm.priority} onChange={e => setGlobalForm(f => ({ ...f, priority: e.target.value }))} disabled={isGlobalBusy}
                                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 8 }} />
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Higher = shows first</div>
                                </div>
                            </div>

                            {globalForm.slot === 'custom' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.88rem' }}>Width (px)</label>
                                        <input type="number" required value={globalForm.customWidth} onChange={e => setGlobalForm(f => ({ ...f, customWidth: e.target.value }))} placeholder="728" disabled={isGlobalBusy}
                                            style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #e2e8f0', borderRadius: 6 }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.88rem' }}>Height (px)</label>
                                        <input type="number" required value={globalForm.customHeight} onChange={e => setGlobalForm(f => ({ ...f, customHeight: e.target.value }))} placeholder="90" disabled={isGlobalBusy}
                                            style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #e2e8f0', borderRadius: 6 }} />
                                    </div>
                                </div>
                            )}

                            {/* Image section */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                    📷 Banner Image {!globalForm.existingAssetId && '*'}
                                </label>
                                {globalPreview && (
                                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                                        <img src={globalPreview} alt="preview" style={{ maxHeight: 90, borderRadius: 4, maxWidth: '100%' }} />
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                                            {globalForm.existingAssetId ? 'Current image (new image choose karein to change)' : 'Selected image preview'}
                                        </div>
                                    </div>
                                )}
                                <input type="file" ref={globalFileRef} accept="image/*" disabled={isGlobalBusy}
                                    onChange={e => {
                                        const f = e.target.files?.[0]
                                        if (f) {
                                            const r = new FileReader()
                                            r.onload = ev => setGlobalPreview(ev.target?.result as string)
                                            r.readAsDataURL(f)
                                        }
                                        setGlobalStatus('idle'); setGlobalMsg('')
                                    }}
                                    style={{ width: '100%', padding: '0.6rem', border: '2px dashed #cbd5e1', borderRadius: 8, cursor: 'pointer', fontSize: '0.88rem' }} />
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Max 8MB · JPG, PNG, WebP, GIF</div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Target URL</label>
                                <input type="url" value={globalForm.url} onChange={e => setGlobalForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" disabled={isGlobalBusy}
                                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 8 }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.88rem' }}>Start Date</label>
                                    <input type="datetime-local" value={globalForm.startDate} onChange={e => setGlobalForm(f => ({ ...f, startDate: e.target.value }))} disabled={isGlobalBusy}
                                        style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '0.88rem' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.88rem' }}>End Date</label>
                                    <input type="datetime-local" value={globalForm.endDate} onChange={e => setGlobalForm(f => ({ ...f, endDate: e.target.value }))} disabled={isGlobalBusy}
                                        style={{ width: '100%', padding: '0.6rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '0.88rem' }} />
                                </div>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={globalForm.isActive} onChange={e => setGlobalForm(f => ({ ...f, isActive: e.target.checked }))} disabled={isGlobalBusy}
                                    style={{ width: 18, height: 18 }} />
                                <span style={{ fontWeight: 600 }}>Active (visible on public site)</span>
                            </label>

                            <StatusMsg status={globalStatus} msg={globalMsg} />

                            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #f1f5f9' }}>
                                <button type="submit" disabled={isGlobalBusy}
                                    style={{ flex: 1, padding: '0.85rem', background: isGlobalBusy ? '#94a3b8' : '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: isGlobalBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {isGlobalBusy ? <><Loader2 size={16} className="spin" /> {globalStatus === 'uploading' ? 'Uploading...' : 'Saving...'}</> : '💾 Save Banner'}
                                </button>
                                <button type="button" onClick={closeGlobal} disabled={isGlobalBusy}
                                    style={{ padding: '0.85rem 1.25rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, cursor: isGlobalBusy ? 'not-allowed' : 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
