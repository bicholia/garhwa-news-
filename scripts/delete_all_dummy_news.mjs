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
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function deleteAllArticles() {
    console.log('Fetching all articles...');
    // We will keep 'Rupesh' or 'Garhdevi' news if any, but delete the rest.
    const query = `*[_type == "article" && !(_id in path("drafts.**"))]`;
    const articles = await client.fetch(query);
    
    console.log(`Found ${articles.length} articles to evaluate.`);
    
    let deletedCount = 0;
    for (const article of articles) {
        // Keep the exclusive Rupesh AI news we just published, delete rest
        if (article.slug && article.slug.current && article.slug.current.includes('rupesh-vishwakarma-palamu-jharkhand-ai-news')) {
            console.log(`Skipping exclusive news: ${article.title}`);
            continue;
        }
        
        try {
            await client.delete(article._id);
            console.log(`✅ Deleted: ${article.title}`);
            deletedCount++;
        } catch (err) {
            console.error(`❌ Failed to delete ${article._id}:`, err.message);
        }
    }
    
    console.log(`✨ Successfully deleted ${deletedCount} articles.`);
}

deleteAllArticles();
