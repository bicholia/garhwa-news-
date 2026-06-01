import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    dotenv.config({ path: join(__dirname, '../.env.production.local') });
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function setDummyImage() {
    console.log('🔍 Searching for articles with missing images...');

    const articles = await client.fetch(`*[_type == "article" && (!defined(featureImage) || !defined(featureImage.asset) || featureImage.asset._ref == "")]`);
    console.log(`Found ${articles.length} articles with missing images.`);

    if (articles.length === 0) {
        console.log('✅ No articles with missing images.');
        return;
    }

    // Try to get a generic dummy image for "Think India Bureau"
    console.log('🖼️ Generating/Fetching Dummy Image...');
    let assetId;
    try {
        const dummyImageUrl = `https://pollinations.ai/p/Professional%20News%20Studio%20Background%20Think%20India%20Bureau%20Breaking%20News?width=1200&height=630&nologo=true&seed=12345`;
        const response = await fetch(dummyImageUrl);
        if (!response.ok) throw new Error('Image fetch failed');
        const buffer = await response.buffer();
        const asset = await client.assets.upload('image', buffer, {
            filename: `think-india-bureau-dummy.jpg`
        });
        assetId = asset._id;
        console.log('✅ Dummy Image uploaded to Sanity:', assetId);
    } catch (err) {
        console.error('❌ Failed to create dummy image asset:', err.message);
        return;
    }

    let fixedCount = 0;
    for (const article of articles) {
        try {
            await client.patch(article._id)
                .set({
                    featureImage: {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: assetId }
                    }
                })
                .commit();
            console.log(`✅ Fixed: ${article.title}`);
            fixedCount++;
        } catch (err) {
            console.error(`❌ Failed to fix ${article._id}:`, err.message);
        }
    }

    console.log(`✨ Process completed. Added dummy image to ${fixedCount} articles.`);
}

setDummyImage();
