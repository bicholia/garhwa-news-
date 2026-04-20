import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.production.local') });
dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function cleanupCustom() {
    console.log('🔍 Identifying news to delete...');
    
    // List the categories to find the "love" and "lifestyle" related ones
    const categories = await client.fetch(`*[_type == "category"]{
      _id,
      title,
      "slug": slug.current
    }`);
    
    const keepCategoryIds = new Set();
    categories.forEach(c => {
        const titleMatch = c.title && (c.title.toLowerCase().includes('प्रेम') || c.title.toLowerCase().includes('love') || c.title.toLowerCase().includes('life'));
        const slugMatch = c.slug && (c.slug.includes('love') || c.slug.includes('prem') || c.slug.includes('life') || c.slug.includes('zindagi'));
        
        if (titleMatch || slugMatch) {
            keepCategoryIds.add(c._id);
            console.log(`❤️  Will KEEP articles from Category: ${c.title || 'Untitled'} (${c.slug || c._id})`);
        }
    });

    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    console.log(`\nDeleting articles older than 48 hours (cutoff: ${cutoffTime})`);
    
    // Query for old articles
    const query = `*[_type == "article" && _createdAt < $cutoffTime]{
        _id,
        title,
        _createdAt,
        "categoryId": category._ref
    }`;
    
    const allArticles = await client.fetch(query, { cutoffTime });

    console.log(`\nTotal old articles found: ${allArticles.length}`);

    let deleteCount = 0;
    let keepCount = 0;
    for (const article of allArticles) {
        if (keepCategoryIds.has(article.categoryId)) {
            console.log(`✅ Keeping (Love/Life): ${article.title} (Created: ${article._createdAt})`);
            keepCount++;
        } else {
            console.log(`🗑️ Deleting: ${article.title} (Created: ${article._createdAt})`);
            try {
                await client.delete(article._id);
                deleteCount++;
            } catch(e) {
                console.log(`❌ Failed to delete ${article._id}: ${e.message}`);
            }
            
            // tiny delay to avoid rate limit
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log(`\n🎉 Process Complete! Deleted ${deleteCount} articles. Kept ${keepCount} articles.`);
}

cleanupCustom();
