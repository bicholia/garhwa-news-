import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstallPWA from '@/components/InstallPWA'
import '@/app/global.css'
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
                {children}
            </div>
            <InstallPWA />
            <Footer />
        </div>
    )
}
