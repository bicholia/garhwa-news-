import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/app/global.css'
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            <Footer />
        </>
    )
}
