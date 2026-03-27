import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2023-05-03',
    token: process.env.SANITY_TOKEN,
});

async function verify() {
    console.log('🔍 Verifying last 20 articles...');
    const query = '*[_type == "article"] | order(publishedAt desc) [0...20] { title, district, category->{name} }';
    const results = await client.fetch(query);
    
    results.forEach((article, i) => {
        console.log(`${i + 1}. [${article.district.toUpperCase()}] ${article.title} (${article.category?.name || 'No Category'})`);
    });
}

verify();
