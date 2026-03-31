import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Globe, ShieldCheck, ArrowRight, Phone } from 'lucide-react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

const navLinks = {
    coverage: [
        { label: 'Garhwa Reports', href: '/garhwa' },
        { label: 'Palamu Reports', href: '/palamu' },
        { label: 'Jharkhand Hub', href: '/jharkhand' },
        { label: 'Crime Analysis', href: '/category/crime' },
        { label: 'Administration', href: '/category/administration' },
        { label: 'Health & Education', href: '/category/health-education' },
    ],
    agency: [
        { label: 'About Agency', href: '/about' },
        { label: 'Editorial Policy', href: '/editorial-policy' },
        { label: 'Contact Bureau', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Corrections', href: '/corrections' },
    ],
}

const socialLinks = [
    { icon: <FaFacebookF size={13} />, href: 'https://facebook.com/nrglobalnews', label: 'Facebook' },
    { icon: <FaTwitter size={13} />, href: 'https://twitter.com/nrglobalnews', label: 'Twitter' },
    { icon: <FaInstagram size={13} />, href: 'https://instagram.com/nrglobalnews', label: 'Instagram' },
    { icon: <FaYoutube size={13} />, href: 'https://youtube.com/@nrglobalnews', label: 'YouTube' },
]

export default function Footer() {
    return (
        <footer className="bg-brand-navy border-t border-white/5">
            {/* Top Strip */}
            <div className="border-b border-white/5">
                <div className="container py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-brand-gold rounded-full" />
                        <div>
                            <div className="text-[9px] text-brand-gold font-black uppercase tracking-[0.4em]">NR Regional Bureau</div>
                            <div className="text-[11px] text-white font-bold">Authoritative · Accurate · Independent</div>
                        </div>
                    </div>
                    <Link
                        href="/contact"
                        className="px-8 py-3 border border-brand-gold/40 text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-gold hover:text-white transition-all hover:shadow-lg hover:shadow-brand-gold/20"
                    >
                        Advertise With Us
                    </Link>
                </div>
            </div>

            {/* Main Grid */}
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Logo */}
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo-new.png"
                                alt="NR Global News Logo"
                                width={200}
                                height={64}
                                className="h-14 w-auto"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </Link>

                        <p className="text-[13px] leading-relaxed text-gray-500 font-medium">
                            NR Regional News Bureau delivers authoritative, ground-level journalism from Garhwa and Palamu districts — committed to truth, integrity, and community impact.
                        </p>

                        {/* Social Icons */}
                        <div className="space-y-2">
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Follow Our Bureau</div>
                            <div className="flex gap-3">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bureau Coverage */}
                    <div className="space-y-5">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-gold rounded-full inline-block" />
                            Bureau Coverage
                        </h3>
                        <ul className="space-y-2.5">
                            {navLinks.coverage.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-[12px] font-semibold text-gray-500 hover:text-brand-gold transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={10} className="text-brand-gold/50 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Agency Info */}
                    <div className="space-y-5">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-gold rounded-full inline-block" />
                            Agency Info
                        </h3>
                        <ul className="space-y-2.5">
                            {navLinks.agency.map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-[12px] font-semibold text-gray-500 hover:text-brand-gold transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={10} className="text-brand-gold/50 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-5">
                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-gold rounded-full inline-block" />
                            Bureau HQ
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/[0.06] hover:border-brand-gold/20 transition-colors">
                                <MapPin size={16} className="text-brand-gold shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-[9px] font-black uppercase text-white tracking-widest mb-1">Regional Office</div>
                                    <div className="text-[12px] font-semibold text-gray-400">Garhwa, Jharkhand — 822114</div>
                                </div>
                            </div>
                            <a
                                href="mailto:bicholia03@gmail.com"
                                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/[0.06] hover:border-brand-gold/20 transition-colors group"
                            >
                                <Mail size={16} className="text-brand-gold shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-[9px] font-black uppercase text-white tracking-widest mb-1">Press & Media</div>
                                    <div className="text-[12px] font-semibold text-gray-400 group-hover:text-brand-gold transition-colors">
                                        bicholia03@gmail.com
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                <ShieldCheck size={13} className="text-brand-gold" />
                                Verified Media House
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="container py-6 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider" suppressHydrationWarning>
                        <ShieldCheck size={12} className="text-brand-gold" />
                        © {new Date().getFullYear()} NR Regional Bureau · All Rights Reserved
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        <Link href="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-brand-gold transition-colors">Refund</Link>
                        <Link href="/sitemap.xml" className="hover:text-brand-gold transition-colors">Sitemap</Link>
                        <span className="text-white flex items-center gap-1.5">
                            <Globe size={11} className="text-brand-gold" /> International Bureau
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
