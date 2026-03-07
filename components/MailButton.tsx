'use client'

import { Mail } from 'lucide-react'

export default function MailButton() {
    return (
        <a
            href="mailto:bicholia03@gmail.com"
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: '#dc2626',
                color: 'white',
                width: 56,
                height: 56,
                borderRadius: '50%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'transform 0.2s'
            }}
            className="hover:scale-110"
            aria-label="Email Us"
        >
            <Mail size={24} />
        </a>
    )
}
