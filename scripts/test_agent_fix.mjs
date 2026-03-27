import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function rewriteWithTestFallback(title, content) {
    const geoPrompt = `समाचार को 'NR Daily News' के लिए लिखें। 
    JSON प्रारूप में जवाब दें: {"title": "", "excerpt": "", "content": "", "highlights": ["बिंदु 1", "बिंदु 2", "बिंदु 3"]}
    - 'highlights' में खबर के 3 सबसे मुख्य तथ्य होने चाहिए (AEO/GEO के लिए)।
    - भाषा सरल और आधिकारिक होनी चाहिए।
    शीर्षक: ${title}
    संदर्भ: ${content}`;

    console.log("Forcing Pollinations AI Fallback...");
    try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}`);
        const text = await res.text();
        
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
        
        if (startIdx === -1 || endIdx === -1) {
            console.error('Invalid JSON from Pollinations:', text);
            throw new Error('No JSON found in response');
        }
        
        const jsonStr = text.substring(startIdx, endIdx + 1);
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("Fallback error:", err);
        return null;
    }
}

async function run() {
    console.log("Running agent fix test...");
    const result = await rewriteWithTestFallback("Weather Update in Garhwa", "Heavy rain is expected in Garhwa district tomorrow, leading to school closures.");
    console.log("AI Result:", result);
}
run();
