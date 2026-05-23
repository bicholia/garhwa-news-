import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@sanity/client';
import Parser from 'rss-parser';
import { scrubBrandNames } from '../lib/safety.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const parser = new Parser();

// RSS Feeds in Hindi (Dainik Jagran, Google News Hindi, Prabhat Khabar)
const RSS_SOURCES = [
  { name: 'Garhwa', url: 'https://news.google.com/rss/search?q=Garhwa+Jharkhand+News&hl=hi&gl=IN&ceid=IN:hi', district: 'garhwa' },
  { name: 'Palamu', url: 'https://news.google.com/rss/search?q=Palamu+Jharkhand+News&hl=hi&gl=IN&ceid=IN:hi', district: 'palamu' },
  { name: 'Jharkhand', url: 'https://news.google.com/rss/search?q=Jharkhand+News&hl=hi&gl=IN&ceid=IN:hi', district: 'jharkhand' },
  { name: 'National', url: 'https://news.google.com/rss/search?q=India+News&hl=hi&gl=IN&ceid=IN:hi', district: 'india' },
];

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s\-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// Category guessing from title/content
function guessCategory(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('चुनाव') || text.includes('राजनीति') || text.includes('नेता') || text.includes('मुख्यमंत्री') || text.includes('विधायक') || text.includes('हेमंत') || text.includes('बीजेपी') || text.includes('कांग्रेस')) {
        return 'category-politics';
    }
    if (text.includes('हत्या') || text.includes('मर्डर') || text.includes('चोरी') || text.includes('पुलिस') || text.includes('गिरफ्तार') || text.includes('अपराध') || text.includes('गोली')) {
        return 'category-crime';
    }
    if (text.includes('शिक्षा') || text.includes('स्कूल') || text.includes('कॉलेज') || text.includes('परीक्षा') || text.includes('रिजल्ट')) {
        return 'category-education';
    }
    if (text.includes('खेल') || text.includes('क्रिकेट') || text.includes('टूर्नामेंट') || text.includes('धोनी')) {
        return 'category-sports';
    }
    if (text.includes('मौसम') || text.includes('बारिश') || text.includes('गर्मी') || text.includes('ठंड') || text.includes('धूप') || text.includes('तापमान')) {
        return 'category-weather';
    }
    if (text.includes('नौकरी') || text.includes('भर्ती') || text.includes('रोजगार') || text.includes('नौकरियां')) {
        return 'category-jobs';
    }
    
    return 'category-local'; // Default local news category
}

async function uploadImageToSanity(imageUrl, title) {
    if (!imageUrl) return null;
    try {
        console.log(`🖼️ Downloading image for upload: ${imageUrl.substring(0, 80)}...`);
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!response.ok) {
            console.warn(`⚠️ Failed to download image from ${imageUrl}: ${response.statusText}`);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`☁️ Uploading downloaded image to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: `${createSlug(title)}-${Date.now()}.jpg`
        });
        console.log(`✅ Image uploaded to Sanity! Asset ID: ${asset._id}`);
        return asset._id;
    } catch (error) {
        console.error('⚠️ Error uploading image to Sanity:', error.message);
        return null;
    }
}

async function rewriteWithAI(title, content) {
    const geoPrompt = `You are a local news editor in Jharkhand. 
Rewrite this news in professional Hindi, present tense. 
Context: ${title} - ${content}

JSON Format:
{
    "title": "Clean Hindi Title",
    "excerpt": "Short summary",
    "content": "Full article (3-4 paragraphs)",
    "englishImagePrompt": "Description for AI image generator"
}`;

    const models = ["openai", "llama", "mistral"];
    for (const model of models) {
        try {
            console.log(`🤖 Attempting rewrite with Pollinations model: ${model}...`);
            const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}?model=${model}&json=true`, {
                signal: AbortSignal.timeout(8000)
            });
            if (res.ok) {
                const text = await res.text();
                const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
                if (json.title && json.content) {
                    console.log(`✅ Rewrite success using model: ${model}`);
                    return {
                        title: scrubBrandNames(json.title),
                        excerpt: scrubBrandNames(json.excerpt || ''),
                        content: scrubBrandNames(json.content),
                        englishImagePrompt: json.englishImagePrompt || json.title
                    };
                }
            }
        } catch (e) {
            console.warn(`⚠️ Model ${model} failed: ${e.message}`);
        }
    }
    
    // Fallback if AI rewrites fail
    console.log(`⚠️ All rewrite models failed or rate-limited. Using direct RSS text as fallback.`);
    return {
        title: scrubBrandNames(title),
        excerpt: scrubBrandNames(content.substring(0, 150) + "..."),
        content: scrubBrandNames(content || title),
        englishImagePrompt: title
    };
}

async function checkNewsExists(slug) {
    try {
        const count = await client.fetch(`count(*[_type == "article" && slug.current == $slug])`, { slug });
        return count > 0;
    } catch (e) {
        console.error('Error checking article slug:', e.message);
        return false;
    }
}

