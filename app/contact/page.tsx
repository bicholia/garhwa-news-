'use client'

import { useState } from 'react'
import PublicLayout from '@/components/PublicLayout'
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, Globe } from 'lucide-react'

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
            <div className="min-h-screen bg-news-paper selection:bg-brand-gold/30 selection:text-brand-navy">
                
                {/* HERO HEADER */}
                <div className="bg-brand-navy pt-24 pb-32 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <Globe size={600} className="absolute -top-20 -right-20 text-white" />
                    </div>
                    <div className="container relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-gold text-white text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full mb-8 italic shadow-xl">
                            <ShieldCheck size={14} /> Official News Bureau
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white font-serif mb-6 tracking-tighter leading-tight">
                            Connect with <br/> <span className="text-brand-gold italic text-3xl lg:text-5xl uppercase tracking-widest font-black text-shadow-glow">ThinkIndia.press</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-400 text-lg lg:text-xl font-medium leading-relaxed">
                            Report a story, inquire about strategic partnerships, or provide intelligence directly to our editorial bureau.
                        </p>
                    </div>
                </div>

                <div className="container -mt-16 relative z-20 pb-24">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* LEFT: BUREAU INTELLIGENCE */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 flex flex-col gap-10">
                                <section>
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-gold mb-8 flex items-center gap-2">
                                        <div className="w-8 h-[1px] bg-brand-gold/30" /> Bureau Information
                                    </h2>
                                    
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold shadow-lg group-hover:scale-110 transition-transform">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-2">Bureau Headquarters</h3>
                                                <p className="text-gray-500 font-medium leading-relaxed">
                                                    Main Road, Garhwa<br />
                                                    Jharkhand - 822114
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold shadow-lg group-hover:scale-110 transition-transform">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-2">Email Dispatch</h3>
                                                <p className="text-gray-500 font-medium">
                                                    editor@thinkindia.press<br />
                                                    contact@thinkindia.press
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold shadow-lg group-hover:scale-110 transition-transform">
                                                <Phone size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-2">Bureau Hotline</h3>
                                                <p className="text-gray-500 font-medium">
                                                    +91 94701 47551<br />
                                                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">WhatsApp Enabled</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contact blocks (Scrubbed for Brand Neutrality) */}
                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold shadow-lg group-hover:scale-110 transition-transform">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-2">Independent Reporting</h3>
                                                <p className="text-gray-500 font-medium leading-relaxed italic">
                                                    Our bureau operates with 100% autonomy, ensuring unbiased journalistic precision.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold shadow-lg group-hover:scale-110 transition-transform">
                                                <Clock size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-brand-navy font-black text-xs uppercase tracking-widest mb-2">Bureau Hours</h3>
                                                <p className="text-gray-500 font-medium">
                                                    Mon — Sat: 10:00 — 18:00 IST<br />
                                                    <span className="text-[10px] text-brand-gold italic">Sunday: 24/7 Priority Monitoring</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="p-6 bg-brand-navy/5 rounded-2xl border border-brand-navy/5">
                                    <p className="text-[11px] text-gray-500 font-bold leading-relaxed italic">
                                        "ThinkIndia.press operates as an independent regional media entity. Our bureau is committed to the highest standards of journalistic precision and ethical verification."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SECURE SUBMISSION FORM */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-[40px] p-8 lg:p-14 shadow-2xl border border-gray-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-brand-navy font-serif mb-2">Secure Communiqué</h2>
                                    <p className="text-gray-500 font-medium mb-12">Submit your report or inquiry via our encrypted bureau channel.</p>

                                    {submitted ? (
                                        <div className="bg-brand-navy text-white rounded-3xl p-12 text-center shadow-2xl animate-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                                <ShieldCheck size={40} className="text-brand-navy" strokeWidth={3} />
                                            </div>
                                            <h3 className="text-3xl font-black font-serif mb-4 uppercase tracking-tighter">Transmission Successful</h3>
                                            <p className="text-gray-400 font-medium text-lg mb-10">Your communiqué has been received by the regional editorial board. We will contact you if further verification is required.</p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="bg-brand-gold text-brand-navy px-12 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-colors"
                                            >
                                                Send New Intel
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-4">Full Identity</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Agent Name / Source Name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-news-paper px-6 py-4 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-medium text-brand-navy shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-4">Secure Email Address</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="email@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-news-paper px-6 py-4 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-medium text-brand-navy shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-4">Direct Contact Line</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="+91 (0) 0000-0000"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-news-paper px-6 py-4 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-medium text-brand-navy shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-4">Department of Inquiry</label>
                                                    <select
                                                        required
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full bg-news-paper px-6 py-4 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-medium text-brand-navy shadow-inner appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Bureau Branch</option>
                                                        <option value="news">News Tip / Story Lead</option>
                                                        <option value="ad">Strategic Partnerships</option>
                                                        <option value="feedback">Bureau Feedback</option>
                                                        <option value="other">Other Intelligence</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-4">Communiqué Details</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    placeholder="Provide detailed information for our editorial board..."
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full bg-news-paper px-6 py-4 rounded-[2rem] border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-medium text-brand-navy shadow-inner resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-brand-navy text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-brand-gold transition-all shadow-xl hover:shadow-brand-gold/20 flex items-center justify-center gap-3 active:scale-[0.98]"
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

            </div>
        </PublicLayout>
    )
}
