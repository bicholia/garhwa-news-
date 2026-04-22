'use client'

import { useEffect, useState } from 'react'
import { DownloadCloud, X, ShieldCheck } from 'lucide-react'

export default function InstallPWA() {
  const [mounted, setMounted] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Only show automatically if not dismissed recently
      const dismissed = localStorage.getItem('th_pwa_dismissed')
      if (!dismissed) {
        setShowPrompt(true)
      }
    }

    const manualTriggerHandler = () => {
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('show-install-prompt', manualTriggerHandler)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('show-install-prompt', manualTriggerHandler)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('th_pwa_dismissed', 'true')
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setShowPrompt(false)
            localStorage.setItem('th_pwa_dismissed', 'true')
        }
        setDeferredPrompt(null)
    } else if (isIOS) {
        // Simple and direct instruction for iOS
        alert('iPhone पर इंस्टॉल करने के लिए: नीचे "Share" बटन दबाएं और फिर "Add to Home Screen" चुनें।');
    } else {
        // For Android browsers where prompt isn't fired yet
        alert('ऐप इंस्टॉल करने के लिए: ब्राउज़र के ऊपर 3-डॉट्स (Menu) पर क्लिक करें और "Install App" चुनें।');
    }
  }

  if (!mounted || !showPrompt) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:bottom-12 md:left-auto md:right-6 md:w-[380px] bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[99999] border-2 border-brand-red/20 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-start gap-5">
        <div className="bg-ndtv-black p-3 rounded-2xl text-brand-red shrink-0">
          <DownloadCloud size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-black">ThinkIndia.press App</h4>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-brand-red transition-colors">
              <X size={16} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-4">
            Install the ThinkIndia.press application for fast, fair, and fearless news reports.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleInstallClick}
              className="flex-1 bg-ndtv-black text-white text-[10px] font-black uppercase tracking-widest py-3 rounded hover:bg-brand-red transition-all shadow-lg"
            >
              {isIOS ? 'Instructions' : 'Install Now'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-gray-400">
        <ShieldCheck size={10} className="text-brand-red" /> Bureau Verified Software
      </div>
    </div>
  )
}
