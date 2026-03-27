require('dotenv').config({ path: '.env.local' });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing Key:', key?.substring(0, 10) + '...');
    
    // Try to list models via REST
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
            console.error('API Error:', data.error.message);
            return;
        }
        
        console.log('Available Models from API:');
        data.models?.slice(0, 10).forEach(m => {
            console.log(`- ${m.name}`);
        });
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}

test();
