import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function cleanDuplicates() {
    console.log('🔍 Searching for Rupesh AI news duplicates...');
    
    // Find all articles with "Rupesh", "Maa Garhdevi", or "AI" in title
    const articles = await client.fetch(`*[_type == "article" && (title match "*Rupesh*" || title match "*Maa Garhdevi*" || title match "*AI*")]{ _id, title }`);
    
    console.log(`Found ${articles.length} potential articles:`);
    articles.forEach(a => console.log(`- [${a._id}] ${a.title}`));
    
    const toKeepId = 'news-rupesh-v4-ai-story'; 
    const toDelete = articles.filter(a => a._id !== toKeepId && (a.title.includes('Rupesh') || a.title.includes('AI') || a.title.includes('Maa Garhdevi')));
    
    console.log(`Keeping: ${toKeepId}`);
    console.log(`Deleting: ${toDelete.length} duplicates...`);
    
    for (const doc of toDelete) {
        try {
            await client.delete(doc._id);
            console.log(`✅ Deleted: ${doc._id} (${doc.title})`);
        } catch (err) {
            console.error(`❌ Failed to delete ${doc._id}:`, err.message);
        }
    }
    
    console.log('✨ Cleanup complete!');
}

cleanDuplicates();
