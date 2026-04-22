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

async function fixLifeUpdate() {
    console.log('🕵️ Searching for "Life Update" category precisely...');
    
    // 1. Check all categories to see how it's named
    const cats = await client.fetch(`*[_type == "category"]{ _id, title, "slug": slug.current }`);
    const lifeCat = cats.find(c => (c.slug === 'life-update') || (c.title && (c.title === 'Life Update' || c.title.includes('Life'))));
    
    if (!lifeCat) {
        console.log('⚠️ Category "Life Update" not found. Creating it now...');
        const newCat = await client.create({
            _type: 'category',
            title: 'Life Update',
            slug: { _type: 'slug', current: 'life-update' },
            description: 'Lifestyle and Health updates from Jharkhand and beyond.'
        });
        console.log('✅ Category Created:', newCat._id);
        await populate(newCat._id, 'life-update');
    } else {
        console.log(`✅ Found category: ${lifeCat.title} [ID: ${lifeCat._id}]`);
        await populate(lifeCat._id, lifeCat.title);
    }
}

async function populate(id, title) {
    console.log(`📦 Populating news for ${title}...`);
    for (let i = 1; i <= 10; i++) {
        const doc = {
            _type: 'article',
            title: `${title}: ताज़ा जीवनशैली अपडेट ${i} - ThinkIndia.press`,
            slug: { _type: 'slug', current: `life-fix-${Date.now()}-${i}` },
            excerpt: 'बेहतर जीवन और स्वास्थ्य के लिए आज के ताज़ा अपडेट्स।',
            body: [{ _type: 'block', children: [{ _type: 'span', text: 'आज की भागदौड़ भरी ज़िंदगी में खुद का ख्याल रखना ज़रूरी है। यहाँ पढ़ें कुछ खास टिप्स।' }] }],
            category: { _type: 'reference', _ref: id },
            publishedAt: new Date().toISOString(),
            district: 'national',
            author: { _type: 'reference', _ref: 'author-rupesh' }
        };
        await client.create(doc);
        process.stdout.write('.');
    }
    console.log('\n✨ Life Update category is now FIXED and FULL!');
}

fixLifeUpdate();
