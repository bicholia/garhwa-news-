'use client'

import { useRef, useState, useCallback } from 'react'
import { Link as LinkIcon, Quote, Image as ImageIcon } from 'lucide-react'
import { compressImage } from '@/lib/imageUtils'

interface RichEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const FONT_FAMILIES = [
    { label: 'Noto Devanagari', value: "'Noto Sans Devanagari', sans-serif" },
    { label: 'Inter', value: "'Inter', sans-serif" },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Monospace', value: 'monospace' },
]

export default function RichEditor({ value, onChange, placeholder = 'यहाँ लिखें...' }: RichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState('')
    const [fontSize, setFontSize] = useState('16px')
    const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]?.value || '')
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value)
        editorRef.current?.focus()
        updateActiveFormats()
    }

    const updateActiveFormats = () => {
        const fmts = new Set<string>()
        if (document.queryCommandState('bold')) fmts.add('bold')
        if (document.queryCommandState('italic')) fmts.add('italic')
        if (document.queryCommandState('underline')) fmts.add('underline')
        if (document.queryCommandState('strikeThrough')) fmts.add('strikeThrough')
        setActiveFormats(fmts)
    }

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
        updateActiveFormats()
    }

    const insertImage = async (file: File) => {
        setUploading(true)
        setUploadMsg('तस्वीर अपलोड हो रही है...')

        try {
            // Compress image before upload
            const compressedFile = await compressImage(file)

            const formData = new FormData()
            formData.append('file', compressedFile)
            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                if (res.status === 413) throw new Error('तस्वीर बहुत बड़ी है (Max 4MB)')
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

            if (data.url) {
                editorRef.current?.focus()
                document.execCommand('insertHTML', false,
                    `<figure style="margin:1.5rem 0;text-align:center">
            <img src="${data.url}" alt="News Image" style="max-width:100%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
          </figure><p><br/></p>`
                )
                handleInput()
                setUploadMsg('तस्वीर जुड़ गई!')
            } else {
                setUploadMsg('अपलोड फेल: कोई URL नहीं मिला')
            }
        } catch (err: any) {
            setUploadMsg(`अपलोड फेल: ${err.message || 'Error'}`)
        } finally {
            setUploading(false)
            setTimeout(() => setUploadMsg(''), 4000)
        }
    }

    const applyFontSize = (size: string) => {
        setFontSize(size)
        editorRef.current?.focus()
        // Use span wrapper for font-size
        document.execCommand('fontSize', false, '7') // set to max first
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]')
        fontElements?.forEach(el => {
            const span = document.createElement('span')
            span.style.fontSize = size
            el.parentNode?.insertBefore(span, el)
            while (el.firstChild) span.appendChild(el.firstChild)
            el.parentNode?.removeChild(el)
        })
        handleInput()
    }

    const applyFontFamily = (family: string) => {
        setFontFamily(family)
        exec('fontName', family)
    }

    const insertHeading = (tag: string) => {
        editorRef.current?.focus()
        document.execCommand('formatBlock', false, tag)
        handleInput()
    }

    const insertLink = () => {
        const url = prompt('लिंक डालें (URL):')
        if (url) exec('createLink', url)
    }

    const insertQuote = () => {
        editorRef.current?.focus()
        document.execCommand('formatBlock', false, 'blockquote')
        handleInput()
    }

    const btnStyle = (active = false): React.CSSProperties => ({
        padding: '5px 10px',
        border: `1.5px solid ${active ? '#dc2626' : '#e2e8f0'}`,
        borderRadius: '6px',
        background: active ? '#fef2f2' : 'white',
        color: active ? '#dc2626' : '#374151',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: active ? 700 : 500,
        transition: 'all 0.15s',
        minWidth: '32px',
        textAlign: 'center' as const,
    })

    const dividerStyle: React.CSSProperties = {
        width: '1px',
        height: '24px',
        background: '#e2e8f0',
        margin: '0 4px',
        flexShrink: 0
    }

    return (
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', background: 'white' }}>
            {/* ===== TOOLBAR ===== */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                padding: '8px 12px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                alignItems: 'center'
            }}>

                {/* Headings */}
                <button type="button" style={btnStyle()} onClick={() => insertHeading('h1')} title="Heading 1">H1</button>
                <button type="button" style={btnStyle()} onClick={() => insertHeading('h2')} title="Heading 2">H2</button>
                <button type="button" style={btnStyle()} onClick={() => insertHeading('h3')} title="Heading 3">H3</button>
                <button type="button" style={btnStyle()} onClick={() => insertHeading('p')} title="Normal">¶</button>

                <div style={dividerStyle} />

                {/* Text Format */}
                <button type="button" style={btnStyle(activeFormats.has('bold'))} onClick={() => exec('bold')} title="Bold"><b>B</b></button>
                <button type="button" style={btnStyle(activeFormats.has('italic'))} onClick={() => exec('italic')} title="Italic"><i>I</i></button>
                <button type="button" style={btnStyle(activeFormats.has('underline'))} onClick={() => exec('underline')} title="Underline"><u>U</u></button>
                <button type="button" style={btnStyle(activeFormats.has('strikeThrough'))} onClick={() => exec('strikeThrough')} title="Strikethrough"><s>S</s></button>

                <div style={dividerStyle} />

                {/* Font Size */}
                <select
                    value={fontSize}
                    onChange={e => applyFontSize(e.target.value)}
                    title="Font Size"
                    style={{
                        padding: '4px 6px', border: '1.5px solid #e2e8f0',
                        borderRadius: '6px', fontSize: '0.82rem',
                        background: 'white', cursor: 'pointer', outline: 'none'
                    }}
                >
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* Font Family */}
                <select
                    value={fontFamily}
                    onChange={e => applyFontFamily(e.target.value)}
                    title="Font"
                    style={{
                        padding: '4px 6px', border: '1.5px solid #e2e8f0',
                        borderRadius: '6px', fontSize: '0.82rem',
                        background: 'white', cursor: 'pointer', outline: 'none',
                        maxWidth: '130px'
                    }}
                >
                    {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                <div style={dividerStyle} />

                {/* Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>रंग:</span>
                    <input
                        type="color"
                        defaultValue="#000000"
                        title="Text Color"
                        onChange={e => exec('foreColor', e.target.value)}
                        style={{ width: '28px', height: '28px', padding: '1px', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                        type="color"
                        defaultValue="#ffff00"
                        title="Highlight Color"
                        onChange={e => exec('hiliteColor', e.target.value)}
                        style={{ width: '28px', height: '28px', padding: '1px', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
                    />
                </div>

                <div style={dividerStyle} />

                {/* Text Align */}
                <button type="button" style={btnStyle()} onClick={() => exec('justifyLeft')} title="Left">⇐</button>
                <button type="button" style={btnStyle()} onClick={() => exec('justifyCenter')} title="Center">≡</button>
                <button type="button" style={btnStyle()} onClick={() => exec('justifyRight')} title="Right">⇒</button>

                <div style={dividerStyle} />

                {/* Lists */}
                <button type="button" style={btnStyle()} onClick={() => exec('insertUnorderedList')} title="Bullet List">• List</button>
                <button type="button" style={btnStyle()} onClick={() => exec('insertOrderedList')} title="Numbered List">1. List</button>

                <div style={dividerStyle} />

                {/* Link & Quote */}
                <button type="button" style={btnStyle()} onClick={insertLink} title="Insert Link"><LinkIcon size={14} /></button>
                <button type="button" style={btnStyle()} onClick={insertQuote} title="Blockquote"><Quote size={14} /></button>
                <button type="button" style={btnStyle()} onClick={() => exec('removeFormat')} title="Clear Format">✕Fmt</button>

                <div style={dividerStyle} />

                {/* Image Upload */}
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        ...btnStyle(),
                        background: uploading ? '#f1f5f9' : '#eff6ff',
                        color: '#2563eb', border: '1.5px solid #bfdbfe',
                        fontWeight: 700, padding: '5px 12px'
                    }}
                    title="Image Upload"
                >
                    {uploading ? 'Upload...' : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ImageIcon size={14} /> Image</span>}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) insertImage(file)
                        e.target.value = ''
                    }}
                />

                {/* Undo/Redo */}
                <div style={dividerStyle} />
                <button type="button" style={btnStyle()} onClick={() => exec('undo')} title="Undo">Undo</button>
                <button type="button" style={btnStyle()} onClick={() => exec('redo')} title="Redo">Redo</button>
            </div>

            {uploadMsg && (
                <div style={{
                    padding: '8px 16px',
                    background: uploadMsg.includes('जुड़') ? '#f0fdf4' : uploadMsg.includes('फेल') || uploadMsg.includes('बड़ी') ? '#fef2f2' : '#eff6ff',
                    color: uploadMsg.includes('जुड़') ? '#15803d' : uploadMsg.includes('फेल') || uploadMsg.includes('बड़ी') ? '#dc2626' : '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    {uploadMsg}
                </div>
            )}

            {/* ===== EDITOR AREA ===== */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyUp={updateActiveFormats}
                onMouseUp={updateActiveFormats}
                dangerouslySetInnerHTML={value ? { __html: value } : undefined}
                data-placeholder={placeholder}
                className="p-4 lg:p-8"
                style={{
                    minHeight: '400px', 
                    outline: 'none',
                    fontSize: '18px', 
                    lineHeight: 1.85,
                    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
                    color: '#1e293b',
                    overflowY: 'auto' as const,
                }}
            />

            {/* Word Count & Status */}
            <div style={{
                padding: '10px 20px',
                background: '#f1f5f9',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#475569',
                fontWeight: 600
            }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <span style={{ color: '#dc2626' }}>
                        {editorRef.current?.innerText?.trim().split(/\s+/).filter(Boolean).length || 0} / 8000+ शब्द
                    </span>
                    <span style={{ color: '#2563eb' }}>
                        {editorRef.current?.innerText?.length || 0} / 50,000+ अक्षर
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                    <span>Pro Editor Active: Unlimited Capacity</span>
                </div>
            </div>
        </div>
    )
}
