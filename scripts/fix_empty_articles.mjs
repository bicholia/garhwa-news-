
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.production.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function fillEmptyArticle(article) {
    console.log(`✍️ Filling content for: ${article.title}`);
    
    const prompt = `
    [STRICT IDENTITY: THINKINDIA.PRESS]
    You are a senior Investigative Journalist for "ThinkIndia.press" (Garhwa, Jharkhand). 
    Your goal is to write a high-quality news story based ONLY on a title.

    TITLE: ${article.title}
    
    TASK: This article is too short or empty. Write a complete, professional news story (3-4 paragraphs) in Hindi. 
    Ensure AdSense compliance (no other brands, original analysis, local touch).
    
    Return JSON: {"excerpt": "...", "body": "..."}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        await client.patch(article._id)
            .set({
                excerpt: data.excerpt,
                body: [
                    {
                        _type: 'block',
                        style: 'normal',
                        markDefs: [],
                        children: [{ _type: 'span', text: data.body, marks: [] }]
                    }
                ]
            })
            .commit();
        console.log(`✅ Fixed!`);
    } catch (err) {
        console.error(`❌ Error fixing ${article.title}:`, err.message);
    }
}

async function run() {
    console.log('🚀 Fixing all short/empty articles (up to 300 latest)...');
    const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...300]{_id, title, body}`);
    
    let fixCount = 0;
    for (const article of articles) {
        const text = article.body?.map(b => b.children?.map(c => c.text).join('')).join('\n') || '';
        if (text.length < 150) {
            await fillEmptyArticle(article);
            fixCount++;
        }
    }
    console.log(`✨ Total articles fixed: ${fixCount}`);
}

run();
