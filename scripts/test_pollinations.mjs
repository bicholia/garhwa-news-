const geoPrompt = `समाचार को 'NR Daily News' के लिए लिखें। 
JSON प्रारूप में जवाब दें: {"title": "", "excerpt": "", "content": "", "highlights": ["बिंदु 1", "बिंदु 2", "बिंदु 3"]}
- 'highlights' में खबर के 3 सबसे मुख्य तथ्य होने चाहिए (AEO/GEO के लिए)।
- भाषा सरल और आधिकारिक होनी चाहिए।
शीर्षक: गढ़वा में बारिश
संदर्भ: आज गढ़वा में भारी बारिश हुई है।`;

async function testPollinations() {
    console.log('Testing Pollinations Fallback...');
    try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}`);
        const text = await res.text();
        console.log('Raw Response:', text);
        const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        console.log('Extracted JSON String:', jsonStr);
        const parsed = JSON.parse(jsonStr);
        console.log('Parsed JSON Success:', parsed.title);
    } catch (err) {
        console.error('Pollinations failed:', err.message);
    }
}

testPollinations();
