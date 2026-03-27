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

const NEWS_SOURCES = [
  'https://www.prabhatkhabar.com/rss/news/jharkhand/garhwa',
  'https://www.prabhatkhabar.com/state/jharkhand/feed',
  'https://www.livehindustan.com/jharkhand/garhwa/feed.rss',
];

async function runBatch() {
    console.log('🌟 NR Daily News: AI AutoBot Batch Writer 🌟');
    console.log('-------------------------------------------');

    let allNews = [];
    
    // 1. Fetch News
    console.log('📡 Step 1: अलग-अलग सोर्स से ताज़ा खबरें ढूंढ रहे हैं...');
    for (const source of NEWS_SOURCES) {
        try {
            const feed = await parser.parseURL(source);
            const items = feed.items.slice(0, 5); // Take top 5 from each
            allNews = [...allNews, ...items];
        } catch (e) {
            console.log(`Error fetching ${source}:`, e.message);
        }
    }

    // Deduplicate
    const uniqueNews = allNews.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i).slice(0, 10);
    
    if (uniqueNews.length === 0) {
        console.log('❌ कोई नई खबर नहीं मिली।');
        return;
    }

    console.log(`✅ कुल ${uniqueNews.length} ताज़ा खबरें मिली हैं!`);
    console.log('🤖 Step 2: Gemini 2.5 Flash अब इन खबरों को लिख रहा है...');
    console.log('-------------------------------------------');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let successCount = 0;

    for (let i = 0; i < uniqueNews.length; i++) {
        const item = uniqueNews[i];
        try {
            console.log(`[${i+1}/${uniqueNews.length}] प्रोसेस हो रहा है: "${item.title}"`);
            
            const prompt = `Rewrite this news for 'NR Daily News' in Hindi. It should be engaging and at least 200 words if possible.
Title: ${item.title}
Context: ${item.contentSnippet || item.content}

Return ONLY a valid JSON object with EXACTLY these three keys: "title", "excerpt", and "content".
Example format:
{
  "title": "Hindi Headline",
  "excerpt": "Short summary",
  "content": "Full detailed news paragraph 1.\\n\\nParagraph 2."
}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            
            // Extract JSON
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) {
                console.log(`⚠️ AI Response format valid नहीं है, स्किप कर रहे हैं।`);
                continue;
            }
            const jsonStr = text.substring(firstBrace, lastBrace + 1);
            const aiResult = JSON.parse(jsonStr);

            // Publish to Sanity
            const doc = {
                _type: 'article',
                title: aiResult.title,
                slug: { 
                    _type: 'slug', 
                    current: createSlug(aiResult.title) + '-' + Math.random().toString(36).substring(7) 
                },
                excerpt: aiResult.excerpt,
                body: [
                    {
                        _type: 'block',
                        children: [{ _type: 'span', text: aiResult.content }]
                    }
                ],
                district: 'jharkhand', // Default fallback
                publishedAt: new Date().toISOString()
            };

            await client.create(doc);
            console.log(`✅ पब्लिश: ${aiResult.title}`);
            successCount++;

            // Wait 2 seconds to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));

        } catch (err) {
            console.log(`❌ एरर (खबर ${i+1}):`, err.message);
        }
    }

    console.log('-------------------------------------------');
    console.log(`🎉 Batch Complete! वेबसाइट पर ${successCount} नई खबरें पब्लिश हो चुकी हैं।`);
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

runBatch();
