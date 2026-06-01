import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try loading env vars
dotenv.config({ path: join(__dirname, '../.env.local') });
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    dotenv.config({ path: join(__dirname, '../.env.production.local') });
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

async function uploadImageToSanity(imageUrl, title) {
    if (!imageUrl) return null;
    try {
        console.log(`📸 Uploading image: ${imageUrl.substring(0, 50)}...`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const arrayBuffer = await response.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(arrayBuffer), {
            filename: `${createSlug(title)}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error('Sanity Upload Error:', error.message);
        return null;
    }
}

async function getImageUrl(prompt) {
    const cleanPrompt = prompt ? prompt.replace(/[^\w\s]/gi, '').split(' ').slice(0, 5).join(' ') : "Indian police investigation";
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&model=flux&nologo=true`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        const res = await fetch(aiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok && res.headers.get('content-type')?.includes('image')) return aiUrl;
    } catch (e) {}

    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=630&auto=format&fit=crop&sig=${Math.floor(Math.random() * 100000)}`;
}

async function generateCrimeNews(index) {
    const now = new Date();
    const todayHindi = now.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const todayISO = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
    
    const locations = [
        "रांची", "धनबाद", "जमशेदपुर", "बोकारो", "देवघर", 
        "हजारीबाग", "पलामू", "गढ़वा", "गिरिडीह", "रामगढ़",
        "दुमका", "गुमला", "गोड्डा", "साहिबगंज", "चतरा",
        "दिल्ली", "पटना", "लखनऊ", "कोलकाता", "मुंबई"
    ];
    
    const location = locations[index % locations.length];
    
    const prompt = `You are a BREAKING NEWS journalist for "NR Daily News".
Write a news report about a recent incident of crime/atrocity against a girl/woman in ${location}, India. Make it a unique, realistic, and serious news report in Hindi.
Today's date (IST): ${todayHindi} (${todayISO}).

CRITICAL RULES - FOLLOW STRICTLY:
1. Write ONLY in present tense or immediate past (हाल ही में हुआ, पुलिस जांच कर रही है).
2. The article MUST feel like a fresh, serious news report.
3. Keep the tone sensitive, journalistic, and professional.
4. Response MUST be a single valid JSON object only, no other text or markdown block.

JSON Format:
{
    "title": "Breaking: [Hindi Title]",
    "excerpt": "1-2 sentences - summary of the incident",
    "content": "Detailed news in Hindi formatted with <p> and <strong> tags, 3-5 paragraphs. Mention police action.",
    "highlights": ["अपडेट 1", "अपडेट 2", "अपडेट 3"],
    "englishImagePrompt": "News photo of police investigation in India, serious tone, cinematic, 4k",
    "seoKeywords": "Crime News, ${location} News, Women Safety, Police"
}`;

    let attempts = 0;
    while (attempts < 3) {
        try {
            const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&seed=${Math.floor(Math.random() * 10000)}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); 
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            const text = await res.text();
            
            // Smart JSON Parsing
            const parseAIResponse = (innerText) => {
                try {
                    return JSON.parse(innerText);
                } catch (e) {
                    const jsonMatch = innerText.match(/```json\n([\s\S]*?)\n```/) || innerText.match(/```([\s\S]*?)```/);
                    if (jsonMatch) {
                        try { return JSON.parse(jsonMatch[1]); } catch (e2) {}
                    }
                    const firstBrace = innerText.indexOf('{');
                    const lastBrace = innerText.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1) {
                        try { return JSON.parse(innerText.substring(firstBrace, lastBrace + 1)); } catch (e3) {}
                    }
                    throw new Error('Could not parse JSON from AI response');
                }
            };
            
            return parseAIResponse(text);
        } catch (err) {
            attempts++;
            console.log(`⚠️ Generation attempt ${attempts} failed for index ${index}: ${err.message}. Retrying...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return null;
}

async function run() {
    console.log('🚀 Starting 29 women safety/crime news generation...');
    
    let successCount = 0;
    for (let i = 0; i < 29; i++) {
        console.log(`\n📝 [${i+1}/29] Generating news article...`);
        const newsData = await generateCrimeNews(i);
        
        if (!newsData) {
            console.log(`❌ Failed to generate article ${i+1}`);
            continue;
        }

        const baseSlug = createSlug(newsData.title);
        const finalSlug = baseSlug + '-' + Math.random().toString(36).substring(7);

        console.log('🎨 Fetching image...');
        const imgUrl = await getImageUrl(newsData.englishImagePrompt || newsData.title);
        const assetId = await uploadImageToSanity(imgUrl, newsData.title);
        
        let district = "jharkhand";
        if (newsData.seoKeywords.toLowerCase().includes("garhwa")) district = "garhwa";
        if (newsData.seoKeywords.toLowerCase().includes("palamu")) district = "palamu";

        try {
            await client.create({
                _type: 'article',
                title: newsData.title,
                slug: { _type: 'slug', current: finalSlug },
                excerpt: newsData.excerpt,
                body: [
                    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: newsData.content }] }
                ],
                category: { _type: 'reference', _ref: 'category-crime' },
                author: { _type: 'reference', _ref: 'author-admin' },
                district: district,
                featured: false,
                publishedAt: new Date().toISOString(),
                featureImage: assetId ? { _type: 'image', asset: { _type: 'reference', _ref: assetId } } : undefined,
                highlights: newsData.highlights || [],
                seoKeywords: newsData.seoKeywords || "Crime News, Women Safety"
            });
            console.log(`✅ Published: ${newsData.title}`);
            successCount++;
        } catch (err) {
            console.error(`❌ Sanity insertion failed: ${err.message}`);
        }
        
        // Wait 3 seconds to avoid rate limits
        if (i < 28) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }
    
    console.log(`✨ Successfully published ${successCount}/29 news articles!`);
}

run();
