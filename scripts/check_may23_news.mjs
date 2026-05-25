import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function run() {
    const articles = await client.fetch(`*[_type == "article" && publishedAt < "2026-05-24T00:00:00Z"]{ _id, title, publishedAt }`);
    console.log(`Found ${articles.length} articles older than May 24.`);
    
    // Log the first 5 to see what they are
    console.log(articles.slice(0, 5));
}
run();
