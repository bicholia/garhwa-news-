'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@sanity/client'
import { Image as ImageIcon, Search, Download, Trash2, RefreshCw, X } from 'lucide-react'
import Link from 'next/link'

const client = createClient({
    projectId: 'cjfr2ckk',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01'
})

export default function PhotoGallery() {
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedImage, setSelectedImage] = useState<any>(null)

    const fetchImages = async () => {
        setLoading(true)
        try {
            const data = await client.fetch(`*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
                _id,
                url,
                metadata {
                    dimensions
                },
                _createdAt
            }`)
            setImages(data)
        } catch (error) {
            console.error('Failed to fetch images:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchImages()
    }, [])

    const filteredImages = images.filter(img => 
        img.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <ImageIcon className="text-red-600" size={32} /> फोटो गैलरी
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">वेबसाइट पर अपलोड की गई सभी तस्वीरें यहाँ सुरक्षित हैं।</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="सर्च करें..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchImages}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                        title="रिफ्रेश करें"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-900">कोई फोटो नहीं मिली</h3>
                    <p className="text-gray-500 mt-1">शायद अभी तक कोई फोटो अपलोड नहीं हुई है।</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                    {filteredImages.map((img) => (
                        <div 
                            key={img._id} 
                            className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img 
                                src={img.url} 
                                alt="" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="p-2 bg-white rounded-lg text-gray-900 hover:bg-red-500 hover:text-white transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={40} />
                    </button>
                    <div className="max-w-5xl w-full flex flex-col items-center">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white/5">
                            <img 
                                src={selectedImage.url} 
                                alt="" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="mt-8 flex gap-4 w-full justify-center">
                            <a 
                                href={selectedImage.url} 
                                download 
                                className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                            >
                                <Download size={20} /> ओरिजिनल डाउनलोड करें
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
