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

function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
}

async function updateDates() {
    console.log('🔍 Fetching all articles to update dates...');
    const query = `*[_type == "article" && !(_id in path("drafts.**"))]`;
    const articles = await client.fetch(query);
    
    console.log(`Found ${articles.length} articles to update.`);
    
    const may21 = new Date('2026-05-21T00:00:00.000Z');
    const may30 = new Date('2026-05-30T23:59:59.000Z');
    
    let updatedCount = 0;
    
    for (const article of articles) {
        let newDate;
        
        // Sneha-Rupesh Casteism Story -> 3 May
        if (article._id === 'news-garhwa-ramna-casteism') {
            newDate = new Date('2026-05-03T10:00:00.000Z').toISOString();
        } 
        // Rupesh AI Project -> 25 April
        else if (article._id === 'news-rupesh-v4-ai-story') {
            newDate = new Date('2026-04-25T10:00:00.000Z').toISOString();
        }
        // Others -> Random between 21 May and 30 May
        else {
            newDate = getRandomDate(may21, may30);
        }
        
        try {
            await client.patch(article._id)
                .set({ publishedAt: newDate })
                .commit();
            console.log(`✅ Updated ${article._id} to ${newDate.substring(0, 10)}`);
            updatedCount++;
        } catch (err) {
            console.error(`❌ Failed to update ${article._id}:`, err.message);
        }
    }
    
    console.log(`✨ Successfully updated dates for ${updatedCount} articles.`);
}

updateDates();
