import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Parser from 'rss-parser';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const NEWS_SOURCES = [
    'https://www.prabhatkhabar.com/rss/news/jharkhand/garhwa',
    'https://www.livehindustan.com/jharkhand/garhwa/feed.rss',
    'https://news.google.com/rss/search?q=Garhwa+News&hl=hi&gl=IN&ceid=IN:hi'
];

function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
}

export async function GET(request) {
    // Only allow if specific secret is provided or via a simple check
    const { searchParams } = new URL(request.url);
    const manual = searchParams.get('manual');

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
    }

    try {
        console.log('🤖 AI Agent Starting Live Sync...');
        let allNews = [];
        
        for (const source of NEWS_SOURCES) {
            try {
                const feed = await parser.parseURL(source);
                allNews = [...allNews, ...feed.items.slice(0, 3)];
            } catch (e) {
                console.error(`Error fetching ${source}:`, e.message);
            }
        }

        const uniqueNews = allNews.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i).slice(0, 5);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        let successCount = 0;

        for (const item of uniqueNews) {
            // Duplicate Check
            const existing = await client.fetch(`*[_type == "article" && title == $title][0]`, { title: item.title });
            if (existing) continue;

            const prompt = `Rewrite this news for 'ThinkIndia.press' in Hindi. Professional tone.
            Title: ${item.title}
            Context: ${item.contentSnippet || item.content}
            
            Return JSON: {"title": "...", "excerpt": "...", "content": "..."}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace === -1) continue;
            
            const aiResult = JSON.parse(text.substring(firstBrace, lastBrace + 1));

            await client.create({
                _type: 'article',
                title: aiResult.title,
                slug: { _type: 'slug', current: createSlug(aiResult.title) },
                excerpt: aiResult.excerpt,
                body: [{ _type: 'block', children: [{ _type: 'span', text: aiResult.content }] }],
                district: 'jharkhand',
                publishedAt: new Date().toISOString()
            });
            successCount++;
        }

        return NextResponse.json({ success: true, new_articles: successCount });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
