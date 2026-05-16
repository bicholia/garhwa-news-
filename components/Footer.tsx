'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Globe, ShieldCheck, ArrowRight, Phone, PlayCircle } from 'lucide-react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

const navLinks = {
    news: [
        { label: 'India News', href: '/india' },
        { label: 'Garhwa News', href: '/garhwa' },
        { label: 'Palamu News', href: '/palamu' },
        { label: 'World News', href: '/jharkhand' },
        { label: 'Opinion', href: '/category/crime' },
    ],
    other: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Disclaimer', href: '/corrections' },
        { label: 'RSS', href: '/feed.xml' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-[#F8F8F8] border-t border-gray-200 mt-12 pt-12 pb-8">
            <div className="container">
                {/* Branding & Social */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 pb-8 border-b border-gray-200">
                    <Link href="/" className="shrink-0 flex items-center group">
                        <span className="text-3xl font-black tracking-tighter flex items-center gap-2">
                            <span className="text-black group-hover:text-brand-red transition-colors">THINKINDIA</span>
                            <span className="text-brand-red group-hover:text-black transition-colors">NEWS</span>
                        </span>
                    </Link>
                    <div className="flex flex-col gap-4">
                        {/* Instagram CTA */}
                        <a 
                            href="https://www.instagram.com/think.indianews/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-white font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                        >
                            <FaInstagram size={20} />
                            <span>Follow on Instagram</span>
                        </a>
                        {/* Other Social Icons */}
                        <div className="flex gap-3">
                            <a href="https://www.facebook.com/think.indianews" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                                <FaFacebookF />
                            </a>
                            <a href="https://twitter.com/thinkindianews" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                                <FaTwitter />
                            </a>
                            <a href="https://www.youtube.com/@thinkindianews" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 mb-12">
                    <div className="col-span-2">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-brand-red mb-6">About ThinkIndia News</h3>
                        <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                            ThinkIndia News is your premium source for regional and national reporting. We focus on in-depth journalism from Garhwa, Palamu, and across Jharkhand, combined with modern digital news standards.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-brand-red mb-6">News Sections</h3>
                        <ul className="space-y-3">
                            {navLinks.news.map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-[13px] font-bold text-gray-700 hover:text-brand-red">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-brand-red mb-6">Resources</h3>
                        <ul className="space-y-3">
                            {navLinks.other.map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-[13px] font-bold text-gray-700 hover:text-brand-red">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-brand-red mb-6">ThinkIndia News</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-[14px] text-gray-600 font-medium">
                                <MapPin size={18} className="text-brand-red/40 shrink-0" />
                                <span>New Delhi, Rajpath Marg</span>
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded text-[10px] font-bold uppercase tracking-wider">
                                <ShieldCheck size={12} className="text-brand-red" /> Verified Publisher
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>© 2026 THINKINDIA NEWS · ALL RIGHTS RESERVED</span>
                    <div className="flex flex-wrap justify-center md:justify-end gap-6">
                        <Link href="/privacy-policy" className="hover:text-black">Privacy</Link>
                        <Link href="/terms" className="hover:text-black">Terms</Link>
                        <Link href="/contact" className="hover:text-black">Feedback</Link>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('show-install-prompt'))}
                            className="bg-ndtv-black text-white px-3 py-1 rounded text-[10px] hover:bg-brand-red transition-all"
                        >
                            Download App
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
