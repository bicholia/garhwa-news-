'use client'

import { useState, useEffect, useRef } from 'react'
import { ImageIcon, RefreshCw, Upload, Link as LinkIcon, X } from 'lucide-react'
import { fetchAllArticles, uploadImageAction } from './actions'

export default function ImageManager() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)
    const [duplicateMap, setDuplicateMap] = useState<Record<string, number>>({})

    // Modal state
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
    const [uploadType, setUploadType] = useState<'file'|'url'>('file')
    const [imageUrlInput, setImageUrlInput] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadData = async () => {
        setLoading(true)
        const data = await fetchAllArticles()
        setArticles(data)
        
        // Compute duplicates
        const counts: Record<string, number> = {}
        data.forEach((article: any) => {
            const imgId = article.featureImage?.asset?._id || article.image_url
            if (imgId) {
                counts[imgId] = (counts[imgId] || 0) + 1
            }
        })
        setDuplicateMap(counts)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleUploadSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!selectedArticleId) return
        
        const formData = new FormData()
        
        if (uploadType === 'file') {
            const file = fileInputRef.current?.files?.[0]
            if (!file) return alert('Please select a file')
            formData.append('file', file)
        } else {
            if (!imageUrlInput.trim()) return alert('Please enter an image URL')
            formData.append('url', imageUrlInput.trim())
        }

        setProcessing(selectedArticleId)
        setSelectedArticleId(null)
        
        const res = await uploadImageAction(selectedArticleId, formData)
        if (res.success) {
            await loadData()
        } else {
            alert('Error updating image: ' + res.error)
        }
        setProcessing(null)
        setImageUrlInput('')
    }

    // Modal Component inline
    const renderModal = () => {
        if (!selectedArticleId) return null;
        const article = articles.find(a => a._id === selectedArticleId)
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                    <button onClick={() => setSelectedArticleId(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold mb-2">Update Image</h2>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-1">{article?.title}</p>
                    
                    <div className="flex gap-2 mb-6">
                        <button 
                            onClick={() => setUploadType('file')}
                            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${uploadType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Upload size={18} /> File
                        </button>
                        <button 
                            onClick={() => setUploadType('url')}
                            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${uploadType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <LinkIcon size={18} /> URL
                        </button>
                    </div>

                    <form onSubmit={handleUploadSubmit}>
                        {uploadType === 'file' ? (
                            <div className="mb-6">
                                <input type="file" ref={fileInputRef} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                            </div>
                        ) : (
                            <div className="mb-6">
                                <input type="url" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="Paste image URL here..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                        )}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                            Update Image
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-red-600 mb-4" size={32} />
                <p className="text-gray-500 font-medium">Loading News...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="text-red-600" /> Image Manager
                </h1>
                <button onClick={loadData} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800">
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-black tracking-wider">
                            <th className="p-4 w-16 text-center">S.No</th>
                            <th className="p-4 w-1/3">News</th>
                            <th className="p-4 text-center w-1/5">Blank Image</th>
                            <th className="p-4 text-center w-1/5">Duplicate Images</th>
                            <th className="p-4 text-center w-1/5">Original Image</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article, index) => {
                            const imgId = article.featureImage?.asset?._id || article.image_url
                            const imgUrl = article.featureImage?.asset?.url || article.image_url
                            const isMissing = !imgId
                            const isDuplicate = imgId && duplicateMap[imgId] > 1
                            const isOriginal = imgId && duplicateMap[imgId] === 1

                            return (
                                <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug">{article.title}</p>
                                        <span className="text-[10px] text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    </td>
                                    
                                    {/* Blank Image Column */}
                                    <td className="p-4 text-center align-middle">
                                        {isMissing && (
                                            <button 
                                                onClick={() => setSelectedArticleId(article._id)}
                                                disabled={processing === article._id}
                                                className="w-24 h-16 mx-auto border-2 border-dashed border-red-300 rounded-lg flex flex-col items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors group"
                                            >
                                                {processing === article._id ? <RefreshCw className="animate-spin" size={20} /> : <Upload size={20} className="group-hover:scale-110 transition-transform" />}
                                                <span className="text-[10px] font-bold mt-1">Upload</span>
                                            </button>
                                        )}
                                    </td>

                                    {/* Duplicate Images Column */}
                                    <td className="p-4 text-center align-middle bg-orange-50/30">
                                        {isDuplicate && (
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-orange-200 mb-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={imgUrl} alt="Duplicate" className="object-cover w-full h-full" />
                                                    <div className="absolute inset-0 bg-orange-600/10" />
                                                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black px-1.5 rounded-bl-lg">x{duplicateMap[imgId]}</span>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedArticleId(article._id)}
                                                    disabled={processing === article._id}
                                                    className="text-[11px] font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                                >
                                                    {processing === article._id ? <RefreshCw className="animate-spin" size={12} /> : "Change"}
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* Original Image Column */}
                                    <td className="p-4 text-center align-middle bg-green-50/30">
                                        {isOriginal && (
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-green-200 mb-2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={imgUrl} alt="Original" className="object-cover w-full h-full" />
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedArticleId(article._id)}
                                                    disabled={processing === article._id}
                                                    className="text-[11px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                                >
                                                    {processing === article._id ? <RefreshCw className="animate-spin" size={12} /> : "Edit"}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
            {renderModal()}
        </div>
    )
}
