'use client'

// app/admin/dashboard/bulk-upload/page.tsx
// Enterprise Bulk News Upload UI for NR Daily News Admin

import React, { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'

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

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => {
    const colors: Record<string, string> = {
        blue: 'background:#dbeafe;color:#1d4ed8',
        green: 'background:#dcfce7;color:#15803d',
        red: 'background:#fee2e2;color:#dc2626',
        yellow: 'background:#fef9c3;color:#854d0e',
        gray: 'background:#f1f5f9;color:#475569',
        orange: 'background:#ffedd5;color:#c2410c',
    }
    const styleStr: string = colors[color] ?? colors['gray'] ?? ''
    const styleObj = Object.fromEntries(
        styleStr.split(';').filter(Boolean).map(s => {
            const colonIdx = s.indexOf(':')
            if (colonIdx < 0) return ['', '']
            return [s.slice(0, colonIdx).trim(), s.slice(colonIdx + 1).trim()]
        }).filter(([k]) => k !== '')
    ) as React.CSSProperties
    return (
        <span style={{ ...styleObj, padding: '2px 8px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, display: 'inline-block', marginRight: 4, marginBottom: 2 }}>
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
        setUploadProgress(10)

        // Build a fresh xlsx from only the valid rows to send to API
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
        }))

        const ws = XLSX.utils.json_to_sheet(toSend)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'News')
        const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
        const xlsxBlob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

        const fd = new FormData()
        fd.append('file', xlsxBlob, 'upload.xlsx')

        try {
            setUploadProgress(30)
            const res = await fetch(`/api/admin/bulk-upload${dryRun ? '?dryRun=true' : ''}`, {
                method: 'POST',
                body: fd,
            })
            setUploadProgress(90)
            const data: UploadResult = await res.json()
            setResult(data)
            setUploadProgress(100)
            if (!dryRun && data.success > 0) {
                // Clear uploaded rows from preview
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

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: 1200, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        📦 Bulk News Upload
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        Excel/CSV file upload karein — auto-category, auto-tags, preview & publish
                    </p>
                </div>
                <button
                    onClick={downloadTemplate}
                    style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#15803d', padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    ⬇️ Template Download
                </button>
            </div>

            {/* Drop Zone */}
            <div
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                    border: `2.5px dashed ${isDragging ? '#3b82f6' : '#cbd5e1'}`,
                    borderRadius: 16,
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? '#eff6ff' : '#f8fafc',
                    transition: 'all 0.2s',
                    marginBottom: '1.5rem',
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📂</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>
                    {fileName ? `✅ ${fileName}` : 'Excel या CSV file यहाँ drag करें'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                    या click करके file चुनें (.xlsx, .xls, .csv) — max 1000 rows
                </div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} style={{ display: 'none' }} />
            </div>

            {/* Stats bar */}
            {rows.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.75rem 1.25rem', fontWeight: 700, color: '#15803d' }}>
                        ✅ Valid: {validRows.length}
                    </div>
                    <div style={{ background: invalidRows.length > 0 ? '#fef2f2' : '#f0fdf4', border: '1px solid #fecaca', borderRadius: 10, padding: '0.75rem 1.25rem', fontWeight: 700, color: '#dc2626' }}>
                        ❌ Invalid: {invalidRows.length}
                    </div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.75rem 1.25rem', fontWeight: 700, color: '#1d4ed8' }}>
                        📋 Total: {rows.length}
                    </div>
                    <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '0.75rem 1.25rem', fontWeight: 700, color: '#7c3aed' }}>
                        🤖 Auto-category: {rows.filter(r => !r.category && r._autoCategory).length}
                    </div>
                    <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '0.75rem 1.25rem', fontWeight: 700, color: '#854d0e' }}>
                        🏷️ Auto-tags: {rows.filter(r => !r.tags && r._autoTags?.length).length}
                    </div>
                </div>
            )}

            {/* Preview Table */}
            {rows.length > 0 && (
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👁️ Preview Table
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>
                            ⚠️ Auto-detect columns mein edit icon se value change kar sakte hain
                        </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    {['#', 'Title', 'Category 🤖', 'Tags 🤖', 'District', 'Breaking', 'Status', ''].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={idx} style={{ background: row._errors.length > 0 ? '#fef2f2' : idx % 2 === 0 ? 'white' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontWeight: 600 }}>{row._rowNum}</td>
                                        <td style={{ padding: '0.75rem 1rem', maxWidth: 260 }}>
                                            <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title || <span style={{ color: '#dc2626' }}>— missing —</span>}</div>
                                            {row._warnings.map((w, wi) => <div key={wi} style={{ color: '#b45309', fontSize: '0.75rem', marginTop: 2 }}>⚠️ {w}</div>)}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                                            {editingIdx === idx ? (
                                                <select
                                                    value={row.category || row._autoCategory || ''}
                                                    onChange={e => { updateRow(idx, 'category', e.target.value); setEditingIdx(null) }}
                                                    style={{ border: '1.5px solid #3b82f6', borderRadius: 6, padding: '2px 6px', fontSize: '0.82rem' }}
                                                    autoFocus
                                                    onBlur={() => setEditingIdx(null)}
                                                >
                                                    {['garhwa', 'palamu', 'jharkhand', 'rashtriya', 'apradh', 'rajniti', 'khel', 'swasthya', 'shiksha', 'vyapar', 'technology', 'manoranjan', 'dharm'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            ) : (
                                                <span>
                                                    {row.category
                                                        ? <Badge color="green">{row.category}</Badge>
                                                        : row._autoCategory
                                                            ? <Badge color="blue">🤖 {row._autoCategory}</Badge>
                                                            : <Badge color="gray">—</Badge>
                                                    }
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', maxWidth: 200 }}>
                                            {(row.tags ? row.tags.split(/[,،;]/) : row._autoTags || []).map((t, ti) => (
                                                <Badge key={ti} color={row.tags ? 'gray' : 'blue'}>{t.trim()}</Badge>
                                            ))}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <Badge color={row.district ? 'green' : 'yellow'}>{row.district || 'jharkhand'}</Badge>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            {row.isBreaking === 'yes' ? <Badge color="red">🔥 Breaking</Badge> : <Badge color="gray">No</Badge>}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                                            {row._errors.length > 0 ? (
                                                <div>
                                                    {row._errors.map((e, ei) => (
                                                        <div key={ei} style={{ color: '#dc2626', fontSize: '0.78rem' }}>❌ {e}</div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>✅ Valid</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <button
                                                onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#3b82f6' }}
                                                title="Edit category"
                                            >✏️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {uploading && (
                <div style={{ background: 'white', borderRadius: 12, padding: '1rem 1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: '#1e293b' }}>⏳ Uploading... {uploadProgress}%</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{validRows.length} articles processing</span>
                    </div>
                    <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: 99, transition: 'width 0.4s' }} />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {rows.length > 0 && !uploading && !result && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => handleUpload(true)}
                        disabled={validRows.length === 0}
                        style={{ background: '#f0f9ff', border: '2px solid #38bdf8', color: '#0369a1', padding: '0.75rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: validRows.length === 0 ? 'not-allowed' : 'pointer', opacity: validRows.length === 0 ? 0.5 : 1 }}
                    >
                        🔍 Dry Run (Save kiye bina test)
                    </button>
                    <button
                        onClick={() => handleUpload(false)}
                        disabled={validRows.length === 0}
                        style={{ background: validRows.length === 0 ? '#94a3b8' : 'linear-gradient(135deg, #dc2626, #b91c1c)', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: validRows.length === 0 ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(220,38,38,0.3)' }}
                    >
                        🚀 Confirm & Publish ({validRows.length} articles)
                    </button>
                    <button
                        onClick={() => { setRows([]); setFileName(''); setResult(null) }}
                        style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#64748b', padding: '0.75rem 1.25rem', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}
                    >
                        🗑️ Reset
                    </button>
                </div>
            )}

            {/* Result Panel */}
            {result && (
                <div style={{ background: 'white', borderRadius: 14, border: `2px solid ${result.success > 0 ? '#bbf7d0' : '#fecaca'}`, padding: '1.5rem', marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: result.success > 0 ? '#15803d' : '#dc2626', marginBottom: '1rem' }}>
                        {result.isDryRun ? '🔍 Dry Run Result' : (result.success > 0 ? '🎉 Upload Complete!' : '❌ Upload Failed')}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 700, color: '#15803d' }}>
                            ✅ Success: {result.success}
                        </div>
                        <div style={{ background: result.failed > 0 ? '#fef2f2' : '#f0fdf4', border: '1px solid #fecaca', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 700, color: '#dc2626' }}>
                            ❌ Failed: {result.failed}
                        </div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 700, color: '#64748b' }}>
                            📋 Total: {result.total}
                        </div>
                        {result.batchId && (
                            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 600, color: '#7c3aed', fontSize: '0.8rem' }}>
                                🆔 Batch: {result.batchId}
                            </div>
                        )}
                    </div>
                    <p style={{ color: '#475569', marginBottom: '1rem' }}>{result.message}</p>

                    {/* Error Details */}
                    {(result.validationErrors?.length > 0 || result.uploadErrors?.length > 0) && (
                        <div style={{ border: '1.5px solid #fecaca', borderRadius: 10, padding: '1rem', background: '#fef2f2', marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: '0.75rem' }}>⚠️ Error Details ({result.failed} rows):</div>
                            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                {result.validationErrors?.map((e, i) => (
                                    <div key={i} style={{ fontSize: '0.82rem', color: '#7f1d1d', padding: '0.25rem 0', borderBottom: '1px solid #fecaca' }}>
                                        <strong>Row {e.row}</strong> "{e.title}": {e.errors.map(x => x.reason).join('; ')}
                                    </div>
                                ))}
                                {result.uploadErrors?.map((e, i) => (
                                    <div key={i} style={{ fontSize: '0.82rem', color: '#7f1d1d', padding: '0.25rem 0', borderBottom: '1px solid #fecaca' }}>
                                        <strong>Row {e.row}</strong> "{e.title}": {e.error}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => downloadErrorCSV(result.validationErrors, result.uploadErrors)}
                                style={{ marginTop: '0.75rem', background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                ⬇️ Failed Rows Download करें (Excel)
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => { setResult(null); setRows([]); setFileName('') }}
                            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 9, fontWeight: 700, cursor: 'pointer' }}
                        >
                            📦 Naya Upload
                        </button>
                        <a href="/admin/dashboard/posts" style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#15803d', padding: '0.6rem 1.25rem', borderRadius: 9, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                            📋 Sab Articles Dekho
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
