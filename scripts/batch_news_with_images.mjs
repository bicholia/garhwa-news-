import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Parser from 'rss-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // assuming node-fetch is available, else native fetch

dotenv.config({ path: '.env.local' });

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  }
});
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
  'https://www.prabhatkhabar.com/rss/news/jharkhand/palamu',
  'https://www.livehindustan.com/jharkhand/garhwa/feed.rss',
  'https://news.google.com/rss/search?q=Jharkhand&hl=hi&gl=IN&ceid=IN:hi',
  'https://www.jagran.com/rss/jharkhand_state-news-hindi.xml',
  'https://www.bhaskar.com/rss/jharkhand/garhwa/',
  'https://www.etvbharat.com/rss/jharkhand/garhwa'
];

// Helper to extract image URL from RSS item
function extractImageUrl(item) {
    if (item['media:content'] && item['media:content'].$) {
        return item['media:content'].$.url;
    }
    if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image')) {
        return item.enclosure.url;
    }
    // Try to extract from content <img> tags
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
    }
    return null;
}

// Generate image using Pollinations as fallback
async function generateImage(title) {
    try {
        const prompt = `${title} related to Garhwa Palamu Jharkhand India, news photograph, high quality, 16:9`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
        return imageUrl;
    } catch (error) {
        console.error('Image generation error:', error);
        return 'https://images.unsplash.com/photo-1495020689064-9584e5395d39?w=1200';
    }
}

