'use client'

import { useRef, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { compressImage } from '@/lib/imageUtils'
import 'react-quill-new/dist/quill.snow.css' // We use react-quill-new for React 19 compatibility

// ReactQuill must be loaded dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface RichEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder = 'यहाँ लिखें...' }: RichEditorProps) {
    const quillRef = useRef<any>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState('')

    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return

            setUploading(true)
            setUploadMsg('तस्वीर अपलोड हो रही है...')

            try {
                const compressedFile = await compressImage(file)
                const formData = new FormData()
                formData.append('file', compressedFile)

                const res = await fetch('/api/admin/media/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!res.ok) throw new Error('Upload failed')

                const data = await res.json()

                if (data.url) {
                    const quill = quillRef.current?.getEditor()
                    if (quill) {
                        const range = quill.getSelection()
                        const cursorPosition = range ? range.index : quill.getLength()
                        quill.insertEmbed(cursorPosition, 'image', data.url)
                        quill.setSelection(cursorPosition + 1)
                    }
                    setUploadMsg('तस्वीर जुड़ गई!')
                } else {
                    throw new Error('No URL returned')
                }
            } catch (err: any) {
                setUploadMsg(`अपलोड फेल: ${err.message}`)
            } finally {
                setUploading(false)
                setTimeout(() => setUploadMsg(''), 4000)
            }
        }
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [])

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ]

    return (
        <div style={{ background: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
            {uploadMsg && (
                <div style={{
                    padding: '8px 16px',
                    background: uploadMsg.includes('जुड़') ? '#f0fdf4' : '#eff6ff',
                    color: uploadMsg.includes('जुड़') ? '#15803d' : '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    {uploadMsg}
                </div>
            )}
            
            {/* Wrapper to inject global styles for quill to make it mobile friendly */}
            <style jsx global>{`
                .ql-container {
                    font-size: 18px !important;
                    font-family: 'Noto Sans Devanagari', 'Inter', sans-serif !important;
                    min-height: 350px;
                }
                .ql-editor {
                    min-height: 350px;
                }
                .ql-toolbar {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0 !important;
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                }
                /* Mobile specific tweaks */
                @media (max-width: 640px) {
                    .ql-toolbar {
                        position: sticky;
                        top: 0;
                        z-index: 10;
                    }
                    .ql-editor {
                        padding: 12px;
                    }
                }
            `}</style>
            
            
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
            
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                    <span>Pro Editor Active (Mobile Optimized)</span>
                </div>
            </div>
        </div>
    )
}
