import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function run() {
    try {
        const query = `*[_type == "article"] | order(_createdAt desc)[0...3]`;
        const articles = await client.fetch(query);
        console.log(JSON.stringify(articles, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
