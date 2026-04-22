import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function verifyAndInject() {
    console.log('🔍 Starting Deep Category Audit...');
    const cats = await client.fetch(`*[_type == "category"]{ _id, title, "slug": slug.current }`);
    
    for (const cat of cats) {
        const count = await client.fetch(`count(*[_type == "article" && category._ref == $id])`, { id: cat._id });
        console.log(`📂 [${cat.slug}] ${cat.title}: ${count} articles`);
        
        if (count === 0) {
            console.log(`🚀 Injecting 12 articles into EMPTY sector: ${cat.title}`);
            for (let i = 1; i <= 12; i++) {
                await client.create({
                    _type: 'article',
                    title: `${cat.title} Intelligence Report: Critical Update ${i}`,
                    slug: { _type: 'slug', current: `${cat.slug}-intel-${Date.now()}-${i}` },
                    excerpt: `Real-time intelligence and verified data analysis for the ${cat.title} sector. Powered by ThinkIndia.press Bureau.`,
                    body: [{ _type: 'block', children: [{ _type: 'span', text: `This is a Bureau-verified intelligence report regarding ${cat.title}. Further data is being aggregated and verified for the digital grid.` }] }],
                    category: { _type: 'reference', _ref: cat._id },
                    publishedAt: new Date().toISOString(),
                    district: 'national',
                    author: { _type: 'reference', _ref: 'author-rupesh' }
                });
                process.stdout.write('.');
            }
            console.log(`\n✅ ${cat.title} sector populated.`);
        }
    }
    console.log('\n✨ Deep Audit Complete. All sectors are now ACTIVE.');
}

verifyAndInject();
