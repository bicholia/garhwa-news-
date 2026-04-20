import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

// --- Configuration ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const LOG_FILE = 'processed_urls.log';
let availableCategories = [];

// --- Utilities ---

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
        console.log(`🖼️  Processing Image: ${imageUrl}`);
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const asset = await client.assets.upload('image', buffer, {
            filename: `${createSlug(title)}.jpg`
        });
        
        return asset._id;
    } catch (error) {
        console.error('❌ Image upload failed:', error.message);
        return null;
    }
}

async function getCategories() {
    try {
        const categories = await client.fetch(`*[_type == "category"]{ _id, name, "slug": slug.current }`);
        return categories;
    } catch (e) {
        console.error('❌ Failed to fetch categories:', e.message);
        return [];
    }
}

function getCategoryRef(categorySlugOrName) {
    const target = categorySlugOrName.toLowerCase();
    const cat = availableCategories.find(c => 
        c.slug.toLowerCase() === target || 
        c.name.toLowerCase() === target
    );
    
    if (cat) return { _type: 'reference', _ref: cat._id };
    
    // Fallback to 'local' or first available
    const local = availableCategories.find(c => c.slug === 'local');
    return local ? { _type: 'reference', _ref: local._id } : null;
}

function isProcessed(url) {
    if (!fs.existsSync(LOG_FILE)) return false;
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    return content.includes(url);
}

function logProcessed(url) {
    fs.appendFileSync(LOG_FILE, `${url}\n`);
}

// --- Main Scraper Logic ---

async function extractLinks(url) {
    console.log(`🕵️‍♂️  Scanning page for news links: ${url}`);
    try {
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(html);
        const links = new Set();
        const baseUrl = new URL(url).origin;

        // 1. Standard Link Extraction with broader patterns
        const allLinks = $('a').get();
        console.log(`🔎 Found ${allLinks.length} total links on page.`);
        
        allLinks.forEach((el, idx) => {
            const href = $(el).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, baseUrl).href;
                    // Improved article detection regex for universal scraping
                    const articlePatterns = [
                        /[0-9]{7,}\.html/i, // Generic numeric IDs (Jagran, etc.)
                        /\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\//, // Generic dated format (NYT, WP, etc.)
                        /news\/[^\/]+/i, // Generic news path
                        /story\/[^\/]+/i, // Generic story path
                        /article\/[^\/]+/i, // Generic article path
                        /post\/[^\/]+/i, // Generic post path
                        /bhaskar\.com\/.*[0-9]{7,}/ // Bhaskar specific
                    ];

                    const isArticle = articlePatterns.some(pattern => absoluteUrl.match(pattern));
                    const isImage = absoluteUrl.match(/\.(png|jpg|jpeg|gif|webp|svg|mp4|mp3|pdf|zip|gz)(\?.*)?$/i);
                    const isExcluded = absoluteUrl.includes('/subscription/') || 
                                     absoluteUrl.includes('/tag/') || 
                                     absoluteUrl.includes('/category/') || 
                                     absoluteUrl.includes('/author/') ||
                                     absoluteUrl.includes('/privacy/') ||
                                     absoluteUrl.includes('/contact/') ||
                                     isImage;

                    if (isArticle && !isExcluded) {
                        links.add(absoluteUrl);
                    }
                } catch (e) {}
            }
        });

        // 2. Deep Regex Search for hidden links
        if (links.size < 5) {
            const htmlString = $.html();
            const deepPatterns = [
                /\/(news|national|state|world|city|district|jharkhand)[^"'>]+-[0-9]{7,}\.html/g,
                // Avoid capturing images in deep dated patterns
                /\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[^"'>\.]+\.html/g 
            ];
            
            for (const pattern of deepPatterns) {
                const matches = htmlString.matchAll(pattern);
                for (const match of matches) {
                    try { 
                        const absoluteUrl = new URL(match[0], baseUrl).href;
                        const isImage = absoluteUrl.match(/\.(png|jpg|jpeg|gif|webp|svg|mp4|mp3|pdf)(\?.*)?$/i);
                        if (!isImage) {
                            links.add(absoluteUrl);
                        }
                    } catch(e) {}
                }
            }
        }

        return Array.from(links);
    } catch (error) {
        console.error('❌ Link extraction failed:', error.message);
        return [];
    }
}

