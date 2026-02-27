'use client'

import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/918789320315?text=नमस्ते! मुझे एक खबर भेजनी है।"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: '#16a34a',
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
            aria-label="WhatsApp"
        >
            <FaWhatsapp size={30} />
        </a>
    )
}
