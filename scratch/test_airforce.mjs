
async function testAirforce() {
    const STRICT_SYSTEM_PROMPT = "You are a helpful assistant. Respond in JSON.";
    const agentPrompt = "Give me a news summary.";
    const inputTitle = "Test News";
    const inputContent = "This is a test content.";
    
    const url = `https://api.airforce/v1/chat/completions`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: STRICT_SYSTEM_PROMPT },
                    { role: 'user', content: `${agentPrompt}\n\nTitle: ${inputTitle}\nContent: ${inputContent}` }
                ],
                model: 'gpt-4o-mini'
            })
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testAirforce();
