
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

async function uploadImage(englishPrompt, title) {
    try {
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(englishPrompt)}?width=1024&height=768&nologo=true&seed=${seed}`;
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Image fetch failed');
        const buffer = await response.buffer();
        const asset = await client.assets.upload('image', buffer, {
            filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${seed}.jpg`
        });
        return asset._id;
    } catch (error) {
        console.error(`Failed to upload image for ${title}:`, error.message);
        return null;
    }
}

// Simple English keywords for common categories to use as fallback prompts
const fallbackPrompts = {
    'health': 'Professional healthcare, doctor and patient, medical equipment, realistic',
    'education': 'University campus, students studying, graduation cap, modern education',
    'religion': 'Spiritual symbols, peaceful temple, religious ceremony, cinematic lighting',
    'sex': 'Relationship, holding hands, sexual health awareness, professional illustration',
    'depression': 'Mental health support, person talking to therapist, calm and empathetic atmosphere',
    'local': 'Indian city street, local market, community gathering, journalism style',
    'india': 'Iconic Indian architecture, national flag, vibrant Indian culture'
};

async function fixMissingImages() {
    console.log('🔍 Searching for articles with missing images...');

    const articles = await client.fetch(`*[_type == "article" && (!defined(featureImage) || !defined(featureImage.asset))] | order(publishedAt desc)[0...30]`);

    console.log(`Found ${articles.length} articles with missing images.`);

    for (const article of articles) {
        console.log(`🛠️ Fixing: ${article.title}`);
        
        let prompt = "News report illustration, realistic journalism style";
        
        // Try to guess a good English prompt based on category or title keywords
        if (article.title.includes('डिप्रेशन') || article.title.includes('मानसिक')) prompt = fallbackPrompts.depression;
        else if (article.title.includes('स्वास्थ्य') || article.title.includes('बीमारी')) prompt = fallbackPrompts.health;
        else if (article.title.includes('शिक्षा') || article.title.includes('स्कूल')) prompt = fallbackPrompts.education;
        else if (article.title.includes('धर्म') || article.title.includes('यात्रा')) prompt = fallbackPrompts.religion;
        else if (article.title.includes('यौन') || article.title.includes('रिश्ते')) prompt = fallbackPrompts.sex;
        else if (article.district === 'garhwa') prompt = fallbackPrompts.local;
        else if (article.district === 'india') prompt = fallbackPrompts.india;

        const assetId = await uploadImage(prompt, article.title);

        if (assetId) {
            await client.patch(article._id)
                .set({
                    featureImage: {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: assetId }
                    }
                })
                .commit();
            console.log(`✅ Fixed: ${article.title}`);
        } else {
            console.log(`❌ Failed to fix: ${article.title}`);
        }
    }

    console.log('✨ Image fixing process completed.');
}

fixMissingImages();
