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
    console.log('Fetching recent articles without images...');
    const docs = await client.fetch(`*[_type == "article" && !defined(featureImage)][0...10]`);
    console.log(`Found ${docs.length} articles to delete.`);
    for (const doc of docs) {
        console.log(`Deleting: ${doc.title}`);
        await client.delete(doc._id);
    }
    console.log('Done.');
}

run();
