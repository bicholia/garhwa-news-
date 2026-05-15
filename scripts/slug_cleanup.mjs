import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function slugCleanup() {
    console.log('🔍 Fetching all articles for slug cleanup...');
    const articles = await client.fetch(`*[_type == "article"]{ _id, "slug": slug.current, _createdAt }`);
    console.log(`Found ${articles.length} articles in total.`);

    const slugMap = new Map();

    articles.forEach(article => {
        if (!article.slug) return;
        const slug = article.slug;

        if (slugMap.has(slug)) {
            slugMap.get(slug).push(article);
        } else {
            slugMap.set(slug, [article]);
        }
    });

    let deleteCount = 0;
    const toDelete = [];

    for (const [slug, docs] of slugMap.entries()) {
        if (docs.length > 1) {
            console.log(`\n📌 Slug: "${slug}" (${docs.length} copies)`);
            docs.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
            
            console.log(`  Keeping: [${docs[0]._id}] (${docs[0]._createdAt})`);
            for (let i = 1; i < docs.length; i++) {
                console.log(`  Deleting: [${docs[i]._id}] (${docs[i]._createdAt})`);
                toDelete.push(docs[i]._id);
                deleteCount++;
            }
        }
    }

    console.log(`\nTotal slug duplicates found: ${deleteCount}`);

    const dryRun = process.env.DRY_RUN !== 'false';
    if (dryRun) {
        console.log('\n🛑 DRY RUN: No documents were deleted. Run with DRY_RUN=false to delete.');
    } else {
        if (toDelete.length === 0) {
            console.log('No duplicates found.');
            return;
        }
        console.log(`\n💥 Deleting ${toDelete.length} documents...`);
        for (const id of toDelete) {
            try {
                await client.delete(id);
                console.log(`✅ Deleted: ${id}`);
            } catch (err) {
                console.error(`❌ Failed to delete ${id}:`, err.message);
            }
        }
        console.log('✨ Slug Cleanup complete!');
    }
}

slugCleanup();
