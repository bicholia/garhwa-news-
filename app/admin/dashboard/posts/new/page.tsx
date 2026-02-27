import PostForm from '@/components/admin/PostForm'
import Link from 'next/link'

export default function NewPostPage() {
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link
                    href="/admin/dashboard/posts"
                    style={{
                        width: '38px', height: '38px',
                        background: 'white', border: '1.5px solid #e2e8f0',
                        borderRadius: '0.6rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', textDecoration: 'none',
                        fontSize: '1.1rem', flexShrink: 0
                    }}
                >
                    ←
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        नई खबर लिखें
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '0.2rem', fontSize: '0.9rem' }}>
                        लिखकर Sanity CMS में तुरंत पब्लिश करें
                    </p>
                </div>
            </div>

            <PostForm />
        </div>
    )
}
