import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@sanity/client';
import Parser from 'rss-parser';
import { isNewsExists } from '../lib/db.js';

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

const parser = new Parser();

const RSS_SOURCES = [
  { name: 'Garhwa', url: 'https://news.google.com/rss/search?q=Garhwa+Jharkhand+News&hl=hi&gl=IN&ceid=IN:hi', district: 'garhwa' },
  { name: 'Palamu', url: 'https://news.google.com/rss/search?q=Palamu+Jharkhand+News&hl=hi&gl=IN&ceid=IN:hi', district: 'palamu' },
  { name: 'Jharkhand', url: 'https://news.google.com/rss/search?q=Jharkhand+Breaking+News&hl=hi&gl=IN&ceid=IN:hi', district: 'jharkhand' },
  { name: 'Love/Life', url: 'https://news.google.com/rss/search?q=Relationships+Lifestyle+Tips&hl=hi&gl=IN&ceid=IN:hi', district: 'jharkhand' }
];

async function fetchMoreNews() {
    let articles = [];
    for (const source of RSS_SOURCES) {
        try {
            console.log(`📡 Fetching: ${source.name}...`);
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
            console.error(`Error ${source.name}: ${e.message}`);
        }
    }
    // Deduplicate and filter archives
    const unique = articles.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);
    return unique.filter(i => !i.title.toLowerCase().includes('flashback'));
}

function createSlug(title) {
  return title.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100);
}

async function uploadImageToSanity(imageUrl, title) {
    if (!imageUrl) return null;
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(arrayBuffer), {
            filename: `${createSlug(title)}.jpg`
        });
        return asset._id;
    } catch (error) {
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
            const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(geoPrompt)}?model=${model}&json=true`);
            const text = await res.text();
            const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
            if (json.title && json.content) return json;
        } catch (e) {}
    }
    return { title, excerpt: content.substring(0, 100), content, englishImagePrompt: title };
}

async function run() {
    const targetNews = await fetchMoreNews();
    console.log(`📰 Total unique candidates: ${targetNews.length}`);
    
    let count = 0;
    for (const item of targetNews) {
        if (count >= 30) break;

        const baseSlug = createSlug(item.title);
        if (await isNewsExists(baseSlug)) continue;
        const finalSlug = baseSlug + '-' + Math.random().toString(36).substring(7);

        console.log(`📝 [${count+1}/30] ${item.title.substring(0, 50)}...`);
        const rewritten = await rewriteWithAI(item.title, item.content);
        
        // Image generator with fallback to a direct stock image if pollinations fails metadata check
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(rewritten.englishImagePrompt || item.title)}?width=800&height=450&nologo=true`;
        const assetId = await uploadImageToSanity(imgUrl, rewritten.title);

        await client.create({
            _type: 'article',
            title: rewritten.title,
            slug: { _type: 'slug', current: finalSlug },
            excerpt: rewritten.excerpt,
            body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: rewritten.content }] }],
            category: { _type: 'reference', _ref: 'category-local' },
            author: { _type: 'reference', _ref: 'author-admin' },
            district: item.district,
            publishedAt: new Date().toISOString(),
            featureImage: assetId ? { _type: 'image', asset: { _type: 'reference', _ref: assetId } } : undefined
        });

        console.log(`✅ Published: ${rewritten.title.substring(0, 40)}`);
        count++;
    }
}

run();
