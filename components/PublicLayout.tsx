'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import '@/app/global.css'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow pb-20 lg:pb-0">
                {children}
            </div>
            <Footer />
            <MobileNav />
        </div>
    )
}
