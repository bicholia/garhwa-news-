'use client'

import { useEffect, useState } from 'react'
import { DownloadCloud, X } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if IOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt && !isIOS) return null

  // For IOS, we just show instructions since they don't support beforeinstallprompt
  if (isIOS && !showPrompt) {
    // Only show IOS prompt if it's not already installed
    if ((window.navigator as any).standalone) return null
    // We could show it after a delay or scroll, but for now we wait for manual trigger or just return
    return null 
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      background: 'white',
      padding: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '2px solid #dc2626',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: '#dc2626', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
          <DownloadCloud size={24} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>NR Daily App</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>बेहतर अनुभव के लिए ऐप इंस्टॉल करें</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={handleInstallClick}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {isIOS ? 'Instructions' : 'Install'}
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', color: '#64748b' }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
