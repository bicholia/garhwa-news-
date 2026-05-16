'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { compressImage } from '@/lib/imageUtils'
import { Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'

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
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    const [isDuplicate, setIsDuplicate] = useState(false)
    const [checkingDuplicate, setCheckingDuplicate] = useState(false)

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
        author: initialData?.author?._ref || 'author-suhasini',
    })

    const set = (key: string) => (e: any) =>
        setFormData(prev => ({ ...prev, [key]: e.target.value }))

    useEffect(() => {
        if (!formData.title || isEditing) {
            setIsDuplicate(false)
            return
        }
        
        const timer = setTimeout(async () => {
            setCheckingDuplicate(true)
            try {
                const res = await fetch('/api/admin/posts/check-duplicate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: formData.title }),
                })
                const data = await res.json()
                setIsDuplicate(data.isDuplicate)
            } catch (err) {
                console.error('Failed to check duplicate:', err)
            } finally {
                setCheckingDuplicate(false)
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [formData.title, isEditing])

    const handleFeatureImageUpload = async (file: File) => {
        setImgUploading(true)
        setError('')
        try {
            // Compress image before upload
            const compressedFile = await compressImage(file)
            
            const fd = new FormData()
            fd.append('file', compressedFile)
            
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

        if (isDuplicate) {
            setError('यह खबर पहले से मौजूद है! कृपया टाइटल बदलें।')
            setLoading(false)
            return
        }

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

    const handleAIGenerate = async () => {
        if (!aiPrompt) {
            setError('कृपया पहले कोई लिंक या जानकारी लिखें')
            return
        }
        setAiLoading(true)
        setError('')
        try {
            const res = await fetch('/api/admin/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'AI generation failed')

            // Update Text Data
            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                excerpt: data.excerpt || prev.excerpt,
                body: data.content || prev.body,
                category: data.category || prev.category,
                district: data.district || prev.district
            }))

            // Logic for Auto-Image Generation
            if (data.imagePrompt) {
                setImgUploading(true)
                try {
                    // Using an AI image generation service for "Wow" factor
                    const encodedPrompt = encodeURIComponent(data.imagePrompt)
                    const genImageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1200&height=800&seed=${Math.floor(Math.random() * 100000)}&nologo=true`
                    
                    // We directly set the URL as a preview, 
                    // the user can then "Publish" which will handle saving if needed 
                    // or we can upload it to Sanity right now.
                    // To ensure it's in Sanity, let's upload it to our media endpoint.
                    
                    const imgRes = await fetch(genImageUrl)
                    const blob = await imgRes.blob()
                    const file = new File([blob], 'ai-generated-image.jpg', { type: 'image/jpeg' })
                    
                    await handleFeatureImageUpload(file)
                } catch (imgErr) {
                    console.error('AI Image Fail:', imgErr)
                } finally {
                    setImgUploading(false)
                }
            }
            
            setSuccess('AI ने खबर और तस्वीर दोनों तैयार कर दी हैं! कृपया चेक करें।')
            setAiPrompt('')
        } catch (err: any) {
            setError('AI Error: ' + err.message)
        } finally {
            setAiLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 lg:gap-8 items-start">

                {/* ===== LEFT: Main Content ===== */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* AI Assistant Card */}
                    {!isEditing && (
                        <div style={{ 
                            background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', 
                            padding: '1.5rem', 
                            borderRadius: '1rem', 
                            border: '1.5px solid #bfdbfe',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                                <Sparkles size={20} color="#2563eb" />
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1e40af' }}>Magic AI Assistant</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <input 
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="किसी खबर का लिंक (URL) या छोटा विवरण यहाँ पेस्ट करें..."
                                    style={{
                                        ...inputStyle,
                                        borderColor: '#bfdbfe',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    disabled={aiLoading}
                                    onClick={handleAIGenerate}
                                    style={{
                                        background: '#2563eb',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        padding: '0 1.5rem',
                                        fontWeight: 700,
                                        cursor: aiLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {aiLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={18} />
                                    )}
                                    {aiLoading ? 'लिख रहा है...' : 'AI जादू'}
                                </button>
                            </div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                💡 टिप्स: लिंक पेस्ट करें और AI खुद फोटो, हेडलाइन और खबर लिख देगा।
                            </p>
                        </div>
                    )}

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
                        {checkingDuplicate && (
                            <div style={{ fontSize: '0.8rem', color: '#2563eb', marginTop: '0.35rem' }}>
                                डुप्लिकेट चेक किया जा रहा है...
                            </div>
                        )}
                        {isDuplicate && (
                            <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.35rem', fontWeight: 600 }}>
                                ⚠️ यह खबर पहले से मौजूद है! (Duplicate News)
                            </div>
                        )}
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
                <div className="flex flex-col gap-5 lg:sticky lg:top-[72px]">

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

                    {/* Author Selection */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <label style={labelStyle}>खबर किसने लिखी? (Author)</label>
                        <select
                            value={formData.author}
                            onChange={set('author')}
                            style={{ ...inputStyle }}
                            onFocus={e => e.target.style.borderColor = '#dc2626'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <option value="author-suhasini">सुहासिनी शर्मा</option>
                            <option value="author-admin">ThinkIndia Bureau</option>
                        </select>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                            News publish karne wale ka naam yaha se select karein.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
