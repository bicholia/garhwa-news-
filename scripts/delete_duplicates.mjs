import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function deleteDuplicates() {
    console.log('🔍 Finding duplicate news articles...');
    
    // Fetch all articles title and _id
    const articles = await client.fetch(`*[_type == "article"] { _id, title, publishedAt }`);
    
    console.log(`📊 Total articles found: ${articles.length}`);
    
    const titleMap = new Map();
    const toDelete = [];
    
    articles.forEach(article => {
        const title = article.title?.trim().toLowerCase();
        if (!title) return;
        
        if (titleMap.has(title)) {
            // Compare publishedAt to keep the oldest or newest?
            // Usually we keep the oldest one if they are identical.
            const existing = titleMap.get(title);
            if (new Date(article.publishedAt) < new Date(existing.publishedAt)) {
                // Current is older, keep it, delete previous
                toDelete.push(existing._id);
                titleMap.set(title, article);
            } else {
                // Previous is older or same, keep previous, delete current
                toDelete.push(article._id);
            }
        } else {
            titleMap.set(title, article);
        }
    });
    
    console.log(`🗑️ Found ${toDelete.length} duplicates to delete.`);
    
    if (toDelete.length === 0) {
        console.log('✅ No duplicates found.');
        return;
    }
    
    // Batch delete
    console.log('🚀 Starting deletion...');
    for (let i = 0; i < toDelete.length; i += 10) {
        const batch = toDelete.slice(i, i + 10);
        await Promise.all(batch.map(id => {
            console.log(`❌ Deleting document: ${id}`);
            return client.delete(id);
        }));
        console.log(`✅ Batch ${Math.floor(i/10) + 1} complete.`);
    }
    
    console.log('🎉 Duplicates cleaned successfully!');
}

deleteDuplicates().catch(console.error);
