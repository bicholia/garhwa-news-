'use client'

import { useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, Globe, MessageSquare, Headphones } from 'lucide-react'

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
            <div className="min-h-screen bg-white dark:bg-black">
                
                {/* PREMIUM HERO HEADER */}
                <div className="relative h-[50vh] lg:h-[60vh] flex items-center justify-center overflow-hidden">
                    <img 
                        src="/about_hero_bg_1778925406510.png" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" 
                        alt="Contact Think India"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/90 to-white dark:to-black" />
                    
                    <div className="container relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.4em] mb-8 animate-fade-in">
                            <Headphones size={14} /> Global Bureau Support
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tighter serif-font mb-6 drop-shadow-2xl">
                            Get In <span className="text-brand-gold">Touch</span>
                        </h1>
                        <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto font-medium">
                            Reach out to Jharkhand's most trusted news network for reporting tips, business inquiries, or general feedback.
                        </p>
                    </div>
                </div>

                <div className="container -mt-32 relative z-20 pb-32">
                    <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* LEFT: BUREAU CONTACT CARDS */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Card 1: Address */}
                                <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group">
                                    <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="text-black dark:text-white font-black text-xs uppercase tracking-widest mb-4">Bureau Headquarters</h3>
                                    <p className="text-gray-500 font-bold text-lg leading-relaxed">
                                        New Delhi, Rajpath Marg<br />
                                        India
                                    </p>
                                </div>

                                {/* Card 2: Contact */}
                                <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group">
                                    <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    <h3 className="text-black dark:text-white font-black text-xs uppercase tracking-widest mb-4">Bureau Hotline</h3>
                                    <p className="text-brand-navy dark:text-brand-gold font-black text-3xl tracking-tight mb-2">
                                        1800 696 874
                                    </p>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toll Free Support Available 24/7</span>
                                </div>

                                {/* Card 3: Email */}
                                <div className="bg-white dark:bg-white/5 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group">
                                    <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <h3 className="text-black dark:text-white font-black text-xs uppercase tracking-widest mb-4">Official Dispatch</h3>
                                    <p className="text-gray-500 font-bold text-lg">
                                        contact@thinkindia.press<br />
                                        editor@thinkindia.press
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-brand-red rounded-[32px] text-white overflow-hidden relative">
                                <ShieldCheck size={120} className="absolute -bottom-10 -right-10 opacity-20" />
                                <h4 className="text-xl font-black uppercase mb-4 serif-font">Bureau Standards</h4>
                                <p className="text-sm text-red-100 leading-relaxed font-medium">
                                    हम पत्रकारिता के उच्चतम मानकों का पालन करते हैं। आपकी हर सूचना पूरी तरह से गुप्त रखी जाएगी।
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: SECURE FORM */}
                        <div className="lg:col-span-7">
                            <div className="bg-white dark:bg-[#121212] rounded-[48px] p-8 lg:p-16 shadow-2xl border border-gray-50 dark:border-white/5">
                                <div className="flex items-center gap-4 mb-10">
                                    <MessageSquare className="text-brand-red" size={32} />
                                    <div>
                                        <h2 className="text-3xl font-black text-black dark:text-white serif-font tracking-tighter uppercase">Secure Message</h2>
                                        <p className="text-gray-500 font-medium">Transmitting directly to the editorial board</p>
                                    </div>
                                </div>

                                {submitted ? (
                                    <div className="text-center py-20 animate-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <ShieldCheck size={48} className="text-green-500" />
                                        </div>
                                        <h3 className="text-4xl font-black text-black dark:text-white mb-4 serif-font">Transmission Successful</h3>
                                        <p className="text-gray-500 text-lg mb-12">Your communiqué has been logged into our secure grid.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-brand-navy dark:bg-brand-red text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:scale-105 transition-transform"
                                        >
                                            New Transmission
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Identity</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Your Name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-white/5 px-8 py-5 rounded-3xl border border-transparent focus:border-brand-red focus:bg-white dark:focus:bg-black outline-none transition-all font-bold text-black dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Secure Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="email@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-white/5 px-8 py-5 rounded-3xl border border-transparent focus:border-brand-red focus:bg-white dark:focus:bg-black outline-none transition-all font-bold text-black dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Your Communiqué</label>
                                            <textarea
                                                required
                                                rows={6}
                                                placeholder="Write your message here..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 px-8 py-5 rounded-[40px] border border-transparent focus:border-brand-red focus:bg-white dark:focus:bg-black outline-none transition-all font-bold text-black dark:text-white resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-brand-navy dark:bg-brand-red text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-xs hover:shadow-2xl hover:shadow-brand-red/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Transmit Data <Send size={16} /></>
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
