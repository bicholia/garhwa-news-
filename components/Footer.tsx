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
                    <Link href="/" className="shrink-0 flex items-center">
                        <span className="text-3xl font-black tracking-tighter flex items-center gap-1">
                            <span className="text-black">THINK</span>
                            <span className="text-brand-red">INDIA</span>
                        </span>
                    </Link>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                            <FaTwitter />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-brand-red hover:border-brand-red transition-all shadow-sm">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 mb-12">
                    <div className="col-span-2">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-brand-red mb-6">About Think India</h3>
                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                            Think India is your premium source for regional and national news. We focus on in-depth reporting from Garhwa, Palamu, and Jharkhand, combined with global standard journalism principles.
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
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-brand-red mb-6">Contact Bureau</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-[13px] text-gray-600">
                                <MapPin size={16} className="text-gray-400 shrink-0" />
                                <span>Main Road, Garhwa, Jharkhand — 822114</span>
                            </div>
                            <div className="flex gap-3 text-[13px] text-gray-600">
                                <Mail size={16} className="text-gray-400 shrink-0" />
                                <span>newsroom@thinkindia.press</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded text-[10px] font-bold uppercase tracking-wider">
                                <ShieldCheck size={12} /> Verified Agency
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Footer */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>© 2026 THINK INDIA NEWS · ALL RIGHTS RESERVED</span>
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
