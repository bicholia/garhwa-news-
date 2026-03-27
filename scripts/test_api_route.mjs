import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchNewsSmart } from '../lib/smartNewsFetcher.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function rewriteWithAI(title, content) {
    const geoPrompt = `समाचार को 'NR Daily News' के लिए लिखें। 
    JSON प्रारूप में जवाब दें: {"title": "", "excerpt": "", "content": "", "highlights": ["बिंदु 1", "बिंदु 2", "बिंदु 3"]}
    - 'highlights' में खबर के 3 सबसे मुख्य तथ्य होने चाहिए (AEO/GEO के लिए)।
    - भाषा सरल और आधिकारिक होनी चाहिए।
    शीर्षक: ${title}
    संदर्भ: ${content}`;

    console.log("Trying Gemini...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(geoPrompt);
        const text = (await result.response).text().trim();
        const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Gemini Error, falling back to Pollinations...', e.message);
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
            console.error('Pollinations Error:', err.message);
            return null;
        }
    }
}

async function run() {
    console.log("Fetching news...");
    const targetNews = await fetchNewsSmart();
    console.log(`Found ${targetNews.length} articles.`);
    
    if (targetNews.length === 0) return;
    
    const item = targetNews[0];
    console.log(`Processing: ${item.title}`);
    
    const rewritten = await rewriteWithAI(item.title, item.content);
    console.log("Result:", rewritten);
}

run();
