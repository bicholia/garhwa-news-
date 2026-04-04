'use client'

// app/admin/dashboard/bulk-upload/page.tsx
// Enterprise Bulk News Upload UI for NR Daily News Admin

import React, { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────
type ParsedRow = {
    _rowNum: number
    title: string
    body: string
    excerpt: string
    district: string
    category: string
    tags: string
    featured: string
    isBreaking: string
    publishedAt: string
    _autoCategory?: string
    _autoTags?: string[]
    _errors: string[]
    _warnings: string[]
    _editing: boolean
}

type UploadResult = {
    success: number
    failed: number
    total: number
    batchId: string
    validationErrors: { row: number; title: string; errors: { field: string; reason: string }[] }[]
    uploadErrors: { row: number; title: string; error: string }[]
    message: string
    isDryRun?: boolean
}

// ─── Auto-Detect (client-side preview only) ───────────────────────────────────
const CATEGORY_HINTS: Record<string, string[]> = {
    'apradh': ['हत्या', 'चोरी', 'FIR', 'पुलिस', 'गिरफ्तार', 'crime', 'murder'],
    'rajniti': ['BJP', 'Congress', 'चुनाव', 'election', 'नेता', 'CM'],
    'garhwa': ['गढ़वा', 'Garhwa'],
    'palamu': ['पलामू', 'Palamu', 'डालटनगंज'],
    'jharkhand': ['झारखंड', 'jharkhand', 'रांची'],
    'khel': ['cricket', 'खेल', 'match', 'IPL'],
    'swasthya': ['hospital', 'स्वास्थ्य', 'doctor', 'बीमारी'],
    'shiksha': ['school', 'शिक्षा', 'exam', 'परीक्षा'],
    'vyapar': ['business', 'बाजार', 'market', 'व्यापार'],
    'technology': ['mobile', 'internet', 'AI', 'tech'],
    'manoranjan': ['film', 'मनोरंजन', 'bollywood', 'song'],
    'dharm': ['temple', 'mandir', 'धर्म', 'त्योहार'],
}

const WEIGHTS: Record<string, number> = { garhwa: 5, palamu: 5, jharkhand: 4, apradh: 3, rajniti: 2 }

function clientDetectCategory(title: string, body: string): string {
    const text = `${title} ${body}`.toLowerCase()
    const scores: Record<string, number> = {}
    for (const [cat, kws] of Object.entries(CATEGORY_HINTS)) {
        let m = 0
        kws.forEach(kw => { if (text.includes(kw.toLowerCase())) m++ })
        if (m > 0) scores[cat] = m * (WEIGHTS[cat] || 2)
    }
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? (sorted[0]?.[0] ?? 'jharkhand') : 'jharkhand'
}

function clientAutoTags(title: string, district: string): string[] {
    const tags: string[] = []
    if (district) tags.push(district)
    const words = title.match(/[\u0900-\u097F]{3,}|[A-Z][a-z]{2,}/g) || []
    tags.push(...words.slice(0, 4))
    return [...new Set(tags)].slice(0, 6)
}

// ─── COLUMN NORMALIZATION (client side) ──────────────────────────────────────
function normalizeSheet(rawRows: Record<string, unknown>[]): ParsedRow[] {
    return rawRows.map((row, i) => {
        const get = (keys: string[]) => {
            for (const k of keys) {
                const v = row[k]
                if (v !== undefined && v !== null && v !== '') return String(v).trim()
            }
            return ''
        }
        const boolish = (keys: string[]) =>
            ['true', 'yes', '1', 'on', 'हाँ', 'haan'].includes(get(keys).toLowerCase())

        const title = get(['title', 'Title', 'News Title', 'शीर्षक', 'headline'])
        const body = get(['body', 'Body', 'content', 'Content', 'विवरण', 'details'])
        const excerpt = get(['excerpt', 'Excerpt', 'summary', 'सारांश'])
        const district = get(['district', 'District', 'जिला'])
        const category = get(['category', 'Category', 'श्रेणी'])
        const tags = get(['tags', 'Tags', 'टैग'])
        const featured = boolish(['featured', 'Featured']) ? 'yes' : 'no'
        const isBreaking = boolish(['isBreaking', 'breaking', 'Breaking']) ? 'yes' : 'no'
        const rawPublishedAt = get(['publishedAt', 'published_date', 'date', 'तारीख'])
        const publishedAt: string = rawPublishedAt || (new Date().toISOString().split('T')[0] ?? '')

        const errors: string[] = []
        const warnings: string[] = []

        if (!title) errors.push('Title (शीर्षक) required hai')
        else if (title.length < 5) errors.push('Title minimum 5 characters chahiye')
        if (!body) errors.push('Body (विवरण) required hai')

        const validDistricts = ['garhwa', 'palamu', 'jharkhand', 'national']
        if (district && !validDistricts.includes(district.toLowerCase())) {
            warnings.push(`District "${district}" auto-correct → jharkhand`)
        }

        const autoCategory = (!category && title) ? clientDetectCategory(title, body) : ''
        const autoTags = (!tags && title) ? clientAutoTags(title, district) : undefined

        return {
            _rowNum: i + 2,
            title, body, excerpt, district, category, tags,
            featured, isBreaking, publishedAt,
            _autoCategory: autoCategory || undefined,
            _autoTags: autoTags,
            _errors: errors,
            _warnings: warnings,
            _editing: false,
        }
    })
}

// ─── Download Template Helper ─────────────────────────────────────────────────
function downloadTemplate() {
    const sampleData = [
        {
            title: 'गढ़वा में नई सड़क का उद्घाटन',
            body: 'गढ़वा, 27 फरवरी। जिला प्रशासन ने आज नई सड़क का उद्घाटन किया। इस सड़क के बनने से ग्रामीणों को काफी फायदा होगा।',
            excerpt: 'जिला प्रशासन ने नई सड़क का उद्घाटन किया।',
            district: 'garhwa',
            category: '', // blank → auto-detect
            tags: '',     // blank → auto-generate
            featured: 'no',
            isBreaking: 'no',
            publishedAt: new Date().toISOString().split('T')[0],
        },
        {
            title: 'पलामू में चोरी के आरोप में गिरफ्तारी',
            body: 'पलामू पुलिस ने चोरी के मामले में दो आरोपियों को गिरफ्तार किया है। FIR दर्ज कर जांच शुरू की गई।',
            excerpt: '',
            district: 'palamu',
            category: 'apradh',
            tags: 'पलामू, पुलिस, गिरफ्तारी',
            featured: 'no',
            isBreaking: 'yes',
            publishedAt: '',
        },
    ]
    const ws = XLSX.utils.json_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'News')
    XLSX.writeFile(wb, 'NR_Daily_News_Template.xlsx')
}

