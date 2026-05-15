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

function normalizeText(t) {
    if (!t || typeof t !== 'string') return '';
    let norm = t.trim().toLowerCase();
    // Remove punctuation, special characters, keeping Hindi Unicode
    norm = norm.replace(/[^\w\s\u0900-\u097F]/gi, ''); 
    // Remove all whitespace
    norm = norm.replace(/\s+/g, '');
    // Remove known competitor brand names and variations
    const brandSuffixes = /(prabhat khabar|prabhatkhabar|dainik jagran|jagran|live hindustan|hindustan|dainik bhaskar|bhaskar|aaj tak|zee news|news18|etv|amar ujala|ndtv|abp news|प्रभात खबर|प्रभातखबर|दैनिक जागरण|जागरण|हिंदुस्तान|हिन्दुस्तान|दैनिक भास्कर|भास्कर|आज तक|अमर उजाला|prabhatkhabarcom|jagrancom|livehindustancom|hindustantimescom|bhaskarcom|aajtak|aajtakin)/gi;
    norm = norm.replace(brandSuffixes, '');
    return norm;
}

async function aggressiveClean() {
    console.log('🔍 Fetching all articles for aggressive cleanup...');
    const articles = await client.fetch(`*[_type == "article"]{ _id, title, _createdAt }`);
    console.log(`Found ${articles.length} articles in total.`);

    const normMap = new Map();

    articles.forEach(article => {
        if (!article.title) return;
        const norm = normalizeText(article.title);
        if (!norm) return;

        if (normMap.has(norm)) {
            normMap.get(norm).push(article);
        } else {
            normMap.set(norm, [article]);
        }
    });

    let deleteCount = 0;
    const toDelete = [];

    for (const [norm, docs] of normMap.entries()) {
        if (docs.length > 1) {
            console.log(`\n📌 Normalized Title: "${norm}" (${docs.length} copies)`);
            // Sort by createdAt descending (newest first)
            docs.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
            
            console.log(`  Keeping: [${docs[0]._id}] "${docs[0].title}" (${docs[0]._createdAt})`);
            for (let i = 1; i < docs.length; i++) {
                console.log(`  Deleting: [${docs[i]._id}] "${docs[i].title}" (${docs[i]._createdAt})`);
                toDelete.push(docs[i]._id);
                deleteCount++;
            }
        }
    }

    console.log(`\nTotal duplicates found: ${deleteCount}`);

    const dryRun = process.env.DRY_RUN !== 'false';
    if (dryRun) {
        console.log('\n🛑 DRY RUN: No documents were deleted. Run with DRY_RUN=false to delete.');
    } else {
        if (toDelete.length === 0) {
            console.log('No duplicates found.');
            return;
        }
        console.log(`\n💥 Deleting ${toDelete.length} documents...`);
        // Batch delete or one by one
        for (const id of toDelete) {
            try {
                await client.delete(id);
                console.log(`✅ Deleted: ${id}`);
            } catch (err) {
                console.error(`❌ Failed to delete ${id}:`, err.message);
            }
        }
        console.log('✨ Aggressive Cleanup complete!');
    }
}

aggressiveClean();