async function fetchArticlesFromRSS() {
    let articles = [];
    for (const source of RSS_SOURCES) {
        try {
            console.log(`📡 Fetching RSS from: ${source.name}...`);
            const feed = await parser.parseURL(source.url);
            articles = [...articles, ...feed.items.map(i => ({
                title: i.title,
                content: i.contentSnippet || i.content || '',
                url: i.link,
                source: source.name,
                district: source.district,
                publishedAt: i.pubDate
            }))];
        } catch (e) {
            console.error(`❌ Error fetching ${source.name} RSS: ${e.message}`);
        }
    }
    
    // Filter and deduplicate
    const unique = articles.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);
    return unique.filter(i => !i.title.toLowerCase().includes('flashback'));
}

async function publishNewArticles() {
    console.log('\n--- 1. FETCHING AND PUBLISHING NEW ARTICLES ---');
    const targetNews = await fetchArticlesFromRSS();
    console.log(`📰 Total unique RSS candidates fetched: ${targetNews.length}`);
    
    let publishedCount = 0;
    for (const item of targetNews) {
        if (publishedCount >= 10) {
            console.log('🛑 Reached maximum of 10 new articles for this batch.');
            break;
        }

        const baseSlug = createSlug(item.title);
        const finalSlug = `${baseSlug}-${Math.random().toString(36).substring(7)}`;

        if (await checkNewsExists(baseSlug)) {
            console.log(`⏭️ News with similar slug already exists, skipping: ${item.title.substring(0, 50)}...`);
            continue;
        }

        console.log(`\n📝 Processing item [${publishedCount + 1}]: "${item.title.substring(0, 60)}..."`);
        
        // Rewrite
        const rewritten = await rewriteWithAI(item.title, item.content);
        
        // Generate Image URL (using image.pollinations.ai direct endpoint)
        const seed = Math.floor(Math.random() * 1000000);
        const imgPrompt = `Professional news photojournalism coverage image about: ${rewritten.englishImagePrompt || item.title}, realistic, cinematic lighting, 16:9 aspect ratio`;
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=800&height=450&nologo=true&seed=${seed}`;
        
        // Upload image
        const assetId = await uploadImageToSanity(imgUrl, rewritten.title);
        
        // Category
        const categoryId = guessCategory(rewritten.title, rewritten.content);
        
        // Document
        const doc = {
            _type: 'article',
            title: rewritten.title,
            slug: { _type: 'slug', current: finalSlug },
            excerpt: rewritten.excerpt,
            body: [
                {
                    _type: 'block',
                    style: 'normal',
                    markDefs: [],
                    children: [{ _type: 'span', text: rewritten.content, marks: [] }]
                }
            ],
            category: { _type: 'reference', _ref: categoryId },
            author: { _type: 'reference', _ref: 'author-admin' },
            district: item.district,
            publishedAt: new Date().toISOString(),
        };

        if (assetId) {
            doc.featureImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            };
        }

        try {
            const created = await client.create(doc);
            console.log(`✅ Successfully Published to Sanity! Document ID: ${created._id}`);
            publishedCount++;
        } catch (err) {
            console.error('❌ Failed to save document to Sanity:', err.message);
        }
        
        // Pause to avoid hitting rate limits
        await new Promise(r => setTimeout(r, 3000));
    }
}

async function fixMissingImagesForExisting() {
    console.log('\n--- 2. UPDATING EXISTING ARTICLES MISSING IMAGES ---');
    console.log('🔍 Querying articles with missing feature images...');
    
    try {
        const query = `*[_type == "article" && (!defined(featureImage) || !defined(featureImage.asset))] | order(publishedAt desc)[0...30]`;
        const articles = await client.fetch(query);
        console.log(`Found ${articles.length} articles that need images.`);
        
        let fixedCount = 0;
        for (const article of articles) {
            console.log(`\n🛠️ Adding image for: "${article.title}"`);
            
            // Build a descriptive prompt based on the article title
            const seed = Math.floor(Math.random() * 1000000);
            const imgPrompt = `Realistic news photo, high-quality photojournalism: ${article.title}, 16:9 aspect ratio`;
            const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=800&height=450&nologo=true&seed=${seed}`;
            
            const assetId = await uploadImageToSanity(imgUrl, article.title);
            
            if (assetId) {
                await client.patch(article._id)
                    .set({
                        featureImage: {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: assetId }
                        }
                    })
                    .commit();
                console.log(`✅ Successfully updated article with image!`);
                fixedCount++;
            } else {
                console.warn(`❌ Failed to update image for article.`);
            }
            
            // Pause between updates
            await new Promise(r => setTimeout(r, 3000));
        }
        
        console.log(`✨ Finished updating images! Total articles updated: ${fixedCount}`);
    } catch (e) {
        console.error('❌ Error during image updates:', e.message);
    }
}

async function main() {
    console.log('🚀 Running News Auto-Publish and Image-Updater Service...');
    console.log('========================================================');
    
    // Part 1: Publish new articles from RSS
    await publishNewArticles();
    
    // Part 2: Fix missing images in all articles
    await fixMissingImagesForExisting();
    
    console.log('========================================================');
    console.log('🏁 Auto-Publish and Image-Updater Service complete!');
}

main().catch(console.error);
