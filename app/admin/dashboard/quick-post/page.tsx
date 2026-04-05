'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Zap } from 'lucide-react';

export default function QuickPostPage() {
    const router = useRouter();
    const [tip, setTip] = useState('');
    const [district, setDistrict] = useState('garhwa');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return setError('आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता है।');
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTip(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleSynthesize = async () => {
        if (!tip || tip.length < 5) return setError('कृपया कम से कम 5 शब्द लिखें।');
        
        setIsSynthesizing(true);
        setStatus('🎙️ Neural Agency Pulse को सक्रिय कर रहे हैं...');
        setError('');

        try {
            // STEP 1: Synthesis Start
            const res = await fetch('/api/neural-quick-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    tip, 
                    district,
                    secret: 'neural-secret-2024' // We will get this from env later
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Synthesis error');

            setSuccess(true);
            setStatus('✅ खबर सफलतापूर्वक प्रकाशित कर दी गई है!');
            setTimeout(() => router.push('/admin/dashboard/posts'), 2000);
        } catch (err: any) {
            setError(err.message || 'सॉफ्टवेयर त्रुटि: AI सिंथेसिस विफल रहा।');
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.5px' }}>
                    Neural <span style={{ color: '#6366f1' }}>Quick-Post</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.2rem' }}>
                    फोन से खबर डालें, AI सब संभाल लेगा।
                </p>
            </div>

            {/* Form Card */}
            <div style={{ 
                background: 'white', 
                borderRadius: '1.5rem', 
                border: '1px solid #e2e8f0', 
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                        क्या हुआ है? (News Tip)
                    </label>
                    <div style={{ position: 'relative' }}>
                        <textarea 
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            placeholder="जैसे: कांडी में सड़क हादसा हुआ है, 2 लोग घायल..."
                            disabled={isSynthesizing}
                            style={{ 
                                width: '100%', 
                                height: '220px', 
                                padding: '1.2rem', 
                                paddingBottom: '3.5rem',
                                borderRadius: '1.2rem', 
                                border: '1.5px solid #e2e8f0',
                                fontSize: '1.15rem',
                                fontFamily: 'inherit',
                                resize: 'none',
                                outline: 'none',
                                background: '#fcfdfe',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderColor: error ? '#ef4444' : (isListening ? '#6366f1' : '#e2e8f0'),
                                boxShadow: isListening ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none'
                            }}
                        />
                        
                        {/* Voice Button */}
                        <button
                            onClick={toggleListening}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                bottom: '1rem',
                                width: '48px',
                                height: '48px',
                                borderRadius: '1rem',
                                border: 'none',
                                background: isListening ? '#ef4444' : '#f1f5f9',
                                color: isListening ? 'white' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                animation: isListening ? 'mic-pulse 1.5s infinite' : 'none'
                            }}
                            title="बोल कर लिखें"
                        >
                            <Mic size={22} />
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                        जिला (District)
                    </label>
                    <select 
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={isSynthesizing}
                        style={{
                            width: '100%', 
                            padding: '0.8rem 1rem', 
                            borderRadius: '0.8rem', 
                            border: '1.5px solid #e2e8f0',
                            fontSize: '1rem',
                            background: '#f8fafc',
                            appearance: 'none'
                        }}
                    >
                        <option value="garhwa">गढ़वा</option>
                        <option value="palamu">पलामू</option>
                        <option value="jharkhand">झारखंड</option>
                    </select>
                </div>

                {/* Synthesis Button */}
                <button 
                    onClick={handleSynthesize}
                    disabled={isSynthesizing || success}
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        border: 'none',
                        background: isSynthesizing ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: isSynthesizing ? '#94a3b8' : 'white',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        cursor: isSynthesizing ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: isSynthesizing ? 'none' : '0 10px 15px -3px rgb(99 102 241 / 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isSynthesizing ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 0.8s infinite alternate' }}></div>
                            <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 0.8s infinite 0.2s alternate' }}></div>
                            <div style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 0.8s infinite 0.4s alternate' }}></div>
                        </div>
                    ) : (
                        '🚀 खबर सिंथेसाइज करें'
                    )}
                </button>

                {/* Status Messages */}
                {status && (
                    <div style={{ 
                        marginTop: '1.5rem', 
                        padding: '1rem', 
                        borderRadius: '0.8rem', 
                        background: '#f0f9ff', 
                        color: '#0369a1',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        border: '1px solid #bae6fd'
                    }}>
                        {status}
                    </div>
                )}

                {error && (
                    <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.8rem', 
                        borderRadius: '0.8rem', 
                        background: '#fef2f2', 
                        color: '#b91c1c',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid #fecaca'
                    }}>
                        ❌ {error}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    from { opacity: 0.3; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1.2); }
                }
                @keyframes mic-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                button:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}
