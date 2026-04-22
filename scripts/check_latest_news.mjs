import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function checkLatest() {
    console.log('🔍 Checking the latest news articles in the database...');
    
    // Fetch last 5 articles ordered by creation time
    const query = `*[_type == "article"] | order(_createdAt desc)[0...5] {
        title,
        _createdAt,
        "isAIImage": defined(featureImage) || defined(image_url),
        image_url,
        "hasFeatureImage": defined(featureImage)
    }`;
    
    try {
        const docs = await client.fetch(query);
        console.log(`\n✅ Found ${docs.length} recent articles:\n`);
        
        docs.forEach((doc, idx) => {
            const date = new Date(doc._createdAt);
            const timeStr = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
            console.log(`${idx + 1}. [${timeStr}] ${doc.title} (Image Attached: ${doc.isAIImage ? 'Yes' : 'No'})`);
        });
        
    } catch (e) {
        console.error('Error fetching articles:', e.message);
    }
}

checkLatest();
