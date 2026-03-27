import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Parser from 'rss-parser';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function runDemo() {
    console.log('🌟 NR Daily News: AI AutoBot Live Demo 🌟');
    console.log('-------------------------------------------');

    try {
        console.log('🔍 Checking available models...');
        try {
            const models = await genAI.listModels();
            console.log('Models found:', models.map(m => m.name).join(', '));
        } catch (e) {
            console.log('Could not list models:', e.message);
        }

        // 1. Fetch real news from RSS
        console.log('📡 Step 1: प्रभात खबर (Prabhat Khabar) से ताज़ा खबरें ढूंढ रहे हैं...');
        const feed = await parser.parseURL('https://www.prabhatkhabar.com/state/jharkhand/feed');
        const latestItem = feed.items[0];

        if (!latestItem) {
            console.log('❌ कोई नई खबर नहीं मिली।');
            return;
        }

        console.log(`✅ मिली खबर: "${latestItem.title}"`);
        console.log('-------------------------------------------');

        // 2. Rewrite with Gemini
        console.log('🤖 Step 2: Gemini AI अब इस खबर को NR Daily के अंदाज़ में लिख रहा है...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `Rewrite this news for 'NR Daily News' in Hindi. 
Title: ${latestItem.title}
Context: ${latestItem.contentSnippet || latestItem.content}

Return ONLY a JSON object with "title", "excerpt", and "content" fields.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        // Find JSON in the response
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        const jsonStr = text.substring(firstBrace, lastBrace + 1);
        const aiResult = JSON.parse(jsonStr);

        console.log(`📝 AI ने न्यूज़ लिख ली है! (हेडलाइन: ${aiResult.title})`);
        console.log('-------------------------------------------');

        // 3. Publish to Sanity
        console.log('📤 Step 3: ताज़ा खबर को वेबसाइट पर पब्लिश कर रहे हैं...');
        
        const doc = {
            _type: 'article',
            title: aiResult.title,
            slug: { 
                _type: 'slug', 
                current: aiResult.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7) 
            },
            excerpt: aiResult.excerpt,
            body: [
                {
                    _type: 'block',
                    children: [{ _type: 'span', text: aiResult.content }]
                }
            ],
            district: 'jharkhand',
            publishedAt: new Date().toISOString()
        };

        const publishRes = await client.create(doc);
        
        console.log('-------------------------------------------');
        console.log('✅ सफलता! खबर अब लाइव है।');
        console.log(`🔗 Link: https://nrdailynews.vercel.app/news/${doc.slug.current}`);
        console.log('-------------------------------------------');

    } catch (error) {
        console.error('❌ डेमो के दौरान एरर आया:', error.message);
    }
}

runDemo();
