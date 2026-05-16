import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function inspectRecentNews() {
    console.log('🔍 Fetching recent 200 articles...');
    const articles = await client.fetch(`*[_type == "article"] | order(_createdAt desc)[0...200]{ _id, title, _createdAt }`);
    articles.forEach((a, i) => {
        console.log(`${i+1}. [${a._id}] [${a._createdAt}] ${a.title}`);
    });
}

inspectRecentNews();
