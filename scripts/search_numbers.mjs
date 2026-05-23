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
        console.log("🔍 Searching Sanity for '190' or '4008'...");
        const query = `*[_type == "article" && (title match "*190*" || title match "*4008*" || body[].children[].text match "*190*" || body[].children[].text match "*4008*")] { _id, title, excerpt }`;
        const results = await client.fetch(query);
        console.log(`Found ${results.length} matching articles:`);
        results.forEach(r => {
            console.log(`ID: ${r._id}`);
            console.log(`Title: ${r.title}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    }
}
run();
