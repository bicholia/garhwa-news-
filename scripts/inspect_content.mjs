
import { createClient } from '@sanity/client';
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

async function run() {
    console.log('🧐 Inspecting latest articles for content length...');
    const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...100]{_id, title, body}`);
    
    let shortCount = 0;
    for (const article of articles) {
        const text = article.body?.map(b => b.children?.map(c => c.text).join('')).join('\n') || '';
        if (text.length < 100) {
            console.log(`[SHORT] ${article.title} (Length: ${text.length})`);
            shortCount++;
        }
    }
    console.log(`Total short/empty articles: ${shortCount}`);
}

run();
