'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCcw, 
  ShieldCheck, 
  PlusCircle, 
  Info,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'

// --- Styles ---
const styles = {
  container: {
    fontFamily: "'Outfit', sans-serif",
    maxWidth: 900,
    margin: '0 auto',
    padding: '2rem',
    color: '#1e293b'
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 32,
    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
  }
}

export default function TelegramSetup() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any>(null)
  const [detectedId, setDetectedId] = useState<string | null>(null)
  const [testSent, setTestSent] = useState(false)

  const verifyBot = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/telegram-setup?action=verify')
      const data = await res.json()
      if (data.ok) {
        setSuccess(data.result)
        setStep(2)
      } else {
        setError(data.error || 'Bot verification failed. Check your TELEGRAM_BOT_TOKEN.')
      }
    } catch (e) {
      setError('Network error during verification.')
    } finally {
      setLoading(false)
    }
  }

  const detectChannel = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/telegram-setup?action=detect')
      const data = await res.json()
      if (data.ok) {
        setDetectedId(data.chat_id)
        setSuccess({ ...success, channel_title: data.title })
        setStep(3)
      } else {
        setError(data.error || 'Could not find channel. Make sure bot is added as Admin and you have sent a test message or just added it.')
      }
    } catch (e) {
      setError('Network error during detection.')
    } finally {
      setLoading(false)
    }
  }

  const sendTest = async () => {
    if (!detectedId) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/telegram-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '🚀 *NR Daily News:* Telegram Integration Successfully Verified! \n\nThis channel is now connected to the Neural Agency V4 Pipeline.' })
      })
      const data = await res.json()
      if (data.ok) {
        setTestSent(true)
      } else {
        setError('Failed to send test message.')
      }
    } catch (e) {
      setError('Network error during test.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container} className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold mb-4">
             <ChevronLeft size={18} /> BACK TO DASHBOARD
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            TELEGRAM <span className="text-indigo-600">ONBOARDING</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">Activate the Neural Agency Social Distribution Layer</p>
        </div>
        <div className="flex gap-2">
           {[1, 2, 3].map((s) => (
             <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />
           ))}
        </div>
      </div>

      <div style={styles.glassCard} className="overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
               key="step1"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl italic">01</div>
                <h2 className="text-2xl font-black tracking-tight">Verify Bot Identity</h2>
              </div>
              
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                First, let's verify that your <span className="font-black text-slate-900">Telegram Bot Token</span> is correctly configured in your environment.
              </p>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold mb-8 flex items-center gap-3">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <button 
                onClick={verifyBot}
                disabled={loading}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="animate-spin" /> : <ShieldCheck />}
                VERIFY BOT STATUS
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl italic">02</div>
                <h2 className="text-2xl font-black tracking-tight">Channel Handshake</h2>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 font-black">A</div>
                   <div className="font-bold text-slate-700">Open Telegram and create a <span className="text-indigo-600">New Channel</span>.</div>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 font-black">B</div>
                   <div className="font-bold text-slate-700">Add <span className="bg-indigo-600 text-white px-2 py-0.5 rounded font-black">@{success?.username || 'your bot'}</span> as an <span className="italic">Administrator</span>.</div>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 font-black">C</div>
                   <div className="font-bold text-slate-700">Once added, click the button below to detect your <span className="text-indigo-600">Channel ID</span>.</div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold mb-8 flex items-center gap-3">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <button 
                onClick={detectChannel}
                disabled={loading}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="animate-spin" /> : <PlusCircle />}
                DETECT CHANNEL ID
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
               key="step3"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="p-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <h2 className="text-3xl font-black tracking-tight">Configuration Ready!</h2>
              </div>
              
              <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] mb-10">
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-600 mb-2">Detected Chat ID</div>
                <div className="text-4xl font-black text-emerald-950 tracking-tighter mb-4">{detectedId}</div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                   <Info size={16} /> Channel Title: <span className="font-black underline">{success?.channel_title}</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl text-slate-300 font-bold mb-10 border-l-4 border-indigo-500">
                 Final Step: Add this ID to your <span className="text-white">.env.local</span> file as <code className="bg-white/10 px-2 py-0.5 rounded text-indigo-400">TELEGRAM_CHANNEL_ID</code> to enable automated posting.
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={sendTest}
                  disabled={loading || testSent}
                  className={`flex-1 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${
                    testSent ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-default' : 'bg-white border-2 border-slate-100 text-slate-900 hover:border-indigo-600'
                  }`}
                >
                  {testSent ? <CheckCircle2 /> : <Send />}
                  {testSent ? 'TEST SENT' : 'SEND TEST MESSAGE'}
                </button>
                
                <Link 
                  href="/admin/dashboard"
                  className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl"
                >
                  FINISH SETUP <ArrowRight />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center text-slate-400 text-sm font-bold flex items-center justify-center gap-4 uppercase tracking-widest">
         <span className="w-8 h-[2px] bg-slate-200" />
         Neural Agency Distribution protocols V4.1
         <span className="w-8 h-[2px] bg-slate-200" />
      </div>
    </div>
  )
}
