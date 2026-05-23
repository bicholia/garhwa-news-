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

async function run() {
    try {
        const articles = await client.fetch(`*[_type == "article"] { "categoryName": category->name, "categorySlug": category->slug.current }`);
        const nameCounts = {};
        const slugCounts = {};
        articles.forEach(a => {
            nameCounts[a.categoryName] = (nameCounts[a.categoryName] || 0) + 1;
            slugCounts[a.categorySlug] = (slugCounts[a.categorySlug] || 0) + 1;
        });
        console.log("Articles by category name:", nameCounts);
        console.log("Articles by category slug:", slugCounts);
    } catch (e) {
        console.error(e);
    }
}
run();
