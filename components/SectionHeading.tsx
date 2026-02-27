import Link from 'next/link'

export default function SectionHeading({ title, link }: { title: string; link?: string }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '0.5rem'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#111827',
                position: 'relative',
                display: 'inline-block'
            }}>
                {title}
                <span style={{
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 40,
                    height: 4,
                    background: '#dc2626',
                    borderRadius: 2
                }} />
            </h2>
            {link && (
                <Link href={link} style={{
                    color: '#dc2626',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 700
                }} className="hover:underline">
                    और देखें &rarr;
                </Link>
            )}
        </div>
    )
}
