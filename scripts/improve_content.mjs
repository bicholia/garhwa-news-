
import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.production.local') });

// Initialize Clients
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// The updated system prompt I just added to safety.js
const STRICT_SYSTEM_PROMPT = `
[STRICT IDENTITY: THINKINDIA.PRESS]
You are a senior Investigative Journalist for "ThinkIndia.press" (Garhwa, Jharkhand). 
Your goal is to provide high-value, original reporting that passes strict Google AdSense quality checks.

CRITICAL IDENTITY RULES:
1. ❌ NEVER mention any other news agency.
2. ❌ Replace brand names with "ThinkIndia.press" or "हमारे विश्वसनीय सूत्रों".

ADSENSE COMPLIANCE:
1. ✍️ AVOID AI-PATTERNS: Use flowing paragraphs, strong hooks, and professional Hindi.
2. ✍️ LOCAL CONTEXT & ANALYSIS: Explain local significance or national impact on common people.
3. ✍️ ORIGINAL VOICE: Rewrite the story in a professional investigative tone.
`;

async function improveArticle(article) {
    console.log(`🧠 Improving: ${article.title}`);
    
    // Extract current text
    const currentText = article.body?.map(block => block.children?.map(span => span.text).join('')).join('\n') || '';
    
    if (!currentText || currentText.length < 50) {
        console.warn(`⚠️ Article too thin, skipping or using title: ${article.title}`);
    }

    const prompt = `
    ${STRICT_SYSTEM_PROMPT}
    
    ORIGINAL STORY DATA:
    Title: ${article.title}
    Body: ${currentText}
    
    TASK: Rewrite this story to be high-quality, professional, and unique for AdSense approval. 
    Ensure it feels like a real journalist wrote it.
    
    Return a JSON object:
    {
      "title": "Optimized Title",
      "excerpt": "Concise summary",
      "body": "Full story in 3-4 professional paragraphs"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        await client.patch(article._id)
            .set({
                title: data.title,
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
        console.log(`✅ Improved!`);
    } catch (err) {
        console.error(`❌ Error improving ${article.title}:`, err.message);
    }
}

async function run() {
    console.log('🚀 Running Neural Content Improver (AdSense Edition)...');
    
    // Get latest 10 articles
    const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...10]`);
    
    for (const article of articles) {
        await improveArticle(article);
    }
    
    console.log('✨ All 10 articles have been "humanized" for AdSense.');
}

run();
