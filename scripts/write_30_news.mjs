
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchNewsSmart } from '../lib/smartNewsFetcher.js';
import { insertNews, isNewsExists } from '../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.production.local') });

// Sanity Client
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

async function rewriteWithAI(title, content) {
    const now = new Date();
    const todayHindi = now.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const todayISO = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
    const geoPrompt = `You are a BREAKING NEWS editor at "NR Daily News" (Garhwa & Palamu Jharkhand).
Today's date (IST): ${todayHindi} (${todayISO}).

CRITICAL RULES - FOLLOW STRICTLY:
1. ✅ Write ONLY in present tense as if the news is happening TODAY (${todayISO}).
2. ✅ The article MUST feel like fresh, breaking news published RIGHT NOW.
3. ❌ NEVER use past events or references to things that happened months or years ago.
4. ❌ NEVER write in past tense (घटना हुई, लगाया गया, था, थे, हुई, आई, गई).
5. ✅ Use active, urgent language: "जारी है", "आ रही है", "हो रहा है", "मिल रही है".
6. ✅ Always mention Garhwa, Palamu or Jharkhand in context.
7. ❌ NEVER mention the name of ANY original source, news agency, media portal, newspaper, or news channel from A to Z (e.g., Prabhat Khabar, Jagran, Zee, Aaj Tak, BBC, Local Khabar, Lagatar, etc.). 
8. ✅ Present all facts purely as an exclusive, on-ground report gathered by the "NR Daily News Bureau" or write "सूत्रों के अनुसार" (According to sources).
9. ✅ Response MUST be a single valid JSON object only, no other text.

JSON Format:
{
    "title": "Breaking: आज का ताज़ा हिंदी शीर्षक",
    "excerpt": "1-2 sentences - what is happening RIGHT NOW",
    "content": "Detailed news in Hindi, present tense, 3-5 paragraphs",
    "highlights": ["ताज़ा अपडेट 1", "ताज़ा अपडेट 2", "ताज़ा अपडेट 3"],
    "englishImagePrompt": "News photo of [topic] in Jharkhand village setting, cinematic, 4k",
    "seoKeywords": "Garhwa News Today, Palamu Breaking News, आज की खबर, [topic], झारखंड न्यूज़"
}
शीर्षक: ${title}
संदर्भ: ${content}`;

    const aiModels = [
        { type: "gemini", name: "gemini-2.0-flash" },
        { type: "pollinations", name: "openai" }, 
        { type: "pollinations", name: "llama" },  
        { type: "pollinations", name: "mistral" }, 
        { type: "pollinations", name: "searchgpt" } 
    ];

    for (const modelInfo of aiModels) {
        try {
            let jsonStr = "";
            if (modelInfo.type === "gemini") {
                const model = genAI.getGenerativeModel({ model: modelInfo.name });
                const result = await model.generateContent(geoPrompt);
                const text = (await result.response).text().trim();
                jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            } else {
                const url = `https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}?model=${modelInfo.name}`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s per AI
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                const text = await res.text();
                jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            }
            
            // Smart JSON Parsing
            const finalParsed = JSON.parse(jsonStr);
            
            // Handle variations in key names (case-insensitive)
            const findKey = (obj, key) => {
                const entries = Object.entries(obj);
                const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase());
                return found ? found[1] : null;
            };

            const titleVal = findKey(finalParsed, 'title');
            const contentVal = findKey(finalParsed, 'content');
            
            if (titleVal && contentVal) {
                console.log(`🚀 [AI Using] ${modelInfo.name}`);
                return {
                    title: titleVal,
                    excerpt: findKey(finalParsed, 'excerpt') || contentVal.substring(0, 160),
                    content: contentVal,
                    highlights: findKey(finalParsed, 'highlights') || [],
                    englishImagePrompt: findKey(finalParsed, 'englishImagePrompt') || titleVal,
                    seoKeywords: findKey(finalParsed, 'seoKeywords') || `${titleVal}, NR Daily News, Garhwa`
                };
            }
            throw new Error('Incomplete JSON');
        } catch (err) {
            console.log(`⚠️ [AI Retry] ${modelInfo.name}: ${err.message}`);
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s before next
        }
    }
    return { title, excerpt: content.substring(0, 100), content, highlights: [], englishImagePrompt: title };
}

