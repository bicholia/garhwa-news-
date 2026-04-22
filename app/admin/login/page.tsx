'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                setError(data.error || 'गलत पासवर्ड')
            }
        } catch (err) {
            setError('सर्वर से कनेक्ट नहीं हो पाया')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 lg:p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-[70px] h-[70px] bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_20px_rgba(220,38,38,0.4)]">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-[#0f172a] mb-1">एडमिन लॉगिन</h1>
                    <p className="text-gray-500 text-sm font-medium">ThinkIndia.press — Secure Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                            पासवर्ड (Password)
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                autoComplete="off"
                                className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl text-lg outline-none focus:border-brand-red transition-all pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white text-sm font-black uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-brand-red to-red-800 hover:scale-[1.02] active:scale-95'}`}
                    >
                        {loading ? 'वेरिफाई हो रहा है...' : 'डैशबोर्ड खोलें →'}
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    © {new Date().getFullYear()} ThinkIndia.press
                </p>
            </div>
        </div>
    )
}