// Upload Image URL to Sanity
async function uploadImageToSanity(imageUrl, title) {
    try {
        console.log(`🖼️ Downloading image from: ${imageUrl}`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`☁️ Uploading image to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: `${createSlug(title)}.jpg`
        });
        
        return asset._id;
    } catch (error) {
        console.error('Error uploading image to Sanity:', error.message);
        return null; // Should handle fallback gracefully if this fails
    }
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// Get category reference from Sanity based on heuristics
async function getCategoryRef(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    let categorySlug = 'category-local';
    
    if (text.includes('क्राइम') || text.includes('हत्या') || text.includes('चोरी') || text.includes('पुलिस') || text.includes('गिरफ्तार') || text.includes('अपराध') || text.includes('रेप') || text.includes('मर्डर') || text.includes('जहर')) {
      categorySlug = 'crime';
    } else if (text.includes('नौकरी') || text.includes('वैकेंसी') || text.includes('भर्ती') || text.includes('रोजगार')) {
      categorySlug = 'jobs';
    } else if (text.includes('शिक्षा') || text.includes('स्कूल') || text.includes('कॉलेज') || text.includes('परीक्षा') || text.includes('रिजल्ट')) {
      categorySlug = 'education';
    } else if (text.includes('खेल') || text.includes('क्रिकेट') || text.includes('फुटबॉल') || text.includes('टूर्नामेंट')) {
      categorySlug = 'sports';
    } else if (text.includes('मौसम') || text.includes('बारिश') || text.includes('गर्मी') || text.includes('ठंड') || text.includes('तूफान')) {
      categorySlug = 'weather';
    } else if (text.includes('चुनाव') || text.includes('राजनीति') || text.includes('नेता') || text.includes('मुख्यमंत्री') || text.includes('विधायक') || text.includes('संसद') || text.includes('भगत')) {
      categorySlug = 'politics';
    } else if (text.includes('प्रेम') || text.includes('प्रेमी') || text.includes('प्रेमिका') || text.includes('प्यार') || text.includes('लव')) {
      categorySlug = 'love-relationships';
    } else {
      categorySlug = 'local';
    }

    try {
        const cat = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: categorySlug });
        if (cat) return { _type: 'reference', _ref: cat._id };
        
        // Handle fallback if category doesn't exist
        const defaultCat = await client.fetch(`*[_type == "category"][0]`);
        return defaultCat ? { _type: 'reference', _ref: defaultCat._id } : null;
    } catch (e) {
        return null;
    }
}

async function runBatch() {
    console.log('🌟 NR Daily News: AI AutoBot Batch Writer (With Images)🌟');
    console.log('----------------------------------------------------');

    let allNews = [];
    
    console.log('📡 Step 1: अलग-अलग सोर्स से ताज़ा खबरें ढूंढ रहे हैं...');
    for (const source of NEWS_SOURCES) {
        try {
            const feed = await parser.parseURL(source);
            const items = feed.items.slice(0, 20); 
            allNews = [...allNews, ...items];
        } catch (e) {
            console.log(`Error fetching ${source}:`, e.message);
        }
    }

    const uniqueNews = allNews.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i).slice(0, 60);
    
    if (uniqueNews.length === 0) {
        console.log('❌ कोई नई खबर नहीं मिली।');
        return;
    }

    console.log(`✅ कुल ${uniqueNews.length} ताज़ा खबरें मिली हैं!`);
    console.log('🤖 Step 2: Gemini 2.5 Flash अब इन खबरों को लिख रहा है और Image Process कर रहा है...');
    console.log('----------------------------------------------------');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let successCount = 0;

    for (let i = 0; i < uniqueNews.length; i++) {
        const item = uniqueNews[i];
        try {
            console.log(`\n>[${i+1}/${uniqueNews.length}] प्रोसेस हो रहा है: "${item.title}"`);
            
            // Generate Text
            const prompt = `Rewrite this news for 'NR Daily News' in Hindi. It should be engaging, informative, and around 150-200 words.
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
            
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) {
                console.log(`⚠️ AI Response format valid नहीं है, स्किप कर रहे हैं।`);
                continue;
            }
            const jsonStr = text.substring(firstBrace, lastBrace + 1);
            const aiResult = JSON.parse(jsonStr);

            // Fetch or Generate Image
            let sourceImageUrl = extractImageUrl(item);
            if (sourceImageUrl) {
                console.log(`📍 RSS फ़ीड से ओरिजिनल इमेज मिल गई है: ${sourceImageUrl}`);
            } else {
                console.log(`🪄 कोई ओरिजिनल इमेज नहीं मिली, AI से नई इमेज बना रहे हैं...`);
                sourceImageUrl = await generateImage(aiResult.title);
            }

            // Upload Image to Sanity
            const sanityImageAssetId = await uploadImageToSanity(sourceImageUrl, aiResult.title);
            
            if (!sanityImageAssetId) {
                console.log(`⚠️ इमेज अपलोड फेल हुआ, इस खबर को स्किप कर रहे हैं।`);
                continue; // Skip if no image
            }

            // Detect Category
            const categoryRef = await getCategoryRef(aiResult.title, aiResult.content);

            // Publish to Sanity
            const doc = {
                _type: 'article',
                title: aiResult.title,
                slug: { 
                    _type: 'slug', 
                    current: createSlug(aiResult.title) + '-' + Math.random().toString(36).substring(7) 
                },
                excerpt: aiResult.excerpt,
                featureImage: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: sanityImageAssetId
                    }
                },
                body: [
                    {
                        _type: 'block',
                        children: [{ _type: 'span', text: aiResult.content }]
                    }
                ],
                district: 'jharkhand', // Default fallback
                publishedAt: new Date().toISOString()
            };
            
            if (categoryRef) {
                doc.category = categoryRef;
            }

            await client.create(doc);
            console.log(`✅ सफलता! पब्लिश: ${aiResult.title}`);
            successCount++;

            // Wait 3 seconds to avoid rate limits
            await new Promise(r => setTimeout(r, 3000));

        } catch (err) {
            console.log(`❌ एरर (खबर ${i+1}):`, err.message);
        }
    }

    console.log('----------------------------------------------------');
    console.log(`🎉 Batch Complete! वेबसाइट पर ${successCount} नई सज-धज कर खबरें पब्लिश हो चुकी हैं।`);
}

runBatch();
