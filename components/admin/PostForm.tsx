'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

// Dynamic import to avoid SSR issues with contentEditable
const RichEditor = dynamic(() => import('./RichEditor'), {
    ssr: false, loading: () => (
        <div style={{ minHeight: '800px', border: '2px solid #e2e8f0', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Editor लोड हो रहा है...
        </div>
    )
})

interface PostFormProps {
    initialData?: any
    isEditing?: boolean
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
    background: 'white'
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
    const router = useRouter()
    const imgInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [imgUploading, setImgUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        excerpt: initialData?.excerpt || '',
        body: initialData?.body || '',
        category: initialData?.category || 'crime',
        district: initialData?.district || 'garhwa',
        featured: initialData?.featured || false,
        featureImageUrl: initialData?.featureImageUrl || '',
        featureImageId: initialData?.featureImageId || '',
        tags: initialData?.tags || '',
    })

    const set = (key: string) => (e: any) =>
        setFormData(prev => ({ ...prev, [key]: e.target.value }))

    const handleFeatureImageUpload = async (file: File) => {
        if (file.size > 4 * 1024 * 1024) {
            setError('तस्वीर बहुत बड़ी है! कृपया 4MB से छोटी तस्वीर चुनें। (Max 4MB)')
            return
        }
        setImgUploading(true)
        setError('')
        const fd = new FormData()
        fd.append('file', file)
        try {
            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd })

            if (!res.ok) {
                if (res.status === 413) throw new Error('तस्वीर बहुत बड़ी है (Payload Too Large)')
                const text = await res.text()
                let errMessage = 'Server Error'
                try {
                    const data = JSON.parse(text)
                    errMessage = data.error || errMessage
                } catch {
                    errMessage = 'Invalid server response'
                }
                throw new Error(errMessage)
            }

            const data = await res.json()
            setFormData(prev => ({
                ...prev,
                featureImageUrl: data.url,
                featureImageId: data.assetId,
            }))
        } catch (err: any) {
            console.error('Upload Error:', err)
            setError('Upload failed: ' + (err.message || 'Server error'))
        } finally {
            setImgUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        const url = isEditing
            ? `/api/admin/posts/${initialData._id}`
            : '/api/admin/posts/create'

        try {
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const result = await res.json()

            if (res.ok) {
                setSuccess('खबर सफलतापूर्वक पब्लिश हो गई!')
                setTimeout(() => router.push('/admin/dashboard/posts'), 1800)
            } else {
                setError(result.error || 'पब्लिश नहीं हो सका')
            }
        } catch {
            setError('सर्वर से कनेक्ट नहीं हो सका')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

                {/* ===== LEFT: Main Content ===== */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Alerts */}
                    {success && (
                        <div style={{ padding: '1rem 1.25rem', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                            {success}
                        </div>
                    )}
                    {error && (
                        <div style={{ padding: '1rem 1.25rem', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={labelStyle}>
                            हेडलाइन (Title) <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={set('title')}
                            placeholder="यहाँ खबर की हेडलाइन लिखें..."
                            style={{ ...inputStyle, fontSize: '1.15rem', fontWeight: 700 }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                            {formData.title.length} अक्षर
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={labelStyle}>सारांश (Excerpt)</label>
                        <textarea
                            rows={3}
                            value={formData.excerpt}
                            onChange={set('excerpt')}
                            placeholder="खबर का छोटा सारांश (Google और Telegram में दिखेगा)..."
                            style={{ ...inputStyle, resize: 'vertical' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Rich Editor */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
                            पूरी खबर (Content) <span style={{ color: '#dc2626' }}>*</span>
                            <span style={{ fontWeight: 400, color: '#94a3b8', textTransform: 'none', letterSpacing: 0, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                — Bold, Italic, Image, Heading सब toolbar में है
                            </span>
                        </label>
                        <RichEditor
                            value={formData.body}
                            onChange={val => setFormData(prev => ({ ...prev, body: val }))}
                            placeholder="यहाँ विस्तार से खबर लिखें..."
                        />
                    </div>
                </div>

                {/* ===== RIGHT: Settings ===== */}
                <div style={{ position: 'sticky', top: '72px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Publish Button Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #dc2626, #991b1b)',
                                color: 'white', border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '1rem', fontWeight: 800,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                boxShadow: loading ? 'none' : '0 6px 20px rgba(220,38,38,0.35)',
                                transition: 'all 0.2s',
                                marginBottom: '0.75rem'
                            }}
                        >
                            {loading ? 'पब्लिश हो रही है...' : isEditing ? 'अपडेट करें' : 'अभी पब्लिश करें'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/admin/dashboard/posts')}
                            style={{
                                width: '100%', padding: '0.7rem',
                                background: '#f8fafc', color: '#475569',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit'
                            }}
                        >
                            ← वापस जाएं
                        </button>
                    </div>

                    {/* Feature Image Upload */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={labelStyle}>फीचर इमेज (Feature Image)</label>

                        {formData.featureImageUrl ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={formData.featureImageUrl}
                                    alt="Feature"
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, featureImageUrl: '', featureImageId: '' }))}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'rgba(0,0,0,0.6)', color: 'white',
                                        border: 'none', borderRadius: '50%',
                                        width: '28px', height: '28px',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}
                                >✕</button>
                            </div>
                        ) : (
                            <div
                                onClick={() => imgInputRef.current?.click()}
                                style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '0.75rem',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    transition: 'border-color 0.2s',
                                    marginBottom: '0.75rem'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#dc2626')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
                            >
                                {imgUploading ? (
                                    <div style={{ color: '#2563eb', fontWeight: 600 }}>अपलोड हो रहा है...</div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><ImageIcon size={32} color="#94a3b8" /></div>
                                        <div style={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                                            क्लिक करके तस्वीर चुनें
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                            JPG, PNG, WebP — Max 10MB
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <input
                            ref={imgInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) handleFeatureImageUpload(file)
                                e.target.value = ''
                            }}
                        />

                        {/* Or paste URL */}
                        <input
                            type="url"
                            value={formData.featureImageUrl}
                            onChange={set('featureImageUrl')}
                            placeholder="या Image URL पेस्ट करें..."
                            style={{ ...inputStyle, fontSize: '0.82rem' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Category & District */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={labelStyle}>श्रेणी (Category)</label>
                        <select
                            value={formData.category}
                            onChange={set('category')}
                            style={{ ...inputStyle, marginBottom: '1rem' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <optgroup label="--- अखबार श्रेणियाँ ---">
                                <option value="top-story">टॉप स्टोरी</option>
                                <option value="crime">अपराध समाचार</option>
                                <option value="administration">प्रशासनिक कार्रवाई</option>
                                <option value="city-facilities">शहर की सुविधाएं</option>
                                <option value="disaster-accident">आपदा / दुर्घटना</option>
                                <option value="health-education">स्वास्थ्य और शिक्षा</option>
                                <option value="public-issues">जनसमस्या</option>
                                <option value="rural-development">ग्रामीण विकास</option>
                                <option value="social-events">सामाजिक कार्यक्रम</option>
                            </optgroup>
                            <optgroup label="--- सामान्य श्रेणियाँ ---">
                                <option value="politics">राजनीति</option>
                                <option value="national">राष्ट्रीय</option>
                                <option value="international">अंतर्राष्ट्रीय</option>
                                <option value="sports">खेल</option>
                                <option value="entertainment">मनोरंजन</option>
                                <option value="business">व्यापार / बिज़नेस</option>
                                <option value="finance">फाइनेंस</option>
                                <option value="technology">टेक्नोलॉजी</option>
                                <option value="jobs">सरकारी नौकरी</option>
                                <option value="lifestyle">लाइफस्टाइल</option>
                                <option value="love-relationships">प्रेम / रिश्ते</option>
                                <option value="astrology">राशिफल</option>
                                <option value="religion">धर्म / अध्यात्म</option>
                                <option value="auto">ऑटो</option>
                                <option value="agriculture">कृषि</option>
                            </optgroup>
                        </select>

                        <label style={labelStyle}>जिला (District)</label>
                        <select
                            value={formData.district}
                            onChange={set('district')}
                            style={{ ...inputStyle, marginBottom: '1rem' }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <option value="garhwa">गढ़वा</option>
                            <option value="palamu">पलामू</option>
                            <option value="jharkhand">झारखंड (समग्र)</option>
                        </select>

                        <label style={labelStyle}>Tags (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={set('tags')}
                            placeholder="गढ़वा, अपराध, NH-75..."
                            style={{ ...inputStyle }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Featured Toggle */}
                    <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>फीचर्ड?</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Homepage पर बड़ा दिखाएं</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: formData.featured ? '#dc2626' : '#cbd5e1',
                                borderRadius: '26px', transition: '0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    height: '20px', width: '20px',
                                    left: formData.featured ? '24px' : '3px',
                                    bottom: '3px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    transition: '0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    )
}
