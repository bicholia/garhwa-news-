import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    dotenv.config({ path: join(__dirname, '../.env.production.local') });
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function bringToFront() {
    console.log('🔍 Searching for Rupesh and Sneha news...');

    // Query for the specific Rupesh and Sneha articles by ID
    const query = `*[_id in ["news-rupesh-v4-ai-story", "news-garhwa-ramna-casteism"]]`;
    const articles = await client.fetch(query);
    
    console.log(`Found ${articles.length} articles matching the criteria.`);

    if (articles.length === 0) {
        console.log('❌ No Rupesh/Sneha articles found in the database. Are you sure they are published?');
        return;
    }

    let updatedCount = 0;
    for (const article of articles) {
        // Set date slightly into the future so it always stays on top today
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 5); 

        try {
            await client.patch(article._id)
                .set({
                    featured: true,
                    isBreaking: true,
                    publishedAt: futureDate.toISOString()
                })
                .commit();
            console.log(`✅ Brought to front: ${article.title}`);
            updatedCount++;
        } catch (err) {
            console.error(`❌ Failed to update ${article._id}:`, err.message);
        }
    }

    console.log(`✨ Successfully pinned ${updatedCount} articles to the very front.`);
}

bringToFront();
