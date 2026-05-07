import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function auditNews() {
    console.log('🚀 Starting News Audit...');
    
    try {
        const posts = await client.fetch(`
            *[_type == "article"] | order(publishedAt desc) {
                _id,
                title,
                "hasImage": defined(featureImage),
                "hasBody": defined(body) && count(body) > 0,
                publishedAt
            }
        `);

        const missingBody = posts.filter(p => !p.hasBody);
        const missingImage = posts.filter(p => !p.hasImage);
        const bothMissing = posts.filter(p => !p.hasBody && !p.hasImage);

        console.log(`\n📊 Audit Summary:`);
        console.log(`Total Articles: ${posts.length}`);
        console.log(`❌ Missing Body: ${missingBody.length}`);
        console.log(`🖼️ Missing Image: ${missingImage.length}`);
        console.log(`⚠️ Both Missing: ${bothMissing.length}`);

        if (missingBody.length > 0) {
            console.log('\n📝 Top 10 Articles missing Body:');
            missingBody.slice(0, 10).forEach(p => {
                console.log(`- [${p.publishedAt?.split('T')[0]}] ${p.title} (${p._id})`);
            });
        }

        if (missingImage.length > 0) {
            console.log('\n🖼️ Top 10 Articles missing Image:');
            missingImage.slice(0, 10).forEach(p => {
                console.log(`- [${p.publishedAt?.split('T')[0]}] ${p.title} (${p._id})`);
            });
        }

    } catch (error) {
        console.error('❌ Error during audit:', error.message);
    }
}

auditNews();
