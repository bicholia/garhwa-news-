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

async function autoFillAllCategories() {
    console.log('🔍 Fetching all categories from Sanity...');
    const categories = await client.fetch(`*[_type == "category"]{ _id, title, "slug": slug.current }`);
    
    console.log(`Found ${categories.length} categories. Starting auto-fill...`);

    for (const cat of categories) {
        // Check if category already has enough news
        const count = await client.fetch(`count(*[_type == "article" && category._ref == $id])`, { id: cat._id });
        
        if (count >= 10) {
            console.log(`✅ ${cat.title} already has ${count} articles. Skipping.`);
            continue;
        }

        const needed = 10 - count;
        console.log(`📦 Populating ${needed} more articles for: ${cat.title}`);

        for (let i = 1; i <= needed; i++) {
            const date = new Date();
            date.setHours(date.getHours() - (i * 2));
            
            const doc = {
                _type: 'article',
                title: `${cat.title}: विशेष डिजिटल कवरेज - ${i}`,
                slug: { _type: 'slug', current: `${cat.slug}-auto-${Date.now()}-${i}` },
                excerpt: `${cat.title} से जुड़ी हर छोटी-बड़ी खबर अब सबसे पहले ThinkIndia.press पर। जानिए क्या है आज का मुख्य अपडेट।`,
                body: [
                    {
                        _type: 'block',
                        children: [{ _type: 'span', text: `${cat.title} क्षेत्र की महत्वपूर्ण घटनाओं और सूचनाओं का विश्लेषण यहाँ उपलब्ध है। हमारी टीम लगातार ताज़ा अपडेट्स जुटाने में लगी है।` }]
                    }
                ],
                district: 'national',
                category: { _type: 'reference', _ref: cat._id },
                publishedAt: date.toISOString(),
                author: { _type: 'reference', _ref: 'author-rupesh' }
            };

            try {
                await client.create(doc);
                process.stdout.write('.');
            } catch (err) {
                process.stdout.write('x');
            }
        }
        console.log(`\n✅ ${cat.title} filled.`);
    }
    console.log('\n✨ ALL categories across the portal are now FULL of news!');
}

autoFillAllCategories();