async function processArticle(articleUrl) {
    if (isProcessed(articleUrl)) {
        console.log(`⏭️  Skipping already processed article: ${articleUrl}`);
        return false;
    }

    console.log(`\n📄  Processing Article: ${articleUrl}`);
    try {
        const { data: html } = await axios.get(articleUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        
        const catList = availableCategories.map(c => `${c.name} (${c.slug})`).join(', ');

        const prompt = `You are a professional news scraper and rewrite engine for "Think India". 
Target HTML Sample:
${html.substring(0, 30000)}

Task:
1. Extract the main news Title, primary high-resolution Image URL, and main Body.
2. Rewrite for "Think India" (professional, unbiased, engaging Hindi).
3. The content MUST be around 250-400 words.
4. Categorize based on this list: ${catList}. Return ONLY the slug.

Response Format (Strict JSON):
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "imageUrl": "...",
  "categorySlug": "..."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        // Robust JSON extraction
        let articleData;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found in AI response');
            articleData = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error('❌ AI JSON Parse Error:', e.message, '\nRaw response:', text);
            return false;
        }

        if (!articleData.imageUrl || !articleData.title || !articleData.content) {
            throw new Error('Incomplete data from AI');
        }

        // 🖼️  Handle Image
        const assetId = await uploadImageToSanity(articleData.imageUrl, articleData.title);
        if (!assetId) throw new Error('Image upload failed');

        // 📂  Handle Category
        const categoryRef = getCategoryRef(articleData.categorySlug);

        // 🚀  Publish to Sanity
        const doc = {
            _type: 'article',
            title: articleData.title,
            slug: { 
                _type: 'slug', 
                current: createSlug(articleData.title) + '-' + Math.random().toString(36).substring(7) 
            },
            excerpt: articleData.excerpt,
            featureImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            },
            body: [
                {
                    _type: 'block',
                    children: [{ _type: 'span', text: articleData.content }]
                }
            ],
            district: 'jharkhand', 
            publishedAt: new Date().toISOString(),
            source_url: articleUrl
        };

        if (categoryRef) doc.category = categoryRef;

        const created = await client.create(doc);
        console.log(`✅  Successfully Published: ${articleData.title} (#${created._id})`);
        
        logProcessed(articleUrl);
        return true;
    } catch (error) {
        if (error.message.includes('429') || error.message.includes('Quota')) {
            console.log(`⏳ Rate limit hit. Waiting for 60s...`);
            await new Promise(r => setTimeout(r, 60000));
            return processArticle(articleUrl); 
        }
        console.error(`❌  Failed to process ${articleUrl}:`, error.message);
        return false;
    }
}

async function run(targetUrl) {
    if (!targetUrl) {
        console.log('Usage: node scripts/bulk_ai_scraper.mjs <URL>');
        return;
    }

    console.log('🚀  Starting Think India Bulk AI Scraper...');
    console.log('==========================================');

    // 1. Fetch Categories
    process.stdout.write('📂 Fetching categories from Sanity... ');
    availableCategories = await getCategories();
    console.log(`Done (${availableCategories.length} found)`);

    // 2. Extract Links
    const links = await extractLinks(targetUrl);
    // Limit to 10 for bulk, but slice for safety initial run
    const limitedLinks = links.slice(0, 10);
    console.log(`✅  Found ${links.length} potential articles. Processing top ${limitedLinks.length}...`);

    let successCount = 0;
    for (const link of limitedLinks) {
        const success = await processArticle(link);
        if (success) successCount++;
        
        if (success) {
            console.log('⏳ Waiting 15 seconds before next request...');
            await new Promise(r => setTimeout(r, 15000));
        }
    }

    console.log('\n==========================================');
    console.log(`🏁  Batch Complete! Total Success: ${successCount}/${limitedLinks.length}`);
}

const urlArg = process.argv[2];
run(urlArg);

