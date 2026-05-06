'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Sparkles, CheckCircle, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { fetchMissingImageArticles, attachAIImage, deleteArticle } from './actions'

export default function ImageManager() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)

    const loadData = async () => {
        setLoading(true)
        const data = await fetchMissingImageArticles()
        setArticles(data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleAIUpdate = async (id: string, title: string) => {
        setProcessing(id)
        const res = await attachAIImage(id, title)
        if (res.success) {
            setArticles(prev => prev.filter(a => a._id !== id))
        } else {
            alert('फोटो अपडेट करने में समस्या आई: ' + res.error)
        }
        setProcessing(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('क्या आप वाकई इस न्यूज़ को डिलीट करना चाहते हैं?')) return
        setProcessing(id)
        const res = await deleteArticle(id)
        if (res.success) {
            setArticles(prev => prev.filter(a => a._id !== id))
        } else {
            alert('डिलीट करने में समस्या आई: ' + res.error)
        }
        setProcessing(null)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-red-600 mb-4" size={32} />
                <p className="text-gray-500 font-medium">खबरें लोड हो रही हैं...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <ImageIcon className="text-red-600" /> इमेज मैनेजर
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">इन खबरों में फोटो नहीं लगी है। इन्हें तुरंत फिक्स करें।</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadData}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="रिफ्रेश करें"
                    >
                        <RefreshCw size={20} className="text-gray-600" />
                    </button>
                    <div className="bg-red-50 text-red-600 px-6 py-2 rounded-2xl font-black border-2 border-red-100 shadow-sm">
                        पेंडिंग: {articles.length}
                    </div>
                </div>
            </div>

            {articles.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] border-2 border-dashed border-gray-200 text-center shadow-sm">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">सब चकाचक है!</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">ऐसी कोई खबर नहीं मिली जिसमें फोटो न हो। आप रिलैक्स कर सकते हैं।</p>
                    <button 
                        onClick={loadData} 
                        className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                    >
                        रिफ्रेश करें
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article._id} className="bg-white rounded-[1.5rem] border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                            <div className="h-48 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative group-hover:bg-gray-100 transition-colors">
                                <ImageIcon size={48} className="text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md">
                                    No Image
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                        {new Date(article.publishedAt).toLocaleDateString('hi-IN')}
                                    </span>
                                </div>
                                <h3 className="font-black text-gray-900 line-clamp-2 mb-3 text-lg leading-[1.2]">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={() => handleAIUpdate(article._id, article.title)}
                                        disabled={!!processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98]"
                                    >
                                        {processing === article._id ? (
                                            <>
                                                <RefreshCw className="animate-spin" size={18} />
                                                काम जारी है...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} /> 
                                                AI फोटो जेनरेट करें
                                            </>
                                        )}
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        <Link 
                                            href={`/news/${article.slug}`} 
                                            target="_blank"
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
                                        >
                                            <ExternalLink size={14} /> वेब पर देखें
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(article._id)}
                                            disabled={!!processing}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-colors border border-red-100 flex items-center justify-center disabled:opacity-50"
                                            title="डिलीट करें"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
