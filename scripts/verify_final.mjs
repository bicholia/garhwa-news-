import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.production.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Mocking logic from write_30_news.mjs / route.js
async function rewriteWithAI(title, content) {
    console.log("🤖 Rewriting with AI...");
    const aiModels = [
        { type: "pollinations", name: "openai" }, 
        { type: "pollinations", name: "mistral" },
        { type: "pollinations", name: "llama" }
    ];
    for (const model of aiModels) {
        try {
            const url = `https://text.pollinations.ai/${encodeURIComponent("Rewrite as Hindi news JSON {title, content, excerpt, highlights[], englishImagePrompt}: " + title + " " + content)}?model=${model.name}`;
            const res = await fetch(url);
            const text = await res.text();
            const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const parsed = JSON.parse(jsonStr);
            console.log(`✅ AI Success (${model.name})`);
            return parsed;
        } catch (e) { console.log(`⚠️ AI Retry (${model.name})`); }
    }
    return { title, content, excerpt: content.substring(0, 100), highlights: [], englishImagePrompt: title };
}

async function getImageUrl(prompt) {
    console.log("🎨 Fetching Image...");
    const stockUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80";
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1200&height=630&model=flux&nologo=true`;
    try {
        const res = await fetch(aiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok && res.headers.get('content-type')?.includes('image')) return aiUrl;
    } catch (e) {}
    console.log("📸 Using Unsplash Fallback");
    return stockUrl;
}

async function run() {
    const title = "गढ़वा में विकास कार्यों की समीक्षा";
    const content = "गढ़वा जिला मुख्यालय में आज उपायुक्त ने विभिन्न विकास योजनाओं की प्रगति की समीक्षा की। उन्होंने काम में तेजी लाने के निर्देश दिए।";
    
    const rewritten = await rewriteWithAI(title, content);
    const imageUrl = await getImageUrl(rewritten.englishImagePrompt || title);
    
    try {
        console.log("🚀 Publishing to Sanity...");
        const published = await client.create({
            _type: 'article',
            title: rewritten.title || title,
            slug: { _type: 'slug', current: 'test-news-' + Date.now() },
            excerpt: rewritten.excerpt || content.substring(0, 100),
            body: [
                { _type: 'block', style: 'normal', children: [{ _type: 'span', text: rewritten.content || content }] }
            ],
            category: { _type: 'reference', _ref: 'category-local' },
            district: 'garhwa',
            publishedAt: new Date().toISOString(),
            image_url: imageUrl,
            highlights: rewritten.highlights || []
        });
        console.log("✨ TEST SUCCESS! Article ID:", published._id);
    } catch (publishError) {
        console.error("❌ SANITY ERROR:", publishError.message);
        if (publishError.message.includes('Insufficient permissions')) {
            console.log("💡 TIP: Verify SANITY_TOKEN in .env.production.local has WRITE permissions.");
        }
    }
    console.log("🔗 URL:", imageUrl);
}
run();
