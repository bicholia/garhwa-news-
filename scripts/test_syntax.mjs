
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

const rawContent = `test`;

async function seedViralArticles() {
    console.log('🚀 Starting Seeding...');
    try {
        const imageAsset = await client.fetch(`*[_type == "sanity.imageAsset"][0]{_id}`);
        console.log('Image asset:', imageAsset);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

seedViralArticles();
