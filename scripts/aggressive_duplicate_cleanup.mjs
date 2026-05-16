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

function normalizeTitle(title) {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^\w\s\u0900-\u097F]/gi, '') // Keep alphanumeric and Hindi
        .replace(/\s+/g, ' ')
        .trim();
}

async function findAndCleanDuplicates() {
    console.log('🔍 Fetching all articles with metadata...');
    const articles = await client.fetch(`*[_type == "article"]{ _id, title, originalSource, _createdAt, "slug": slug.current }`);
    console.log(`Found ${articles.length} articles in total.`);

    const toDelete = new Set();
    const sortedArticles = [...articles].sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

    console.log('\n--- Checking for Near-Identical Titles (First 40 chars) ---');
    const seenPrefixes = new Map();

    sortedArticles.forEach(article => {
        const norm = normalizeTitle(article.title);
        if (!norm) return;
        
        const prefix = norm.substring(0, 40);
        if (prefix.length < 20) return; // Ignore very short titles for this check

        if (seenPrefixes.has(prefix)) {
            const original = seenPrefixes.get(prefix);
            console.log(`📌 Potential Duplicate:`);
            console.log(`  Keeping:  [${original._id}] ${original.title}`);
            console.log(`  Deleting: [${article._id}] ${article.title}`);
            toDelete.add(article._id);
        } else {
            seenPrefixes.set(prefix, article);
        }
    });

    console.log('\n--- Checking for Same originalSource ---');
    const seenSources = new Map();
    sortedArticles.forEach(article => {
        if (!article.originalSource) return;
        const src = article.originalSource.trim();
        if (!src) return;

        if (seenSources.has(src)) {
            const original = seenSources.get(src);
            if (!toDelete.has(article._id)) {
                console.log(`📌 Same originalSource Found:`);
                console.log(`  Keeping:  [${original._id}] ${original.title}`);
                console.log(`  Deleting: [${article._id}] ${article.title}`);
                toDelete.add(article._id);
            }
        } else {
            seenSources.set(src, article);
        }
    });

    const deleteList = Array.from(toDelete);
    console.log(`\nTotal unique duplicates to delete: ${deleteList.length}`);

    const dryRun = process.env.DRY_RUN !== 'false';
    if (dryRun) {
        console.log('\n🛑 DRY RUN: No documents were deleted. Run with DRY_RUN=false to delete.');
    } else {
        if (deleteList.length === 0) {
            console.log('No duplicates to delete.');
            return;
        }
        console.log(`\n💥 Deleting ${deleteList.length} documents...`);
        for (const id of deleteList) {
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
