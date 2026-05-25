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
    console.log('Fetching all old news (imported on or before May 23)...');
    // Fetch all articles imported on or before May 23
    const idsToDelete = await client.fetch(`*[_type == "article" && publishedAt < "2026-05-24T00:00:00Z"]._id`);
    
    if (idsToDelete.length === 0) {
        console.log('No articles found to delete.');
        return;
    }

    console.log(`Found ${idsToDelete.length} articles to delete. Executing deletion...`);
    
    let transaction = client.transaction();
    idsToDelete.forEach(id => {
        transaction.delete(id);
    });
    
    await transaction.commit();
    console.log(`✅ Successfully deleted ${idsToDelete.length} old articles!`);
}

run();
