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

async function findAndCleanDuplicates() {
    console.log('🔍 Fetching all articles...');
    const articles = await client.fetch(`*[_type == "article"]{ _id, title, _createdAt }`);
    console.log(`Found ${articles.length} articles in total.`);

    const titleMap = new Map();

    articles.forEach(article => {
        if (!article.title) return;
        const title = article.title.trim();
        if (titleMap.has(title)) {
            titleMap.get(title).push(article);
        } else {
            titleMap.set(title, [article]);
        }
    });

    let deleteCount = 0;
    const toDelete = [];

    for (const [title, docs] of titleMap.entries()) {
        if (docs.length > 1) {
            console.log(`\n📌 Title: "${title}" (${docs.length} copies)`);
            // Sort by createdAt descending (newest first)
            docs.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
            
            console.log(`  Keeping: [${docs[0]._id}] ${docs[0]._createdAt}`);
            for (let i = 1; i < docs.length; i++) {
                console.log(`  Deleting: [${docs[i]._id}] ${docs[i]._createdAt}`);
                toDelete.push(docs[i]._id);
                deleteCount++;
            }
        }
    }

    console.log(`\nTotal duplicates to delete: ${deleteCount}`);

    const dryRun = process.env.DRY_RUN !== 'false';
    if (dryRun) {
        console.log('\n🛑 DRY RUN: No documents were deleted. Run with DRY_RUN=false to delete.');
    } else {
        if (toDelete.length === 0) {
            console.log('No duplicates to delete.');
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
        console.log('✨ Cleanup complete!');
    }
}

findAndCleanDuplicates();
