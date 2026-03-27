import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.production.local') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function rewriteWithAI(title, content) {
    console.log("Testing AI Rewriting...");
    const today = new Date().toLocaleDateString('hi-IN');
    const geoPrompt = `You are a journalist. Current date: ${today}. Rewrite this title: ${title}. Content: ${content}. Return JSON: {"title": "...", "content": "..."}`;
    
    // Test only a fallback model since Gemini is likely quota-hit
    const modelName = "mistral"; 
    const url = `https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}?model=${modelName}`;
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log("Full AI Response:", text);
        const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonStr);
        console.log("Parsed Object Keys:", Object.keys(parsed));
        return parsed;
    } catch (e) {
        console.error("AI Error:", e.message);
    }
}

async function getImageUrl(prompt) {
    console.log("Testing Image Generation...");
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true`;
    try {
        const res = await fetch(aiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        console.log("Image Status:", res.status);
        console.log("Content-Type:", res.headers.get('content-type'));
    } catch (e) {
        console.error("Image Error:", e.message);
    }
}

async function test() {
    await rewriteWithAI("Garhwa building collapse", "A small building collapsed in Garhwa today.");
    await getImageUrl("News photograph of a building collapse in Garhwa");
}
test();
