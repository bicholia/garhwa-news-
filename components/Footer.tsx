import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import Image from 'next/image'

const links = {
    categories: [
        { label: 'टॉप स्टोरी', href: '/category/top-story' },
        { label: 'अपराध समाचार', href: '/category/crime' },
        { label: 'प्रशासनिक कार्रवाई', href: '/category/administration' },
        { label: 'शहर की सुविधाएं', href: '/category/city-facilities' },
        { label: 'आपदा / दुर्घटना', href: '/category/disaster-accident' },
        { label: 'स्वास्थ्य और शिक्षा', href: '/category/health-education' },
        { label: 'जनसमस्या', href: '/category/public-issues' },
        { label: 'ग्रामीण विकास', href: '/category/rural-development' },
        { label: 'सामाजिक कार्यक्रम', href: '/category/social-events' },
    ],
    districts: [
        { label: 'गढ़वा', href: '/garhwa' },
        { label: 'पलामू', href: '/palamu' },
        { label: 'झारखंड', href: '/jharkhand' },
    ],
    legal: [
        { label: 'हमारे बारे में', href: '/about' },
        { label: 'संपर्क', href: '/contact' },
        { label: 'गोपनीयता नीति', href: '/privacy-policy' },
        { label: 'नियम और शर्तें', href: '/terms' },
        { label: 'रिफंड नीति', href: '/refund-policy' },
        { label: 'संपादकीय नीति', href: '/editorial-policy' },
        { label: 'सुधार नीति', href: '/corrections' },
    ],
}

const s = {
    col: { color: '#d1d5db', fontSize: '0.83rem' } as React.CSSProperties,
    heading: { color: 'white', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
    dot: { display: 'inline-block', width: 3, height: 18, background: '#dc2626', borderRadius: 2 } as React.CSSProperties,
    link: { display: 'flex', alignItems: 'center', gap: '6px', color: '#d1d5db', fontSize: '0.83rem', marginBottom: '8px' } as React.CSSProperties,
}

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer style={{ background: '#111827', color: '#d1d5db', paddingTop: '2.5rem', paddingBottom: '1rem', marginTop: '2.5rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <Image 
                                src="/logo.png" 
                                alt="NR Daily News Logo" 
                                width={150} 
                                height={50} 
                                style={{ height: '50px', width: 'auto' }}
                            />
                            <div>
                                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>गढ़वा पलामू न्यूज़</div>
                                <div style={{ color: '#f87171', fontSize: '0.72rem' }}>सच्चाई के साथ</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                            गढ़वा और पलामू की ताज़ा, सटीक और निष्पक्ष खबरें। स्थानीय पत्रकारिता को समर्पित।
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[
                                { label: 'FB', icon: <FaFacebookF size={16} />, href: 'https://www.facebook.com/profile.php?id=61588651835601', bg: '#1877f2' },

                            ].map(site => (
                                <a key={site.label} href={site.href} target="_blank" rel="noopener noreferrer"
                                    style={{ width: 36, height: 36, borderRadius: '50%', background: site.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    {site.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 style={s.heading}><span style={s.dot} /> समाचार श्रेणियाँ</h3>
                        {links.categories.map(l => (
                            <Link key={l.href} href={l.href} style={s.link} className="hover:text-red-400">
                                <span style={{ color: '#dc2626', fontSize: '0.65rem' }}>&rsaquo;</span> {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Important links */}
                    <div>
                        <h3 style={s.heading}><span style={s.dot} /> महत्वपूर्ण लिंक</h3>
                        {links.legal.map(l => (
                            <Link key={l.href} href={l.href} style={s.link} className="hover:text-red-400">
                                <span style={{ color: '#dc2626', fontSize: '0.65rem' }}>&rsaquo;</span> {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={s.heading}><span style={s.dot} /> संपर्क</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem' }}>
                                <MapPin size={15} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
                                <span>गढ़वा, झारखंड — 822114</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                                <Mail size={15} style={{ color: '#f87171', flexShrink: 0 }} />
                                <a href="mailto:bicholia03@gmail.com" className="hover:text-white">bicholia03@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
                    <p>&copy; {year} NR Daily News — गढ़वा पलामू न्यूज़। सर्वाधिकार सुरक्षित।</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-white">Refund</Link>
                        <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