// ─── Download Error CSV ───────────────────────────────────────────────────────
function downloadErrorCSV(validationErrors: UploadResult['validationErrors'], uploadErrors: UploadResult['uploadErrors']) {
    const rows = [
        ['Row', 'Title', 'Error'],
        ...validationErrors.map(e => [e.row, e.title, e.errors.map(x => x.reason).join('; ')]),
        ...uploadErrors.map(e => [e.row, e.title, e.error]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Errors')
    XLSX.writeFile(wb, `bulk-upload-errors-${Date.now()}.xlsx`)
}

// ─── PREMIUM STYLES ──────────────────────────────────────────────────────────
const styles = {
    container: {
        fontFamily: "'Outfit', 'Inter', sans-serif",
        maxWidth: 1300,
        margin: '0 auto',
        padding: '2rem 1rem',
        color: '#1e293b'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        borderRadius: 24,
    },
    gradientText: {
        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.75rem',
        borderRadius: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
        transition: 'all 0.3s ease'
    },
    secondaryBtn: {
        background: 'white',
        color: '#4f46e5',
        border: '1.5px solid #e0e7ff',
        padding: '0.75rem 1.75rem',
        borderRadius: 14,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple' }) => {
    const themes = {
        blue: { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' },
        green: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' },
        red: { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2' },
        yellow: { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' },
        purple: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
        gray: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
    }
    const theme = themes[variant]
    return (
        <span style={{ 
            backgroundColor: theme.bg, 
            color: theme.text, 
            border: `1px solid ${theme.border}`,
            padding: '4px 10px', 
            borderRadius: 10, 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
            {children}
        </span>
    )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BulkUploadPage() {
    const [rows, setRows] = useState<ParsedRow[]>([])
    const [fileName, setFileName] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<UploadResult | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [editingIdx, setEditingIdx] = useState<number | null>(null)
    const [autoGenImages, setAutoGenImages] = useState(true)
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const fileRef = useRef<HTMLInputElement>(null)

    const parseFile = useCallback((file: File) => {
        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            alert('Sirf .xlsx, .xls ya .csv file allowed hai!')
            return
        }
        setFileName(file.name)
        setResult(null)

        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target?.result
            const wb = XLSX.read(data, { type: 'array', cellDates: true })
            const sheetName = wb.SheetNames[0] ?? ''
            const ws = wb.Sheets[sheetName]!
            const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
            setRows(normalizeSheet(raw))
            setUploadProgress(0)
        }
        reader.readAsArrayBuffer(file)
    }, [])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) parseFile(file)
    }, [parseFile])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) parseFile(file)
        e.target.value = ''
    }

    const validRows = rows.filter(r => r._errors.length === 0)
    const invalidRows = rows.filter(r => r._errors.length > 0)

    const handleUpload = async (dryRun = false) => {
        if (validRows.length === 0) return
        setUploading(true)
        setUploadProgress(15)

        const toSend = validRows.map(r => ({
            title: r.title,
            body: r.body,
            excerpt: r.excerpt,
            district: r.district,
            category: r.category || r._autoCategory || '',
            tags: r.tags || (r._autoTags || []).join(', '),
            featured: r.featured,
            isBreaking: r.isBreaking,
            publishedAt: r.publishedAt,
            autoGenImage: autoGenImages,
        }))

        const ws = XLSX.utils.json_to_sheet(toSend)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'News')
        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
        const xlsxBlob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

        const fd = new FormData()
        fd.append('file', xlsxBlob, 'upload.xlsx')

        try {
            setUploadProgress(40)
            const res = await fetch(`/api/admin/bulk-upload${dryRun ? '?dryRun=true' : ''}`, {
                method: 'POST',
                body: fd,
            })
            setUploadProgress(85)
            const data: UploadResult = await res.json()
            setResult(data)
            setUploadProgress(100)
            if (!dryRun && data.success > 0) {
                setRows([])
                setFileName('')
            }
        } catch (err) {
            alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setUploading(false)
        }
    }

    const updateRow = (idx: number, field: keyof ParsedRow, value: string) => {
        setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
    }

    return (
        <div style={styles.container}>
            {/* ─── Header ─── */}
            <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ ...styles.gradientText, fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}
                    >
                        Bulk News Upload
                    </motion.h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
                        Enterprise content ingestion system for <span style={{ color: '#4f46e5', fontWeight: 700 }}>NR Daily News</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadTemplate}
                        style={{ ...styles.secondaryBtn, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>📄</span> Export Template
                    </motion.button>
                </div>
            </header>

            {/* ─── Drop Zone ─── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                    ...styles.glassCard,
                    border: `2px dashed ${isDragging ? '#6366f1' : 'rgba(0,0,0,0.08)'}`,
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginBottom: '2.5rem',
                }}
            >
                <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>
                    {fileName ? '📑' : '✨'}
                </div>
                <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.5rem', margin: 0, letterSpacing: '-0.02em' }}>
                    {fileName ? fileName : 'Upload your News Catalog'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.75rem', fontWeight: 500 }}>
                    {fileName ? 'System has parsed your file. See preview below.' : 'Drag & Drop Excel/CSV or click to browse'}
                </p>
                
                {!fileName && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <Badge variant="purple">MAX 1000 ROWS</Badge>
                        <Badge variant="blue">AUTO-CATEGORY 🤖</Badge>
                        <Badge variant="green">POSTGRES SYNC ⚡</Badge>
                    </div>
                )}
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} style={{ display: 'none' }} />
            </motion.div>

            {/* ─── Controls ─── */}
            <AnimatePresence>
                {rows.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ ...styles.glassCard, padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.9)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setAutoGenImages(!autoGenImages)}>
                                <div style={{ width: 48, height: 26, background: autoGenImages ? '#6366f1' : '#cbd5e1', borderRadius: 99, position: 'relative', transition: 'background 0.3s' }}>
                                    <motion.div animate={{ x: autoGenImages ? 24 : 3 }} style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', position: 'absolute', top: 3 }} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Auto-Image AI 🤖</span>
                            </div>
                            
                            <div style={{ height: 30, width: 1, background: '#e2e8f0' }} />
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setViewMode('table')} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: viewMode === 'table' ? '#f1f5f9' : 'transparent', cursor: 'pointer', transition: '0.2s' }}>📊 List View</button>
                                <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: viewMode === 'grid' ? '#f1f5f9' : 'transparent', cursor: 'pointer', transition: '0.2s' }}>🔲 Grid View</button>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Badge variant="green">{validRows.length} Validated</Badge>
                            {invalidRows.length > 0 && <Badge variant="red">{invalidRows.length} Issues</Badge>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Main Preview Content ─── */}
            {rows.length > 0 && (
                <div style={{ ...styles.glassCard, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>In-Memory Preview ({rows.length} records)</span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Click Edit icon to manually adjust Category or Tags</span>
                    </div>

                    {viewMode === 'table' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(248, 250, 252, 0.5)' }}>
                                        {['#', 'Feature Image 🤖', 'News Metadata', 'Categorization', 'Origin', 'Status', ''].map(h => (
                                            <th key={h} style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            key={idx} 
                                            style={{ 
                                                borderBottom: '1px solid rgba(0,0,0,0.03)', 
                                                background: row._errors.length > 0 ? 'rgba(255, 241, 242, 0.4)' : 'transparent',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            <td style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontWeight: 700 }}>{row._rowNum}</td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ width: 80, height: 54, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                                    {autoGenImages && row.title ? (
                                                        <img 
                                                            src={`https://loremflickr.com/80/54/${encodeURIComponent(row.title.match(/[A-Z][a-z]{3,}/g)?.join(',') || 'news')}`} 
                                                            alt="AI Preview" 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🖼️</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', maxWidth: 350 }}>
                                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '4px' }}>{row.title || 'CRITICAL: No Title Found'}</div>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    {row._warnings.map((w, wi) => <Badge key={wi} variant="yellow">⚠️ {w}</Badge>)}
                                                    {row.isBreaking === 'yes' && <Badge variant="red">BREAKING</Badge>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                {editingIdx === idx ? (
                                                    <select
                                                        value={row.category || row._autoCategory || ''}
                                                        onChange={e => { updateRow(idx, 'category', e.target.value); setEditingIdx(null) }}
                                                        style={{ border: '2px solid #6366f1', borderRadius: 10, padding: '6px 12px', fontSize: '0.85rem', fontWeight: 700, width: '100%' }}
                                                        autoFocus
                                                    >
                                                        {['garhwa', 'palamu', 'jharkhand', 'rashtriya', 'apradh', 'rajniti', 'khel', 'swasthya', 'shiksha', 'vyapar', 'technology', 'manoranjan', 'dharm'].map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        <Badge variant={row.category ? 'green' : 'blue'}>{row.category || `🤖 ${row._autoCategory}`}</Badge>
                                                        {(row.tags ? row.tags.split(/[,،;]/) : row._autoTags || []).slice(0, 2).map((t, ti) => (
                                                            <Badge key={ti} variant="gray">#{t.trim()}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <Badge variant="purple">{row.district || 'jharkhand'}</Badge>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>{row.publishedAt}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                {row._errors.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        {row._errors.map((e, ei) => <div key={ei} style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800 }}>❌ {e}</div>)}
                                                    </div>
                                                ) : <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 900, fontSize: '0.85rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }} /> VERIFIED</div>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <button onClick={() => setEditingIdx(editingIdx === idx ? null : idx)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px', opacity: 0.4 }}>✏️</button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', padding: '2rem' }}>
                            {rows.map((row, idx) => (
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    key={idx} 
                                    style={{ 
                                        ...styles.glassCard, 
                                        padding: '1rem', 
                                        background: row._errors.length > 0 ? '#fff1f2' : 'white',
                                        border: row._errors.length > 0 ? '1px solid #fecaca' : '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{ height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: '1rem' }}>
                                        <img 
                                            src={`https://loremflickr.com/400/300/${encodeURIComponent(row.title?.match(/[A-Z][a-z]{3,}/g)?.join(',') || 'news')}`} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            alt="News Preview" 
                                        />
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', height: '3.3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{row.title}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Badge variant="blue">{row.category || row._autoCategory}</Badge>
                                        <Badge variant="purple">{row.district}</Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Success/Error Board ─── */}
            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ ...styles.glassCard, padding: '2.5rem', marginBottom: '3rem', border: `3px solid ${result.success > 0 ? '#bbf7d0' : '#fecaca'}`, background: result.success > 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)' }}
                    >
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: result.success > 0 ? '#166534' : '#991b1b', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                            {result.isDryRun ? 'DRY-RUN COMPLETE' : (result.success > 0 ? 'UPLOAD SUCCESSFUL 🚀' : 'UPLOAD CRITICALLY FAILED')}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ ...styles.glassCard, padding: '1.5rem 2.5rem', background: 'white', flex: 1, minWidth: 150, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Ingested</div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#16a34a' }}>{result.success}</div>
                            </div>
                            <div style={{ ...styles.glassCard, padding: '1.5rem 2.5rem', background: 'white', flex: 1, minWidth: 150, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Blocked</div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#dc2626' }}>{result.failed}</div>
                            </div>
                            <div style={{ ...styles.glassCard, padding: '1.5rem 2.5rem', background: 'white', flex: 1, minWidth: 150, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Total</div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1e293b' }}>{result.total}</div>
                            </div>
                        </div>

                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569', marginBottom: '2rem' }}>{result.message}</p>

                        {(result.validationErrors?.length > 0 || result.uploadErrors?.length > 0) && (
                            <div style={{ ...styles.glassCard, background: 'rgba(255,25,25,0.03)', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(153, 27, 27, 0.1)' }}>
                                <div style={{ fontWeight: 800, color: '#991b1b', marginBottom: '1rem', fontSize: '0.9rem' }}>DETAILED ERROR LOG:</div>
                                <div style={{ maxHeight: 250, overflowY: 'auto', paddingRight: '1rem' }}>
                                    {[...result.validationErrors, ...result.uploadErrors].map((err: any, i) => (
                                        <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem', color: '#7f1d1d', fontWeight: 600 }}>
                                            <span style={{ opacity: 0.5 }}>ROW {err.row}:</span> {err.title} → <span style={{ color: '#dc2626' }}>{err.error || (err.errors as any[])?.map((x: any) => x.reason).join(', ')}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => downloadErrorCSV(result.validationErrors, result.uploadErrors)} style={{ ...styles.primaryBtn, background: '#dc2626', marginTop: '1.5rem', fontSize: '0.9rem' }}>Download Rejected Rows</motion.button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1.25rem' }}>
                            <button onClick={() => { setResult(null); setRows([]); setFileName('') }} style={styles.primaryBtn}>Initialize New Upload</button>
                            <a href="/admin/dashboard/posts" style={{ ...styles.secondaryBtn, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Sab Articles Dekho →</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Footer Action Bar ─── */}
            {rows.length > 0 && !uploading && !result && (
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ position: 'sticky', bottom: '2rem', zIndex: 100 }}
                >
                    <div style={{ ...styles.glassCard, padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.95)', border: '1.5px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Ready to process?</span>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>System calculated <span style={{ color: '#10b981', fontWeight: 800 }}>{validRows.length} valid</span> news entries.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <motion.button whileHover={{ y: -2 }} onClick={() => handleUpload(true)} style={{ ...styles.secondaryBtn, border: '2px solid #e0e7ff' }}>🔍 Dry Run Test</motion.button>
                            <motion.button whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleUpload(false)} style={styles.primaryBtn}>🚀 Start Bulk Import</motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ─── Progress Overlay ─── */}
            {uploading && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🚛</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Content is in Transit...</h2>
                        <div style={{ height: 14, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: '1rem', border: '1.5px solid #e2e8f0' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 99 }} />
                        </div>
                        <p style={{ fontWeight: 700, color: '#64748b' }}>Uploading Batch In Progress... {uploadProgress}%</p>
                    </div>
                </div>
            )}
        </div>
    )
}
