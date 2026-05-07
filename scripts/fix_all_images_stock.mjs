
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.production.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const STOCK_IMAGES = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', // News
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80', // Health
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80', // Education
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', // Nature
    'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&w=1200&q=80', // Community
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80', // Finance
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'  // Tech
];

async function uploadFromUrl(url, title) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');
        const buffer = await response.buffer();
        const asset = await client.assets.upload('image', buffer, {
            filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error(`Failed to upload: ${error.message}`);
        return null;
    }
}

async function fixAll(limit = 100) {
    console.log(`🚀 Fixing up to ${limit} articles with missing images...`);

    const articles = await client.fetch(`*[_type == "article" && (!defined(featureImage) || !defined(featureImage.asset))] | order(publishedAt desc)[0...${limit}]`);
    console.log(`Found ${articles.length} articles to fix.`);

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        console.log(`[${i+1}/${articles.length}] Fixing: ${article.title}`);
        
        const stockUrl = STOCK_IMAGES[i % STOCK_IMAGES.length];
        const assetId = await uploadFromUrl(stockUrl, article.title);

        if (assetId) {
            await client.patch(article._id)
                .set({
                    featureImage: {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: assetId }
                    }
                })
                .commit();
            console.log(`✅ Fixed!`);
        }
    }

    console.log('✨ Image fixing process completed.');
}

// Run the fix
fixAll(200);
