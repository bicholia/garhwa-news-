'use client'

import { useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import { Mail, Phone, MapPin, Send, ShieldCheck, MessageSquare } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })

    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                setSubmitted(true)
            } else {
                alert('सन्देश भेजने में समस्या हुई। कृपया बाद में प्रयास करें।')
            }
        } catch (e) {
            console.error('Contact form error:', e)
            alert('Network error. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PublicLayout>
            <div className="container py-10 lg:py-16">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            24/7 Bureau Support
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-news-text dark:text-white serif-font tracking-tight mb-4">
                            Get In <span className="text-brand-red">Touch</span>
                        </h1>
                        <p className="text-news-muted text-base lg:text-lg max-w-2xl mx-auto">
                            Reach out to Jharkhand's most trusted news network for reporting tips, business inquiries, or general feedback.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        
                        {/* LEFT: INFO CARDS */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-brand-navy p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-premium flex gap-5 group">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-red shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-news-text dark:text-white mb-1">Corporate Headquarters</h3>
                                    <p className="text-news-muted text-sm leading-relaxed">
                                        ThinkIndia.press Media Hub<br />
                                        Garhwa, Jharkhand<br />
                                        India - 822114
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-brand-navy p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-premium flex gap-5 group">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-red shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-news-text dark:text-white mb-1">Central Hotline</h3>
                                    <p className="text-news-text dark:text-white font-black text-xl tracking-tight mb-1">1800 696 874</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toll Free Support Available 24/7</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-brand-navy p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-premium flex gap-5 group">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-brand-red shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-news-text dark:text-white mb-1">Official Dispatch</h3>
                                    <p className="text-news-muted text-sm font-medium hover:text-brand-red transition-colors cursor-pointer">contact@thinkindia.press</p>
                                    <p className="text-news-muted text-sm font-medium hover:text-brand-red transition-colors cursor-pointer">editor@thinkindia.press</p>
                                </div>
                            </div>

                            <div className="bg-brand-red p-6 rounded-[24px] text-white shadow-premium relative overflow-hidden">
                                <ShieldCheck size={100} className="absolute -bottom-6 -right-6 opacity-10" />
                                <div className="relative z-10">
                                    <h4 className="text-lg font-black uppercase mb-2 serif-font">Confidentiality</h4>
                                    <p className="text-sm text-red-50/90 leading-relaxed">
                                        हम पत्रकारिता के उच्चतम मानकों का पालन करते हैं। आपके द्वारा दी गई कोई भी सूचना या दस्तावेज़ सुरक्षित रखा जाएगा।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: FORM */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-brand-navy p-8 lg:p-10 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-premium">
                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                                    <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red shrink-0">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-news-text dark:text-white serif-font tracking-tight">Secure Message Form</h2>
                                        <p className="text-news-muted text-sm">Transmit your message directly to our editorial board.</p>
                                    </div>
                                </div>

                                {submitted ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <ShieldCheck size={40} className="text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-black text-news-text dark:text-white mb-3 serif-font">Transmission Successful</h3>
                                        <p className="text-news-muted mb-8 max-w-sm mx-auto">Your communiqué has been logged into our secure grid. We will respond shortly.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-brand-red text-white px-8 py-3 rounded-full font-bold text-sm hover:-translate-y-1 hover:shadow-lg transition-all"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-news-text dark:text-white ml-2">Full Name <span className="text-brand-red">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-black/50 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-brand-red focus:bg-white dark:focus:bg-brand-navy outline-none transition-all text-sm font-medium text-news-text dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-news-text dark:text-white ml-2">Email Address <span className="text-brand-red">*</span></label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-black/50 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-brand-red focus:bg-white dark:focus:bg-brand-navy outline-none transition-all text-sm font-medium text-news-text dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-news-text dark:text-white ml-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+91 9876543210"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-black/50 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-brand-red focus:bg-white dark:focus:bg-brand-navy outline-none transition-all text-sm font-medium text-news-text dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-news-text dark:text-white ml-2">Subject <span className="text-brand-red">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Inquiry / News Tip"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-black/50 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-brand-red focus:bg-white dark:focus:bg-brand-navy outline-none transition-all text-sm font-medium text-news-text dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-news-text dark:text-white ml-2">Your Message <span className="text-brand-red">*</span></label>
                                            <textarea
                                                required
                                                rows={6}
                                                placeholder="Write your detailed message here..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-black/50 px-6 py-4 rounded-[24px] border border-gray-200 dark:border-white/10 focus:border-brand-red focus:bg-white dark:focus:bg-brand-navy outline-none transition-all text-sm font-medium text-news-text dark:text-white resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-brand-red text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-xl hover:shadow-brand-red/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Transmit Message <Send size={16} /></>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}

