
async function testPollinations() {
    const STRICT_SYSTEM_PROMPT = "You are a helpful assistant. Respond in JSON.";
    const agentPrompt = "Give me a news summary.";
    const inputTitle = "Test News";
    const inputContent = "This is a test content.";
    
    const url = `https://text.pollinations.ai/`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [
                    { role: 'system', content: STRICT_SYSTEM_PROMPT }, 
                    { role: 'user', content: `${agentPrompt}\n\nTitle: ${inputTitle}\nContent: ${inputContent}\nIMPORTANT: Respond with ONLY a valid JSON object.` }
                ], 
                model: 'openai',
                jsonMode: true 
            })
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testPollinations();