async function getImageUrl(prompt, district) {
    const cleanPrompt = prompt ? prompt.replace(/[^\w\s]/gi, '').split(' ').slice(0, 5).join(' ') : "Breaking News " + district;
    const stockUrl = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=630&auto=format&fit=crop&sig=${Math.floor(Math.random() * 100000)}`;
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

    return stockUrl;
}

function detectDistrict(text, source) {
  text = text.toLowerCase() + ' ' + (source || '').toLowerCase();
  if (text.match(/गढ़वा|भवनाथपुर|मझिआंव|उंटारी|डंडा|खरौंधी|कांडी|रमना|विशुनपुरा/)) return 'garhwa';
  if (text.match(/पलामू|मेदिनीनगर|डालटनगंज|हरिहरगंज|चैनपुर|लेस्लीगंज/)) return 'palamu';
  if (text.match(/लातेहार|बरवाडीह|चंदवा/)) return 'latehar';
  return 'jharkhand';
}

function detectCategory(text) {
  text = text.toLowerCase();
  if (text.match(/अपराध|हत्या|पुलिस|चोरी|गिरफ्तार|जहर|मर्डर/)) return 'अपराध';
  if (text.match(/नौकरी|भर्ती|रोजगार|वैकेंसी/)) return 'सरकारी नौकरियां';
  if (text.match(/शिक्षा|स्कूल|कॉलेज|परीक्षा|रिजल्ट|यूनिवर्सिटी/)) return 'शिक्षा';
  if (text.match(/खेल|क्रिकेट|फुटबॉल|टूर्नामेंट|खिलाड़ी/)) return 'खेल';
  if (text.match(/चु्नाव|राजनीति|नेता|मुख्यमंत्री|विधायक|पार्टी/)) return 'राजनीति';
  if (text.match(/मौसम|बारिश|गर्मी|ठंड|तूफान|बाढ़/)) return 'मौसम';
  return 'स्थानीय समाचार';
}

async function run() {
    console.log('🚀 Starting manual 30-news generation...');
    try {
        const targetNews = await fetchNewsSmart();
        console.log(`📰 Found ${targetNews.length} candidate articles.`);
        
        let count = 0;
        for (const item of targetNews) {
            if (count >= 30) break;

            const baseSlug = createSlug(item.title);
            if (await isNewsExists(baseSlug)) {
                console.log(`⏩ Skipping (exists): ${item.title.substring(0, 40)}`);
                continue;
            }
            const finalSlug = baseSlug + '-' + Math.random().toString(36).substring(7);

            console.log(`📝 [${count+1}/30] Processing: ${item.title.substring(0, 50)}...`);
            const rewritten = await rewriteWithAI(item.title, item.content);
            
            // Image handling: Use RSS image if available, else Pollinations
            let imgUrl = item.image_url;
            if (!imgUrl) {
                console.log('🎨 Generating AI image...');
                imgUrl = await getImageUrl(rewritten.englishImagePrompt || rewritten.title, item.district);
            } else {
                console.log('✅ Using original RSS image');
            }

            const assetId = await uploadImageToSanity(imgUrl, rewritten.title);
            const district = detectDistrict(rewritten.title + ' ' + rewritten.content, item.source || item.source_name);
            
            let priority = 0;
            if (district === 'garhwa') priority = 100;
            else if (district === 'palamu') priority = 80;

            try {
                // Try Postgres first
                await insertNews({
                    title: rewritten.title,
                    slug: finalSlug,
                    content: rewritten.content,
                    excerpt: rewritten.excerpt,
                    image_url: assetId,
                    category: detectCategory(rewritten.title + ' ' + rewritten.content),
                    district: district,
                    priority: priority,
                    is_promoted: priority > 0,
                    highlights: rewritten.highlights || [],
                    seo_keywords: rewritten.seoKeywords || "",
                    original_source: item.url,
                    published_at: item.publishedAt || new Date().toISOString()
                });
            } catch (dbError) {
                console.log(`⚠️ Postgres failed (${dbError.message}), writing to Sanity directly...`);
                
                const saneCategory = detectCategory(rewritten.title + ' ' + rewritten.content);
                let catRef = 'category-local';
                if (saneCategory === 'अपराध') catRef = 'category-crime';
                if (saneCategory === 'राजनीति') catRef = 'category-politics';
                if (saneCategory === 'सरकारी नौकरियां') catRef = 'category-jobs';
                if (saneCategory === 'शिक्षा') catRef = 'category-education';
                if (saneCategory === 'खेल') catRef = 'category-sports';
                if (saneCategory === 'मौसम') catRef = 'category-weather';

                // Insert directly to Sanity
                await client.create({
                    _type: 'article',
                    title: rewritten.title,
                    slug: { _type: 'slug', current: finalSlug },
                    excerpt: rewritten.excerpt,
                    body: [
                        { _type: 'block', style: 'normal', children: [{ _type: 'span', text: rewritten.content }] }
                    ],
                    category: { _type: 'reference', _ref: catRef },
                    author: { _type: 'reference', _ref: 'author-admin' },
                    district: district,
                    featured: priority > 0,
                    publishedAt: item.publishedAt || new Date().toISOString(),
                    featureImage: assetId ? { _type: 'image', asset: { _type: 'reference', _ref: assetId } } : undefined,
                    highlights: rewritten.highlights || [],
                    seoKeywords: rewritten.seoKeywords || ""
                });
            }

            console.log(`✅ Published: ${rewritten.title.substring(0, 40)}`);
            count++;
        }
        
        console.log(`✨ Successfully published ${count} news articles!`);
    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

run();
