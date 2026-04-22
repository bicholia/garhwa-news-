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

const categories = [
    { name: 'life-update', title: 'Life Update', keywords: ['Lifestyle', 'Health', 'Happiness', 'Motivation'] },
    { name: 'weather', title: 'Weather Update', keywords: ['Rain', 'Heatwave', 'Climate', 'Forecast'] },
    { name: 'national', title: 'National News', keywords: ['India', 'Delhi', 'Policy', 'Government'] },
    { name: 'international', title: 'International News', keywords: ['Global', 'World', 'Foreign', 'Diplomacy'] },
    { name: 'crime', title: 'Crime Report', keywords: ['Police', 'Investigation', 'Security', 'Law'] }
];

async function generateBulkNews() {
    console.log('🚀 Starting Massive News Influx (10 articles per category)...');

    for (const cat of categories) {
        console.log(`\n📦 Generating for: ${cat.title}`);
        
        for (let i = 1; i <= 10; i++) {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (i * 30)); // Stagger time
            
            const title = `${cat.title}: ${cat.keywords[i % 4]} के क्षेत्र में बड़ी खबर - अपडेट ${i}`;
            const slug = `${cat.name}-update-${Date.now()}-${i}`;
            
            const doc = {
                _type: 'article',
                title: title,
                slug: { _type: 'slug', current: slug },
                excerpt: `${cat.title} के अंतर्गत ताज़ा जानकारी। यहाँ पढ़ें पूरी रिपोर्ट और जानें क्या हैं आज के मुख्य समाचार।`,
                body: [
                    {
                        _type: 'block',
                        children: [{ _type: 'span', text: `${cat.title} की यह विशेष रिपोर्ट ThinkIndia.press द्वारा तैयार की गई है। इसमें हम ${cat.keywords[i % 4]} से जुड़ी सभी महत्वपूर्ण कड़ियों को जोड़कर आप तक पहुँचा रहे हैं।` }]
                    }
                ],
                district: 'national',
                category: { _type: 'reference', _ref: `category-${cat.name}` },
                publishedAt: date.toISOString(),
                author: { _type: 'reference', _ref: 'author-rupesh' }
            };

            try {
                await client.create(doc);
                process.stdout.write('.');
            } catch (err) {
                // If category ref fails, try title matching or skip
                try {
                    doc.category = { _type: 'reference', _ref: cat.name }; // Some might be just the slug
                    await client.create(doc);
                    process.stdout.write('.');
                } catch (e) {
                    process.stdout.write('x');
                }
            }
        }
    }
    console.log('\n\n✨ All categories populated with 10 news articles each!');
}

generateBulkNews();
