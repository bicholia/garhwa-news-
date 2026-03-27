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

async function cleanupOldNews() {
    console.log('🔍 Identifying news to delete...');
    
    // First, let's list the categories to find the "love" related one
    const categories = await client.fetch(`*[_type == "category"]{
      _id,
      title,
      "slug": slug.current
    }`);
    
    console.log('\nFound Categories:');
    let loveCategoryId = null;
    categories.forEach(c => {
        console.log(`- ${c.title} (${c.slug})`);
        // Check if title or slug contains love/prem
        if (
            (c.title && (c.title.toLowerCase().includes('प्रेम') || c.title.toLowerCase().includes('love'))) ||
            (c.slug && (c.slug.includes('love') || c.slug.includes('prem')))
        ) {
            loveCategoryId = c._id;
        }
    });

    console.log(`\n❤️ Keeping Category ID: ${loveCategoryId || 'None found'}`);

    // Query for all articles
    const allArticles = await client.fetch(`*[_type == "article"]{
        _id,
        title,
        "categoryId": category._ref
    }`);

    console.log(`\nTotal articles found: ${allArticles.length}`);

    let deleteCount = 0;
    for (const article of allArticles) {
        if (article.categoryId === loveCategoryId && loveCategoryId !== null) {
            console.log(`✅ Keeping: ${article.title}`);
        } else {
            console.log(`🗑️ Deleting: ${article.title}`);
            try {
                await client.delete(article._id);
                deleteCount++;
            } catch(e) {
                console.log(`Failed to delete ${article._id}: ${e.message}`);
            }
            
            // tiny delay to avoid rate limit
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log(`\n🎉 Process Complete! Deleted ${deleteCount} articles.`);
}

cleanupOldNews();
