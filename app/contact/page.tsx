'use client'

import { useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import '@/app/global.css'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })

    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        setSubmitted(false) // For demo
        setSubmitted(true)
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-6xl">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 border-b-4 border-red-600 inline-block pb-2">
                            संपर्क करें
                        </h1>
                        <p className="text-xl text-gray-600 mt-4">
                            हमसे जुड़ें, अपनी खबर भेजें या सुझाव दें
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-red-600 mb-6">
                                हमसे संपर्क करें
                            </h2>

                            <div className="space-y-6">

                                {/* Address */}
                                <div className="flex items-start space-x-4">
                                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', color: '#dc2626' }}>
                                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">पता</h3>
                                        <p className="text-gray-600">
                                            मुख्य कार्यालय: वार्ड नंबर 8, पुलिस लाइन के पास,<br />
                                            गढ़वा - 822114, झारखंड
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start space-x-4">
                                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', color: '#dc2626' }}>
                                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">फोन / WhatsApp</h3>
                                        <p className="text-gray-600">
                                            <a href="tel:+918789320315" className="hover:text-red-600 transition">+91 87893 20315</a>
                                            <br />
                                            <a href="https://wa.me/918789320315" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">WhatsApp पर संपर्क करें</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', color: '#dc2626' }}>
                                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">ईमेल</h3>
                                        <p className="text-gray-600">
                                            <a href="mailto:news@garhwa-news.vercel.app" className="hover:text-red-600 transition">news@garhwa-news.vercel.app</a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="mt-8 bg-gray-50 p-4 rounded-xl">
                                <h3 className="font-bold text-lg mb-2">कार्यालय समय</h3>
                                <p className="text-gray-600">
                                    सोमवार - शनिवार: सुबह 10:00 बजे – शाम 6:00 बजे<br />
                                    रविवार: केवल ऑनलाइन संपर्क
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-red-600 mb-6">
                                हमें संदेश भेजें
                            </h2>

                            {submitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                    <h3 className="text-xl font-bold text-green-800 mb-2">
                                        धन्यवाद!
                                    </h3>
                                    <p className="text-green-700">
                                        आपका संदेश सफलतापूर्वक प्राप्त हुआ। हम जल्द ही संपर्क करेंगे।
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        नया संदेश भेजें
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        required
                                        placeholder="आपका पूरा नाम"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                                    />

                                    <input
                                        type="email"
                                        required
                                        placeholder="ईमेल पता"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                                    />

                                    <input
                                        type="tel"
                                        placeholder="फोन नंबर"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                                    />

                                    <select
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', background: 'white' }}
                                    >
                                        <option value="">विषय चुनें</option>
                                        <option value="news">खबर भेजनी है</option>
                                        <option value="ad">विज्ञापन</option>
                                        <option value="feedback">सुझाव / शिकायत</option>
                                        <option value="other">अन्य</option>
                                    </select>

                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="अपना संदेश लिखें"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', resize: 'none' }}
                                    />

                                    <button
                                        type="submit"
                                        style={{ width: '100%', background: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                                        className="hover:bg-red-700 transition"
                                    >
                                        संदेश भेजें
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    )
}
