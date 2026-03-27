
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

async function cleanupMalformedArticles() {
    console.log('🧹 Cleaning up malformed articles...');
    try {
        // Find articles where title starts with "🏛️" or "🏥" or "🌾" or "🚔" or "कैटेगरी"
        const query = `*[_type == "article" && (title match "🏛️*" || title match "🏥*" || title match "🌾*" || title match "🚔*" || title match "कैटेगरी*")]._id`;
        const ids = await client.fetch(query);

        if (ids.length === 0) {
            console.log('✨ No malformed articles found.');
            return;
        }

        console.log(`🗑️ Deleting ${ids.length} malformed articles...`);
        const transaction = client.transaction();
        ids.forEach(id => transaction.delete(id));
        await transaction.commit();
        console.log('✅ Cleanup complete!');
    } catch (err) {
        console.error('❌ Cleanup Error:', err.message);
    }
}

cleanupMalformedArticles();
