import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchNewsSmart } from '@/lib/smartNewsFetcher';
import { insertNews, isNewsExists, cleanupOldNews } from '@/lib/db.js';

export const maxDuration = 60; // Max allowed duration for Hobby
export const dynamic = 'force-dynamic'; // Prevent Vercel from caching the cron route

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
    try {
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
    const today = new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' });
    const geoPrompt = `You are a professional Hindi news editor. Current date: ${today}.
Rewrite the following news for "NR Daily News" (Garhwa & Palamu Jharkhand local news outlet).
Follow these strict rules:
1. Format: Professional, breaking news style, present tense.
2. Structure: Response MUST be a valid JSON object ONLY.
3. Content: Injected local context (Garhwa/Palamu/Jharkhand).
4. Keywords: Generate 5-10 SEO-friendly Hindi/English comma-separated keywords specific to this news.

JSON Structure:
{
    "title": "Hindi Catchy Title",
    "excerpt": "Short 1-2 sentence summary",
    "content": "Detailed news content in Hindi",
    "highlights": ["Point 1", "Point 2", "Point 3"],
    "englishImagePrompt": "A professional photo of [topic] in a village/town setting of Jharkhand, cinematic, 4k",
    "seoKeywords": "Garhwa News, [Local Topics], [Action], आज की खबर, न्यूज़"
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
            
            const finalParsed = JSON.parse(jsonStr);
            const findKey = (obj, key) => {
                const entries = Object.entries(obj);
                const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase());
                return found ? found[1] : null;
            };

            const titleVal = findKey(finalParsed, 'title');
            const contentVal = findKey(finalParsed, 'content');
            
            if (titleVal && contentVal) {
                console.log(`✅ [AI Success] Model: ${modelInfo.name}`);
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
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s before trying next AI
        }
    }
    return { title, excerpt: content.substring(0, 100), content, highlights: [], englishImagePrompt: title };
}

async function getImageUrl(prompt, district) {
    const cleanPrompt = prompt ? prompt.replace(/[^\w\s]/gi, '').split(' ').slice(0, 5).join(' ') : "Breaking News " + district;
    
    // Unsplash is much more reliable for high-quality news-stock images than free AI APIs in 2026
    const stockUrl = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=630&auto=format&fit=crop&sig=${Math.floor(Math.random() * 100000)}`;
    
    // We try AI first, but immediately fallback to stock if anything is fishy
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&model=flux&nologo=true`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s aggressive timeout
        const res = await fetch(aiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        // If it's a real image, use it, else return stock
        if (res.ok && res.headers.get('content-type')?.includes('image')) {
            return aiUrl;
        }
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

export async function GET(request) {
  const startTime = Date.now();
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await cleanupOldNews(2);

    // 1. Regional Smart Fetch
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '60', 10);
    
    const targetNews = (await fetchNewsSmart()).slice(0, limitParam);
    console.log(`🚀 Regional Focus: Processing ${targetNews.length} articles (Limit: ${limitParam})...`);
    
    let publishedCount = 0;
    const CHUNK_SIZE = 5;

    for (let i = 0; i < targetNews.length; i += CHUNK_SIZE) {
      if (Date.now() - startTime > 55000) break; // Timeout guard

      const chunk = targetNews.slice(i, i + CHUNK_SIZE);
      const results = await Promise.all(chunk.map(async (item) => {
        try {
          const slug = createSlug(item.title);
          if (await isNewsExists(slug)) return null;

          const rewritten = await rewriteWithAI(item.title, item.content);
          let imgUrl = item.image_url;
          if (!imgUrl) {
            imgUrl = await getImageUrl(rewritten.englishImagePrompt || rewritten.title, item.district);
          }

          const district = detectDistrict(rewritten.title + ' ' + rewritten.content, item.source);
          let priority = 0;
          if (district === 'garhwa') priority = 100;
          else if (district === 'palamu') priority = 80;

          const assetId = await uploadImageToSanity(imgUrl, rewritten.title);
          
          let highlights = [];
          if (Array.isArray(rewritten.highlights)) {
            highlights = rewritten.highlights;
          } else if (typeof rewritten.highlights === 'string') {
            highlights = [rewritten.highlights];
          }

          return await insertNews({
            title: rewritten.title,
            slug: slug + '-' + Math.random().toString(36).substring(7),
            content: rewritten.content,
            excerpt: rewritten.excerpt,
            image_url: assetId,
            category: detectCategory(rewritten.title + ' ' + rewritten.content),
            district: district,
            priority: priority,
            is_promoted: priority > 0,
            highlights: highlights,
            original_source: item.url,
            published_at: item.publishedAt || new Date().toISOString()
          });
        } catch (err) { return null; }
      }));

      publishedCount += results.filter(Boolean).length;
    }

    return NextResponse.json({
      success: true,
      published: publishedCount,
      timeTaken: `${(Date.now() - startTime) / 1000}s`
    });

  } catch (error) {
    console.error('AI Agent Fatal Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() { return NextResponse.json({}, { status: 200 }); }
