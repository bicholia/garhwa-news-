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
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function run() {
    try {
        console.log("🧹 Purging specific malformed articles...");
        
        // Deleting the two known malformed articles
        const targetIds = ['VSfH2P8elEP69DpOwxKTx4', 'VSfH2P8elEP69DpOwxNKeI'];
        
        console.log(`Deleting articles with IDs: ${targetIds.join(', ')}`);
        const transaction = client.transaction();
        targetIds.forEach(id => transaction.delete(id));
        const result = await transaction.commit();
        console.log("✅ Specific malformed articles successfully deleted!", result);
        
    } catch (e) {
        console.error("❌ Error running cleanup script:", e.message);
    }
}
run();
