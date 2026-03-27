
'use client';
import { useEffect, useState } from 'react';

export default function DebugTrigger() {
    const [status, setStatus] = useState('Idle');
    const [result, setResult] = useState<any>(null);

    const runTrigger = async () => {
        setStatus('Running...');
        try {
            const res = await fetch('/api/ai-news-agent?limit=30', {
                headers: {
                    'Authorization': 'Bearer nr_daily_news_secret_2026'
                }
            });
            const data = await res.json();
            setResult(data);
            setStatus('Done');
        } catch (err: any) {
            setStatus('Error: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>AI Agent Debug Trigger</h1>
            <button 
                onClick={runTrigger}
                style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Generate 30 News Articles
            </button>
            <div style={{ marginTop: '2rem' }}>
                <p>Status: <strong>{status}</strong></p>
                {result && (
                    <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px' }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
