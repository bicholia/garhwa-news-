
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
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkSanity() {
    const slug = 'private-assistant-murder-garhwa-incident-tweets-and-iran-threat-vvosko';
    const article = await client.fetch(`*[_type == "article" && slug.current == $slug][0]{_id, title, excerpt, featureImage, "category": category->name}`, { slug });
    console.log('Sanity Article:', JSON.stringify(article, null, 2));
}

checkSanity();
